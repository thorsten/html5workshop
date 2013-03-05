var Order = function () {
    $('#newOrder').on('click', this.newOrder.bind(this));
    $('#manageOrder').on('click', this.getList.bind(this));

    $('#orderCancel').on('click', function () {
        $('div#order').toggle();
    });

    $('#orderForm').on('submit', this.handleFormSubmit.bind(this));

    $('#orderAmount').on('change', function (e) {
        $('#dispAmount').html($('#orderAmount').val());
    });

    $('#localstorage').on('click', function () {
        if ($('#localstorage').html() == 'localstorage') {
            $('#localstorage').html('remote');
            this.mode = 'local';
            this.fillLocalstorage();
        } else {
            $('#localstorage').html('localstorage');
            this.mode = 'remote';
            this.syncLocalstorage();
            localStorage.clear();
        }
    }.bind(this));
};

Order.prototype.mode = 'remote';


Order.prototype.fillLocalstorage = function () {
    $.ajax({
        url: '/orders'
    }).done(function (data) {
        for (var i = 0; i < data.length; i++) {
            localStorage.setItem(data[i].rowid, JSON.stringify(data[i]));
        }
        this.renderList(localStorage);
    }.bind(this));
};

Order.prototype.syncLocalstorage = function () {
    this.mode = 'remote';
    var data;

    for (var i in localStorage) {
        data = localStorage.getItem(i);

        if (data == 'delete') {
            this.delete(i);
        }

        data = JSON.parse(data);

        var values = {'customer': data.customer_id, 'article': data.article_id, 'amount': data.amount};
        if ((i + '').search(/new/) != -1) {
            $.ajax({
                url: '/orders',
                type: 'POST',
                data: values,
                async: false
            });
            continue;
        } else if (data.edit) {
            values.orderId = data.orderId;
            $.ajax({
                url: '/orders',
                type: 'PUT',
                data: values,
                async: false
            });
            continue;
        }
    }

    localStorage.clear();

    this.getList();
};

Order.prototype.rebuildDropdowns = function () {
    $('#orderArt').empty();
    $('#ordercust').empty();

    $.ajax({
        url: '/articles',
        async: false
    }).done(function (data) {
        for (var i = 0; i < data.length; i++) {
            $('#orderArt').append(new Option(data[i].name, data[i].rowid));
        }
    });

    $.ajax({
        url: '/customers'
    }).done(function (data) {
        for (var i = 0; i < data.length; i++) {
            $('#orderCust').append(new Option(data[i].name, data[i].rowid));
        }
    });
}


Order.prototype.newOrder = function () {
    $("#order").removeClass("hidden");
    this.rebuildDropdowns();
};

Order.prototype.handleFormSubmit = function (e) {
    e.preventDefault();

    if (this.mode == 'local') {
        var orderId = $('#orderId').val();
        if ($('#orderId').val() == '') {
            orderId = 'new' + (localStorage.length + 1);
        }

        $.ajax({url: '/articles/id/' + $('#orderArt').val()}).done(function (art) {
            $.ajax({url: '/customers/id/' + $('#orderCust').val()}).done(function (cust) {
                var values = {
                    "customer_id": $('#orderCust').val(),
                    "article_id":$('#orderArt').val(),
                    "amount":$('#orderAmount').val(),
                    "name":art.name,
                    "firstname":cust.firstname,
                    "surname":cust.surname,
                    "street":cust.street,
                    "place":cust.place,
                    "country":cust.country,
                    "price":art.price,
                    "description":art.description,
                    "rowid":orderId,
                    "cname":cust.name,
                    "edit": false
                };

                if ($('#orderId').val() != '') {
                    values.edit = true;
                }

                localStorage.setItem(orderId, JSON.stringify(values));
                $('div.popup').hide();
                $('#content').empty();
                $('#orderForm')[0].reset();
                $('#dispAmount').html('0');
                order.renderList(localStorage);
            });
        });
    } else {
        var type = 'POST';
        if ($('#orderId').val()) {
            type = 'PUT';
        }

        var values = {
            article: $('#orderArt').val(),
            customer: $('#orderCust').val(),
            amount: $('#orderAmount').val(),
            orderId: $('#orderId').val()
        };

        $.ajax({
            url: '/orders',
            type: type,
            data: values
        }).done(function (res) {
            $('div.popup').hide();
            $('#content').empty();
            $('#orderForm')[0].reset();
            $('#dispAmount').html('0');
            order.getList();
        });
    }


    return false;
};

Order.prototype.renderList = function (data) {
    var custid,
        contentBox = $('#content'),
        table, tempData;

    contentBox.empty();

    for (var i in data) {
        tempData = data[i];
        if (this.mode == 'local') {
            if (data.getItem(i) == 'delete') {
                continue;
            }
            tempData = JSON.parse(data.getItem(i));
        }

        if (!custid) {
            custid = tempData.customer_id;
            table = this.startCustomerSection(contentBox, tempData);
        }

        if (custid != tempData.customer_id) {
            custid = tempData.customer_id;
            this.endCustomerSection(contentBox, table);
            table = this.startCustomerSection(contentBox, tempData);
        }

        this.orderRow(table, tempData);

    }
    this.endCustomerSection(contentBox, table);
};

Order.prototype.getList = function () {
    $.ajax({
        url: '/orders'
    }).done(function (data) {
        this.renderList(data);
    }.bind(this));
}

Order.prototype.startCustomerSection = function (el, data) {
    this.writeCustomerName(el, data);
    return this.beginTable();
}

Order.prototype.writeCustomerName = function (el, data) {
    var customer = '<span class="custname">' +
        data.cname +
        '</span> ' +
        '<span class="custadd">'+
        data.firstname + ' ' +
        data.surname + ' ' +
        data.street + ' ' +
        data.place + ' ' +
        data.country+
        '</span>';

    el.append(customer);
};

Order.prototype.beginTable = function () {

    var header = $('<table cellspacing="0" border="1" class="table table-striped"><tr>'+
        '<td>Artikelnummer</td>'+
        '<td>Artikelbezeichnung</td>'+
        '<td>Preis/Stück</td>'+
        '<td>Menge</td>'+
        '<td>Gesamtpreis</td>'+
        '</tr></table>');

    var table = $(header);
    return table;
};

Order.prototype.endCustomerSection = function (content, table) {
    content.append(table);
};

Order.prototype.orderRow = function (table, data) {
    var tdClass = '';
    if (this.mode == 'local') {
        tdClass = ' class="colorful"';
    }

    var order = $('<tr>'+
        '<td'+tdClass+'>'+data.article_id+'</td>'+
        '<td>'+data.name+'</td>'+
        '<td>'+(data.price /100)+'</td>'+
        '<td>'+data.amount+'</td>'+
        '<td>'+(data.price/100*data.amount)+'</td>'+
        '<td><a onclick="order.edit(\''+data.rowid+'\')">edit</a></td>'+
        '<td><a onclick="order.delete(\''+data.rowid+'\')">delete</a></td>'+
        '</tr>');
    table.append(order);
};

Order.prototype.edit = function (id) {
    $('div#order').show();
    this.rebuildDropdowns();

    if (this.mode == 'local') {
        var data = JSON.parse(localStorage.getItem(id));
        $('#orderId').val(data.rowid);
        $('#orderArt').val(data.article_id);
        $('#orderCust').val(data.customer_id);
        $('#orderAmount').val(data.amount);
        $('#dispAmount').html(data.amount);
    } else {
        $.ajax({
            url: '/orders/id/' + id,
            type: 'GET'
        }).done(function (data) {
            $('#orderId').val(data.rowid);
            $('#orderArt').val(data.article_id);
            $('#orderCust').val(data.customer_id);
            $('#orderAmount').val(data.amount);
            $('#dispAmount').html(data.amount);
        });
    }
};

Order.prototype.delete = function (id) {
    if (this.mode == 'local') {
        localStorage.setItem(id, 'delete');
        order.renderList(localStorage);
    } else {
        $.ajax({
            url: '/orders/id/' + id,
            type: 'DELETE',
            async: false
        }).done(function (data) {
            $('#content').empty();
            order.getList();
        });
    }
}