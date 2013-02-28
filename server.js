var fs = require('fs'),
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

app.use("/js", express.static(__dirname + '/js'));


app.listen(8080);