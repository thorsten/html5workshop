var customer, article, order;

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
};