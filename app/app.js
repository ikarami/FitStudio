// FitStudio
//
// By Przemyslaw Banka © 2014

// Modules used by application
var express = require('express');
var app = express();
var path = require('path');
var nodemailer = require('nodemailer');
var fs = require('fs');
var morgan = require('morgan');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// express middlewere
//var getRawBody = require('raw-body');
var MemoryStore = require('connect').session.MemoryStore;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

// Data management
var mongoose = require('mongoose');

/**
 * FitStudio App
 *
 */
var FitStudio = function () {
    // Scope
    var self = this;

    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    self.attachLogger = function () {
        app.logger = {
            log: function () {
                console.log.apply(console, arguments);
            },
            error: function () {
                console.error.apply(console, arguments);
            },
            warn: function () {
                console.warn.apply(console, arguments);
            },
            debug: function () {
                console.debug.apply(console, arguments);
            },
        };
    };

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === 'undefined') {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            app.logger.warn('No OPENSHIFT_NODEJS_IP var, using localhost and 8080 as a port');
            self.ipaddress = 'localhost';
        }

        self.mailConfig = {
            mail: require('./config/mail')()
        };
        self.viewsPath = path.join(__dirname, 'public');
        self.logsPath = process.env.OPENSHIFT_DATA_DIR ? process.env.OPENSHIFT_DATA_DIR + 'logs/' : './logs/';
        self.routesPath = process.env.OPENSHIFT_REPO_DIR ? process.env.OPENSHIFT_REPO_DIR + 'app/routes' : 'routes';
    };

    /**
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === 'string') {
           app.logger.log('%s: Received %s - terminating FitStudio app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        app.logger.log('%s: Node server stopped.', Date(Date.now()) );
    };

    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };

    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    self.initializeDB = function () {
        //db.addUser('​fit4studio_test1','​SecretPassword1')
        // ComposeNokia

        // Connect to the Database
        mongoose.connect('mongodb://fit4studio_test1:SecretPassword1@kahana.mongohq.com:10003/fit4studio_test1');

        self.db = mongoose.connection;
        self.db.on('error', console.error.bind(console, 'DB connection error: '));
        self.db.once('open', function callback () {
            app.logger.log('%s: DB opened!', Date(Date.now()));
        });
    };

    /**
     *  Initialize the model layer
     */
    self.initializeModels = function() {
        self.models = {
            Account: require('./models/Account')(mongoose, nodemailer, self.mailConfig),
            Course: require('./models/Course')(mongoose),
            Instructor: require('./models/Instructor')(mongoose),
            Location: require('./models/Location')(mongoose),
            Pouch: require('./models/Pouch')(mongoose),
            User: require('./models/User')(mongoose),
        };
    };

    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        app.engine('html', require('ejs').renderFile);
        app.logger.log('Views folder: ' + self.viewsPath);
        app.set('views', self.viewsPath);
        app.set('view options', {layout: false});
        // logging every request:
        app.use(morgan('combined', {
            stream: fs.createWriteStream(self.logsPath + 'access-combined.log' , {flags: 'a'})
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
    };

    /**
     *  Initialize the passport middleware
     */
    self.initializePassport = function() {
        passport.serializeUser(function (user, done) {
            app.logger.log('serializeUser: ' + user._id);
            done(null, user._id);
        });

        passport.deserializeUser(function (id, done) {
            done(null, {_id: id});
            /* there is no need to retrive the whole user object here, an id is sufficient...
            models.Account.findById({_id: id}, function (err, doc) {
                app.logger.log('deserializeUser: ' + id + ' found: ' + doc ? doc._id : '-');
                done(err, doc);
            });*/
        });

        passport.use(new LocalStrategy({
                usernameField: 'email',
                passwordField: 'password'
            }, function(email, password, done) {
                self.models.Account.login(email, password, function accountCallback(account) {
                    if (!account) {
                        return done(null, false, { message: 'Incorrect credentials.' });
                    }
                    return done(null, account);
                });
            }
        ));
    };

    /**
     *  Initialize routing
     */
    self.initializeRoutes = function() {
        app.authChecker = function(req, res, next) {
            if (req.isAuthenticated()) {
                next();
            } else {
               res.status(401).end();
            }
        };
        // Import the routes

        fs.readdirSync(self.routesPath).forEach(function (file) {
            if (file[0] === '.') return;
            var routeName = file.substr(0, file.indexOf('.'));
            require('./routes/' + routeName)(app, self.models, passport);
        });

        app.get('/', function (req, res) {
            res.render('index.html');
        });

        app.get('/env', [app.authChecker], function (req, res) {
            var content = {
                version: process.version,
                env: process.env
            };
            res.send(content);
        });
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.attachLogger();
        app.logger.log('FitStudio initialize');
        self.setupVariables();
        self.setupTerminationHandlers();

        // Create the express server and initialize every component
        self.initializeDB();
        self.initializeModels();
        self.initializeServer();
        self.initializePassport();
        self.initializeRoutes();
    };

    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        app.logger.log('FitStudio start');
        //  Start the app on the specific interface (and port).
        app.listen(self.port, self.ipaddress, function() {
            app.logger.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };
};

var fitStudio = new FitStudio();
fitStudio.initialize();
fitStudio.start();