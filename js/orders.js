var Order = function () {
    $('#newOrder').on('click', this.newOrder.bind(this));
    $('#manageOrder').on('click', this.getList.bind(this));

    $('#orderCancel').on('click', function () {
        $('div#order').toggle();
    });

    $('#orderForm').on('submit', this.handleFormSubmit.bind(this));
};

Order.prototype.newOrder = function () {
    $('div#order').css('display', 'block');

    $.ajax({
        url: '/articles'
    }).done(function (data) {

    });

    // fill dropdown
    // handle slider
};

Order.prototype.handleFormSubmit = function (e) {
    e.preventDefault();

    var values = {
        article: $('#orderArt').val(),
        customer: $('#orderCust').val(),
        amount: $('#orderAmount').val()
    };

    $.ajax({
        url: '/orders',
        type: 'POST',
        data: values
    }).done(function (res) {
            $('div.popup').hide();
            $('#content').empty();
            $('#orderForm')[0].reset();
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

    var header = $('<table cellspacing="0" border="1"><tr>'+
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
        '<td>edit</td>'+
        '<td>delete</td>'+
        '</tr>');
    table.append(order);
};
