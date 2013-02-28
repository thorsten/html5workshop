var fs = require('fs'),
    sqlite3 = require('sqlite3'),
    db = new sqlite3.Database('database/workshop.db'),
    express = require('express'),
    app = new express();

app.get('/', function(req, res){
    res.send('lala');
});

app.get('/index.html', function (req, res) {
    fs.readFile(__dirname + '/templates/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.get('/articles', function (req, res) {
    db.all('SELECT rowid, * FROM `article`', function (err, rows) {
        if (err) throw err;
        res.send(rows);
    });
});


app.use("/js", express.static(__dirname + '/js'));


app.listen(8080);