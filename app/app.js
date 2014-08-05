var express = require('express');
var app = express();
var path = require('path');
var MemoryStore = require('connect').session.MemoryStore;

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');


app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'public'));
app.use(express.static('public'));
//app.use(express.limit('1mb'));
app.use(bodyParser());
app.use(cookieParser());
app.use(session({
		secret: 'FitStudio app secret',
		store: new MemoryStore(),
		saveUninitialized: true,
		resave: true
	})
);


app.get('/', function (req, res) {
	res.render('index.jade', {title: 'FitStudio'});
});

app.get('/account/authenticated', function (req, res) {
	if (req.session.loggedIn) {
		res.status(200).end();
	} else {
		res.status(401).end();
	}
});

app.listen(8080);