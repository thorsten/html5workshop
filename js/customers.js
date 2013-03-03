var int,
    Customer = function () {
    $('#newCustomer').on('click', this.newCustomer.bind(this));
    $('#manageCustomer').on('click', this.getList.bind(this));

    $('#custCancel').on('click', function () {
        $('div#customer').toggle();
    });

    $('#custForm').on('submit', this.handleFormSubmit.bind(this));
};

Customer.prototype.saveCustomer = function () {
    var values = {
        name: $('#custName').val(),
        firstname: $('#custFirstname').val(),
        surname: $('#custSurname').val(),
        street: $('#custStreet').val(),
        place: $('#custPlace').val(),
        country: $('#custCountry').val()
    };

    $.ajax({
        url: '/customers',
        type: 'POST',
        data: values
    }).done(function (res) {
        $('div.popup').hide();
        $('#content').empty();
        order.getList();
    });
};

Customer.prototype.handleFormSubmit = function (e) {
    e.preventDefault();

    var progress = function () {
        var value = $('#progress').val();
        if (value <= 99) {
            value += 1;
        } else {
            value = 0;
            clearInterval(int);
            this.saveCustomer();
        }
        $('#progress').val(value);
    }.bind(this);
    int = setInterval(progress, 20);

    return false;
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
