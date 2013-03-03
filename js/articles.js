var Article = function () {
    $('#newArticle').on('click', this.newArticle.bind(this));
    $('#manageArticle').on('click', this.getList.bind(this));

    $('#artCancel').on('click', function () {
        $('div#article').toggle();
    });

    $('#artForm').on('submit', this.handleFormSubmit.bind(this));
};

Article.prototype.handleFormSubmit = function (e) {
    e.preventDefault();

    var values = {
        name: $('#artName').val(),
        price: $('#artPrice').val()
    };

    $.ajax({
        url: '/articles',
        type: 'POST',
        data: values
    }).done(function (res) {
        $('div.popup').hide();
        $('#content').empty();
        $('#artForm')[0].reset();
        order.getList();
    });

    return false;
};

Article.prototype.getList = function () {

    $.ajax({
        url: '/articles'
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

Article.prototype.newArticle = function () {
    $('div#article').css('display', 'block');
};

Article.prototype.beginTable = function () {

    var header = $('<table cellspacing="0" border="1"><tr>'+
        '<td>Name</td>'+
        '<td>Preis</td>'+
        '</tr></table>');

    var table = $(header);
    return table;
};

Article.prototype.endTable = function (content, table) {
    content.empty();
    content.append(table);
};

Article.prototype.tableRow = function (table, data) {
    var order = $('<tr>'+
        '<td>'+data.name+'</td>'+
        '<td>'+data.price+'</td>'+
        '</tr>');
    table.append(order);
};
