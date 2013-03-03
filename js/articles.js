var Article = function () {
    $('#newArticle').on('click', this.newArticle.bind(this));
    $('#manageArticle').on('click', this.getList.bind(this));
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
