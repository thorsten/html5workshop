var int, customer;

var init = function () {
    "use strict";

    customer = new Customer();




    var order = new Order();
    order.getList();

    $('#custCancel').on('click', function () {
        $('div#customer').toggle();
    });
    $('#custForm').on('submit', function (e) {
        e.preventDefault();

        var progress = function () {
            var value = $('#progress').val();
            if (value <= 99) {
                value += 1;
            } else {
                value = 0;
                clearInterval(int);
                saveCustomer();
            }
            $('#progress').val(value);
        }
        int = setInterval(progress, 20);

        return false;
    });

    var saveCustomer = function () {
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

    // update

    // delete


    $('#fullScreen').on('click', function (e) {
        var el = document.documentElement,
            requestFullScreen = el.requestFullScreen ||
                el.webkitRequestFullScreen ||
                el.mozRequestFullScreen;

        requestFullScreen.call(el);
    });
};