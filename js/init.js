var customer, article, order, connection;

var init = function () {
    "use strict";

    customer = new Customer();
    article = new Article();
    order = new Order();
    order.getList();

    $('#fullScreen').on('click', function (e) {
        var el = document.documentElement,
            requestFullScreen = el.requestFullScreen ||
                el.webkitRequestFullScreen ||
                el.mozRequestFullScreen;

        requestFullScreen.call(el);
    });


    window.WebSocket = window.WebSocket || window.MozWebSocket;

    connection = new WebSocket('ws://workshop.basti.dev:8181');

    connection.onmessage = function (data) {
        if (data.data == 'refetch') {
            article.getList();
        }
    }

};