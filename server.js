var fs = require('fs'),
    sqlite3 = require('sqlite3'),
    db = new sqlite3.Database('database/workshop.db'),
    express = require('express'),
    app = new express(),
    WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 8181}),
    socket = [];

app.get('/', function(req, res){
    res.send('lala');
});


app.get('/offline.manifest', function (req, res) {
    fs.readFile(__dirname + '/offline.manifest', 'utf8', function(err, text) {
        res.setHeader('Content-Type', 'text/cache-manifest');
        res.send(text);
    });
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
            res.end('success');

            for (var i = 0; i < socket.length; i++) {
                socket[i].send('refetch');
            }
        });
    });
});

app.get('/articles/id/:id', function (req, res) {
    var id = req.url.split('/')[3];

    db.get('SELECT rowid, * FROM article WHERE rowid = ?', id, function (err, data) {
        res.send(data);
    });
});

app.put('/articles', function (req, res) {
    var data = '';

    req.on('data', function (chunk) {
        data += chunk;
    });

    req.on('end', function () {
        var values = require('querystring').parse(data);
        console.log(values);

        db.run('UPDATE article SET name = ?, price = ?, description = ? WHERE rowid = ?', values.name, values.price, values.description, values.articleId, function (err) {
            if (err) console.log(err);
            res.end('success');

            for (var i = 0; i < socket.length; i++) {
                socket[i].send('refetch');
            }
        });
    });
});

app.delete('/articles/id/:id', function (req, res) {
    var id = req.url.split('/')[3];

    db.run('DELETE FROM article WHERE rowid = ?', id, function (err, data) {
        res.send('success');
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
            res.end('success');
        });
    });
});

app.get('/customers/id/:id', function (req, res) {
    var id = req.url.split('/')[3];

    db.get('SELECT rowid, * FROM customer WHERE rowid = ?', id, function (err, data) {
        res.send(data);
    });
});

app.put('/customers', function (req, res) {
    var data = '';

    req.on('data', function (chunk) {
        data += chunk;
    });

    req.on('end', function () {
        var values = require('querystring').parse(data);
        console.log(values);

        db.run('UPDATE customer SET name = ?, firstname = ?, surname = ?, street = ?, place = ?, country = ? WHERE rowid = ?', values.name, values.firstname, values.surname, values.street, values.place, values.country, values.customerId, function (err) {
            if (err) console.log(err);
            res.end('success');
        });
    });
});

app.delete('/customers/id/:id', function (req, res) {
    var id = req.url.split('/')[3];

    db.run('DELETE FROM customer WHERE rowid = ?', id, function (err, data) {
        res.send('success');
    });
});

app.get('/orders', function (req, res) {
    db.all('select *, orders.rowid AS rowid, customer.name AS cname from orders LEFT JOIN customer ON customer.rowid = orders.customer_id LEFT JOIN article ON article.rowid = orders.article_id order by customer.rowid', function (err, rows) {
        if (err) throw err;
        res.send(rows);
    });
});

app.get('/orders/id/:id', function (req, res) {
    var id = req.url.split('/')[3];

    db.get('SELECT rowid, * FROM orders WHERE rowid = ?', id, function (err, data) {
        res.send(data);
    });
});

app.post('/orders', function (req, res) {
    var data = '';

    req.on('data', function (chunk) {
        data += chunk;
    });

    req.on('end', function () {
        var values = require('querystring').parse(data);

        console.log(values);

        db.run('INSERT INTO orders (article_id, customer_id, amount) VALUES ( ?, ?, ?)', values.article, values.customer, values.amount, function (err) {
            if (err) console.log(err);
            res.end('success');
        });
    });
});

app.put('/orders', function (req, res) {
    var data = '';

    req.on('data', function (chunk) {
        data += chunk;
    });

    req.on('end', function () {
        var values = require('querystring').parse(data);
        console.log(values);

        db.run('UPDATE orders SET article_id = ?, customer_id = ?, amount = ? WHERE rowid = ?', values.article, values.customer, values.amount, values.orderId, function (err) {
            if (err) console.log(err);
            res.end('success');
        });
    });
});

app.delete('/orders/id/:id', function (req, res) {
    var id = req.url.split('/')[3];

    db.run('DELETE FROM orders WHERE rowid = ?', id, function (err, data) {
        res.send('success');
    });
});


app.use("/js", express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));


app.listen(8080);


// websockets


wss.on('connection', function(ws) {
    socket.push(ws);
});