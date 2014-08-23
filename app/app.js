var express = require('express');
var app = express();
var path = require('path');
var getRawBody = require('raw-body');
var MemoryStore = require('connect').session.MemoryStore;
var nodemailer = require('nodemailer');
var fs = require('fs');
var morgan = require('morgan');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var mongoose = require('mongoose');


//db.addUser('​fit4studio_test1','​SecretPassword1')
// ComposeNokia

//mongoose.connect('mongodb://localhost/test');
mongoose.connect('mongodb://fit4studio_test1:SecretPassword1@kahana.mongohq.com:10003/fit4studio_test1');

db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('DB opened!');
});

var config = {
    mail: require('./config/mail')()
};

var models = {
    Account: require('./models/Account')(mongoose, nodemailer, config),
    Course: require('./models/Course')(mongoose, config),
    Instructor: require('./models/Instructor')(mongoose, config),
    Location: require('./models/Location')(mongoose, config),
    Pouch: require('./models/Pouch')(mongoose, config)
};

passport.serializeUser(function (user, done) {
    console.log('serializeUser: ' + user._id);
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    done(null, {_id: id});
    /* there is no need to retrive the whole user object here, an id is sufficient...
    models.Account.findById({_id: id}, function (err, doc) {
        console.log('deserializeUser: ' + id + ' found: ' + doc ? doc._id : '-');
        done(err, doc);
    });*/
});

app.engine('html', require('ejs').renderFile);
console.log('Views folder: ' + path.join(__dirname, 'public'));
app.set('views', path.join(__dirname, 'public'));
app.set('view options', {layout: false});
// logging every request:
app.use(morgan('combined', {
    stream: fs.createWriteStream(process.env.OPENSHIFT_REPO_DIR ? process.env.OPENSHIFT_REPO_DIR + 'app/logs/access-combined.log' : './logs/access-combined.log', {flags: 'a'})
}));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
        secret: 'FitStudio app secret',
        store: new MemoryStore(),
        saveUninitialized: true,
        resave: true,
        cookie: { maxAge: 900000 }
    })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function(email, password, done) {
        models.Account.login(email, password, function accountCallback(account) {
            if (!account) {
                return done(null, false, { message: 'Incorrect credentials.' });
            }
            return done(null, account);
        });
    }
));

app.authChecker = function(req, res, next) {
    if (req.user && req.user._id) {
        next();
    } else {
       res.status(401).end();
    }
};

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

// Import the routes
var dir = 'routes';
if (process.env.OPENSHIFT_REPO_DIR) {
    dir = process.env.OPENSHIFT_REPO_DIR + 'app/routes';
}
fs.readdirSync(dir).forEach(function (file) {
    if (file[0] === '.') return;
    var routeName = file.substr(0, file.indexOf('.'));
    require('./routes/' + routeName)(app, models, passport);
});

app.get('/', function (req, res) {
    res.render('index.html');
});


app.listen(process.env.OPENSHIFT_NODEJS_PORT || 8080, process.env.OPENSHIFT_NODEJS_IP || 'localhost');