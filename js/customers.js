var Customer = function () {
    $('#newCustomer').on('click', this.newCustomer.bind(this));
    $('#manageCustomer').on('click', this.getList.bind(this));
};

Customer.prototype.getList = function () {

    $.ajax({
        url: '/customers'
    }).done(function (data) {

        var contentBox = $('#content'),
            table;

        table = this.beginTable();

        for (var i = 0; i < data.length; i++) {
            this.tableRow(table, data[i]);
        }

        this.endTable(contentBox, table);
    }.bind(this));

};

Customer.prototype.newCustomer = function () {
    $('div#customer').css('display', 'block');
};


Customer.prototype.writeCustomerName = function (el, data) {
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

Customer.prototype.beginTable = function () {

    var header = $('<table cellspacing="0" border="1"><tr>'+
        '<td>Name</td>'+
        '<td>Vorname</td>'+
        '<td>Nachname</td>'+
        '<td>Straße</td>'+
        '<td>Ort</td>'+
        '<td>Land</td>'+
        '</tr></table>');

    var table = $(header);
    return table;
};

Customer.prototype.endTable = function (content, table) {
    content.empty();
    content.append(table);
};

Customer.prototype.tableRow = function (table, data) {
    var order = $('<tr>'+
        '<td>'+data.name+'</td>'+
        '<td>'+data.firstname+'</td>'+
        '<td>'+data.surname+'</td>'+
        '<td>'+data.street+'</td>'+
        '<td>'+data.place+'</td>'+
        '<td>'+data.country+'</td>'+
        '<td>edit</td>'+
        '<td>delete</td>'+
        '</tr>');
    table.append(order);
};
