var Order = function () {

    $('#newCustomer').on('click', this.newCustomer.bind(this));
    $('#newOrder').on('click', this.newOrder.bind(this));
    $('#newArticle').on('click', this.newArticle.bind(this));

};

Order.prototype.newCustomer = function () {
    console.log('newCustomer');
};

Order.prototype.newOrder = function () {
    console.log('newOrder');
};

Order.prototype.newArticle = function () {
    console.log('newArticle');
};


Order.prototype.getList = function () {

    $.ajax({
        url: '/orders'
    }).done(function (data) {

            var custid,
                contentBox = $('#content'),
                table;

            for (var i = 0; i < data.length; i++) {
                if (!custid) {
                    custid = data[i].customer_id;
                    table = this.startCustomerSection(contentBox, data[i]);
                }
                if (custid !== data[i].customer_id) {
                    this.endCustomerSection(contentBox, table);
                    table = this.startCustomerSection(contentBox, data[i]);
                }

                // insert row
                this.addOrder(table, data[i]);

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

Order.prototype.addOrder = function (table, data) {
    var order = $('<tr>'+
        '<td>'+data.article_id+'</td>'+
        '<td>'+data.name+'</td>'+
        '<td>'+(data.price /100)+'</td>'+
        '<td>'+data.amount+'</td>'+
        '<td>'+(data.price/100*data.amount)+'</td>'+
        '</tr>');
    table.append(order);
};