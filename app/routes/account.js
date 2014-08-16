module.exports = function (app, models) {
    app.post('/account/login', function (req, res) {
        console.log('login request');
        var email, password;
        email = req.param('email', null);
        password = req.param('password', null);

        if (email === null || email.length < 1 || password === null || password.lenght < 1 ) {
            res.status(400).end();
            return;
        }

        models.Account.login(email, password, function accountCallback(account) {
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

    app.get('/account/logout', function (req, res) {
        req.session.destroy(function(err) {
            if (err) {
                console.log('logout error: ' + err);
                res.status(500).end();
                return;
            }
            res.status(200).end();
        });
    });

    app.post('/account/register', function (req, res) {
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
        if (req.session.loggedIn) {
            res.status(200).end();
        } else {
            res.status(401).end();
        }
    });
};