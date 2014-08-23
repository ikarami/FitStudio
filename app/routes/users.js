module.exports = function (app, models) {
    app.get('/users/', [app.authChecker], function (req, res) {
        var accountId = req.session.accountId;
        models.User.findAll(accountId, function (users) {
            res.send(users);
        });
    });

    app.get('/users/:id', [app.authChecker], function (req, res) {
        app.logger.log('Getting details for user id: ' + req.params.id);
        var accountId = req.session.accountId;

        models.User.findById({accountId: accountId, userId: req.params.id}, function (user) {
            if (!user) {
                res.status(404).end();
            } else {
                res.send(user);
            }
        });
    });

    app.post('/users/:id', [app.authChecker], function (req, res) {
        var data = req.body;
        data.accountId = req.session.accountId;
        app.logger.log('addUser ' + JSON.stringify(data));
        models.User.add(data, function() {
            res.status(200).end();
        });
    });

    app.put('/users/:id', [app.authChecker], function (req, res) {
        var data = req.body;
        data.accountId = req.session.accountId;
        data.userId = req.params.id;

        app.logger.log('editUser ' + JSON.stringify(data));
        models.User.edit(data, function(code) {
            res.status(code).end();
        });
    });

    app.delete('/users/:id', [app.authChecker], function (req, res) {
        app.logger.log('Deleting user id: ' + req.params.id);
        var accountId = req.session.accountId;

        models.User.findById({accountId: accountId, userId: req.params.id}, function (user) {
            if (!user) {
                res.status(404).end();
            } else {
                user.remove(function (err) {
                    res.status(200).end();
                });
            }
        });
    });
};