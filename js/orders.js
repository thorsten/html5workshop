var Order = function () {};


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
    var table = $('<table></table>');
    return table;
};

Order.prototype.endCustomerSection = function (content, table) {
    content.append(table);
};

Order.prototype.addOrder = function (table, data) {
    table.append('<tr><td>asdf</td></tr>');
};