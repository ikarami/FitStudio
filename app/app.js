var express = require('express');
var app = express();
var path = require('path');
var getRawBody = require('raw-body');
var MemoryStore = require('connect').session.MemoryStore;
var nodemailer = require('nodemailer');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('DB opened!');
});

var config = {
    mail: require('./config/mail')()
};

var Account = require('./models/Account')(mongoose, nodemailer, config);
var Course = require('./models/Course')(mongoose, nodemailer, config);

app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'public'));
app.set('view options', {layout: false});
app.use(express.static('public'));
//app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
        secret: 'FitStudio app secret',
        store: new MemoryStore(),
        saveUninitialized: true,
        resave: true
    })
);
/*app.use(function (req, res, next) {
    getRawBody(req, {
        limit: '1mb'
    }, function(err, string) {
        if (err) {
            return next(err);
        }

        req.text = string;
        next();
    });
});*/


app.get('/', function (req, res) {
    res.render('index.html');
});

app.post('/login', function (req, res) {
    console.log('login request');
    var email, password;
    email = req.param('email', null);
    password = req.param('password', null);

    if (email === null || email.length < 1 || password === null || password.lenght < 1 ) {
        res.status(400).end();
        return;
    }

    Account.login(email, password, function accountCallback(account) {
        if (!account) {
            res.status(401).end();
            return;
        }
        console.log('login was successful');
        req.session.loggedIn = true;
        req.session.accountId = account._id;
        res.status(200).end();
    });
});

app.post('/register', function (req, res) {
    console.log('REGISTER');
    var personData = {
        firstName: req.param('firstName', ''),
        lastName: req.param('lastName', ''),
        email: req.param('email', null),
        password: req.param('password', null)
    };

    if (personData.email === null || personData.email.length < 1 || personData.password === null || personData.password.lenght < 1 ) {
        res.status(400).end();
        return;
    }
    console.log('will register');
    Account.register(personData);
    res.status(200).end();
});

app.post('/forgotpassword', function (req, res) {
    var hostname, resetPasswordUrl, email;
    hostname = req.headers.host;
    resetPasswordUrl = 'http://' + hostname + '/resetpassword';
    email = req.param('email', null);
    if (email === null || email.lenth < 1) {
        res.status(400).end();
        return;
    }
    Account.forgotPassword(email, resetPasswordUrl);
    res.status(200).end();
});

app.get('/resetPassword', function (req, res) {
    var accountId = req.param('account', null);
    res.render('resetPassword.jade', {locals: {accountId: accountId }});
});

app.post('/resetPassword', function (req, res) {
    var accountId = req.param('account', null);
    var password = req.param('password', null);
    if (accountId !== null && password !== null) {
        Account.changePassword(accountId, password);
    }
    res.render('resetPasswordSuccess.jade');
});

app.get('/account/authenticated', function (req, res) {
    if (req.session.loggedIn) {
        res.status(200).end();
    } else {
        res.status(401).end();
    }
});

app.get('/courses/:id', function (req, res) {
    var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;
    Course.findAll(accountId, function (courses) {
        res.send(courses);
    });
});

app.post('/addCourse', function (req, res) {
    var data = req.body;
    data.accountId = req.session.accountId;
    console.log('addCourse ' + JSON.stringify(data));
    Course.add(data, function() {
        res.status(200).end();
    });
});

app.listen(8080);