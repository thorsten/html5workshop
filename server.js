var fs = require('fs'),
    sqlite3 = require('sqlite3'),
    db = new sqlite3.Database('database/workshop.db'),
    express = require('express'),
    app = new express();

app.get('/', function(req, res){
    res.send('lala');
});

app.get('/index.html', function (req, res) {

    var order = fs.readFileSync(__dirname + '/templates/order.html'),
        article = fs.readFileSync(__dirname + '/templates/article.html'),
        customer = fs.readFileSync(__dirname + '/templates/customer.html');


    fs.readFile(__dirname + '/templates/index.html', 'utf8', function(err, text) {

        var content = text.replace('${order}', order).
            replace('${article}', article).
            replace('${customer}', customer);

        res.send(content);
    });
});

app.get('/articles', function (req, res) {
    db.all('SELECT rowid, * FROM `article`', function (err, rows) {
        if (err) throw err;
        res.send(rows);
    });
});

app.post('/articles', function (req, res) {
    var data = '';

    req.on('data', function (chunk) {
        data += chunk;
    });

    req.on('end', function () {
        var values = require('querystring').parse(data);

        db.run('INSERT INTO article (name, price) VALUES ( ?, ?)', values.name, values.price, function (err) {
            if (err) console.log(err);
            console.log(values);
            res.end('success');
        });
    });
});

app.get('/customers', function (req, res) {
    db.all('SELECT rowid, * FROM `customer`', function (err, rows) {
        if (err) throw err;
        res.send(rows);
    });
});

app.post('/customers', function (req, res) {
    var data = '';

    req.on('data', function (chunk) {
        data += chunk;
    });

    req.on('end', function () {
        var values = require('querystring').parse(data);

        db.run('INSERT INTO customer (name, firstname, surname, street, place, country) VALUES ( ?, ?, ?, ?, ?, ? )', values.name, values.firstname, values.surname, values.street, values.place, values.country, function (err) {
            if (err) console.log(err);
            console.log(values);
            res.end('success');
        });
    });
});

app.put('/customers', function (req, res) {
    res.end('lala');
});

app.get('/orders', function (req, res) {
    db.all('select *, customer.name AS cname from orders LEFT JOIN customer ON customer.rowid = orders.customer_id LEFT JOIN article ON article.rowid = orders.article_id order by customer.rowid', function (err, rows) {
        if (err) throw err;
        res.send(rows);
    });
});


app.use("/js", express.static(__dirname + '/js'));


app.listen(8080);