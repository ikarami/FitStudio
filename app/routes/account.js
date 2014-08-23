module.exports = function (app, models, passport) {

    app.post('/account/login', passport.authenticate('local'), function (req, res) {
        app.logger.log('login request successful');

        req.session.accountId = req.user._id;
        res.status(200).end();

/*        models.Account.login(email, password, function accountCallback(account) {
            if (!account) {
                res.status(401).end();
                return;
            }
            app.logger.log('login was successful');
            req.session.loggedIn = true;
            req.session.accountId = account._id;
            res.status(200).end();
        });*/
    });

    app.get('/account/logout', [app.authChecker], function (req, res) {
        app.logger.log('Logout request for ' + req.user._id);
        req.logout();
        req.session.destroy(function(err) {
            if (err) {
                app.logger.log('logout error: ' + err);
                res.status(500).end();
                return;
            }
            res.status(200).end();
        });
    });

    app.post('/account/register', function (req, res) {
        app.logger.log('REGISTER');
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
        app.logger.log('will register');
        models.Account.register(personData);
        res.status(200).end();
    });

    app.post('/account/forgotpassword', function (req, res) {
        var hostname, resetPasswordUrl, email;
        hostname = req.headers.host;
        resetPasswordUrl = 'http://' + hostname + '/account/resetpassword';
        email = req.param('email', null);
        if (email === null || email.lenth < 1) {
            res.status(400).end();
            return;
        }
        models.Account.forgotPassword(email, resetPasswordUrl);
        res.status(200).end();
    });

    app.get('/account/resetPassword', function (req, res) {
        var accountId = req.param('account', null);
        res.render('resetPassword.jade', {locals: {accountId: accountId }});
    });

    app.post('/account/resetPassword', function (req, res) {
        var accountId = req.param('account', null);
        var password = req.param('password', null);
        if (accountId !== null && password !== null) {
            models.Account.changePassword(accountId, password);
        }
        res.render('resetPasswordSuccess.jade');
    });

    app.get('/account/authenticated', function (req, res) {
        if (req.user && req.user._id) {
            res.status(200).end();
        } else {
            res.status(401).end();
        }
    });
};