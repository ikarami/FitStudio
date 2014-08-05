var express = require('express');
var app = express();
var path = require('path');

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'public'));

app.get('/', function (req, res) {
	res.render('index.jade', {title: 'FitStudio'});
});

app.listen(8080);