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
};

Order.prototype.rebuildDropdowns = function () {
    $('#orderArt').empty();
    $('#ordercust').empty();

    $.ajax({
        url: '/articles'
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
    $('div#order').css('display', 'block');
    this.rebuildDropdowns();
};

Order.prototype.handleFormSubmit = function (e) {
    e.preventDefault();

    var values = {
        article: $('#orderArt').val(),
        customer: $('#orderCust').val(),
        amount: $('#orderAmount').val(),
        orderId: $('#orderId').val()
    };

    var type = 'POST';
    if ($('#orderId').val()) {
        type = 'PUT';
    }

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

    return false;
};

Order.prototype.getList = function () {

    $.ajax({
        url: '/orders'
    }).done(function (data) {

        var custid,
            contentBox = $('#content'),
            table;

        contentBox.empty();

        for (var i = 0; i < data.length; i++) {
            if (!custid) {
                custid = data[i].customer_id;
                table = this.startCustomerSection(contentBox, data[i]);
            }
            if (custid !== data[i].customer_id) {
                custid = data[i].customer_id;
                this.endCustomerSection(contentBox, table);
                table = this.startCustomerSection(contentBox, data[i]);
            }

            this.orderRow(table, data[i]);

        }
        this.endCustomerSection(contentBox, table);
    }.bind(this));

};

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
    var order = $('<tr>'+
        '<td>'+data.article_id+'</td>'+
        '<td>'+data.name+'</td>'+
        '<td>'+(data.price /100)+'</td>'+
        '<td>'+data.amount+'</td>'+
        '<td>'+(data.price/100*data.amount)+'</td>'+
        '<td><a onclick="order.edit('+data.rowid+')">edit</a></td>'+
        '<td><a onclick="order.delete('+data.rowid+')">delete</a></td>'+
        '</tr>');
    table.append(order);
};

Order.prototype.edit = function (id) {
    $('div#order').show();
    this.rebuildDropdowns();

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
};

Order.prototype.delete = function (id) {
    $.ajax({
        url: '/orders/id/' + id,
        type: 'DELETE'
    }).done(function (data) {
        $('#content').empty();
        order.getList();
    });
}