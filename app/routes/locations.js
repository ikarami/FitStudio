module.exports = function (app, models) {
    'use strict';

    app.get('/locations/', [app.authChecker], function (req, res) {
        var accountId = req.session.accountId;
        models.Location.findAll(accountId, function (locations) {
            res.send(locations);
        });
    });

    app.get('/locations/:id', [app.authChecker], function (req, res) {
        app.logger.log('Getting details for location id: ' + req.params.id);
        var accountId = req.session.accountId;

        models.Location.findById({accountId: accountId, locationId: req.params.id}, function (location) {
            if (!location) {
                res.status(404).end();
            } else {
                res.send(location);
            }
        });
    });

    app.post('/locations/:id', [app.authChecker], function (req, res) {
        var data = req.body;
        data.accountId = req.session.accountId;
        app.logger.log('addLocation ' + JSON.stringify(data));
        models.Location.add(data, function (err, model) {
            if (err) {
                res.status(500).end();
                return;
            }
            res.send(model);
        });
    });

    app.put('/locations/:id', [app.authChecker], function (req, res) {
        var data = req.body;
        data.accountId = req.session.accountId;
        data.locationId = req.params.id;

        app.logger.log('editLocation ' + JSON.stringify(data));
        models.Location.edit(data, function(code) {
            res.status(code).end();
        });
    });

    app.delete('/locations/:id', [app.authChecker], function (req, res) {
        app.logger.log('Deleting location id: ' + req.params.id);
        var accountId = req.session.accountId;

        models.Location.findById({accountId: accountId, locationId: req.params.id}, function (location) {
            if (!location) {
                res.status(404).end();
            } else {
                location.remove(function (err) {
                    res.status(200).end();
                });
            }
        });
    });
};