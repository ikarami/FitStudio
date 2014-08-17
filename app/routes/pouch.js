module.exports = function (app, models) {
    app.get('/pouch/', [app.authChecker], function (req, res) {
        var accountId = req.session.accountId;
        models.Location.findAll(accountId, function (pouch) {
            res.send(pouch);
        });
    });

    app.get('/pouch/:id', [app.authChecker], function (req, res) {
        console.log('Getting details for pouch id: ' + req.params.id);
        var accountId = req.session.accountId;

        models.Location.findById({accountId: accountId, pouchId: req.params.id}, function (pouch) {
            if (!pouch) {
                res.status(404).end();
            } else {
                res.send(pouch);
            }
        });
    });

    app.post('/pouch/:id', [app.authChecker], function (req, res) {
        var data = req.body;
        data.accountId = req.session.accountId;
        console.log('addPouch ' + JSON.stringify(data));
        models.Location.add(data, function() {
            res.status(200).end();
        });
    });

    app.put('/pouch/:id', [app.authChecker], function (req, res) {
        var data = req.body;
        data.accountId = req.session.accountId;
        data.pouchId = req.params.id;

        console.log('editPouch ' + JSON.stringify(data));
        models.Location.edit(data, function(code) {
            res.status(code).end();
        });
    });

    app.delete('/pouch/:id', [app.authChecker], function (req, res) {
        console.log('Deleting pouch id: ' + req.params.id);
        var accountId = req.session.accountId;

        models.Location.findById({accountId: accountId, pouchId: req.params.id}, function (pouch) {
            if (!pouch) {
                res.status(404).end();
            } else {
                pouch.remove(function (err) {
                    res.status(200).end();
                });
            }
        });
    });
};