module.exports = function (app, models) {
    app.get('/pouches/', [app.authChecker], function (req, res) {
        var accountId = req.session.accountId;
        models.Pouch.findAll(accountId, function (pouch) {
            res.send(pouch);
        });
    });

    app.get('/pouches/:id', [app.authChecker], function (req, res) {
        console.log('Getting details for pouch id: ' + req.params.id);
        var accountId = req.session.accountId;

        models.Pouch.findById({accountId: accountId, pouchId: req.params.id}, function (pouch) {
            if (!pouch) {
                res.status(404).end();
            } else {
                res.send(pouch);
            }
        });
    });

    app.post('/pouches/:id', [app.authChecker], function (req, res) {
        var data = req.body;
        data.accountId = req.session.accountId;
        console.log('addPouch ' + JSON.stringify(data));
        models.Pouch.add(data, function() {
            res.status(200).end();
        });
    });

    app.put('/pouches/:id', [app.authChecker], function (req, res) {
        var data = req.body;
        data.accountId = req.session.accountId;
        data.pouchId = req.params.id;

        console.log('editPouch ' + JSON.stringify(data));
        models.Pouch.edit(data, function(code) {
            res.status(code).end();
        });
    });

    app.post('/pouches/:id/operations/', function (req, res) {
        console.log('Adding operation for pouch id ' + req.params.id);
        var data = req.body;
        data.accountId = req.session.accountId;
        data.pouchId = req.params.id;

        models.Pouch.addOperation(data, function (status) {
            res.status(status).end();
        });
    });

    app.delete('/pouches/:id', [app.authChecker], function (req, res) {
        console.log('Deleting pouch id: ' + req.params.id);
        var accountId = req.session.accountId;

        models.Pouch.findById({accountId: accountId, pouchId: req.params.id}, function (pouch) {
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