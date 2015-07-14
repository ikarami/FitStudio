module.exports = function (app, models) {
    'use strict';

    app.get('/subscriptions/', [app.authChecker], function (req, res) {
        var accountId = req.session.accountId;
        models.Subscription.findAll(accountId, function (subscriptions) {
            res.send(subscriptions);
        });
    });

    app.get('/subscriptions/:id', [app.authChecker], function (req, res) {
        app.logger.log('Getting details for subscription id: ' + req.params.id);
        var accountId = req.session.accountId;

        models.Subscription.findById({accountId: accountId, subscriptionId: req.params.id}, function (subscription) {
            if (!subscription) {
                res.status(404).end();
            } else {
                res.send(subscription);
            }
        });
    });

    app.post('/subscriptions/:id', [app.authChecker], function (req, res) {
        var data = req.body;
        data.accountId = req.session.accountId;
        app.logger.log('addSubscription ' + JSON.stringify(data));
        models.Subscription.add(data, function (err, model) {
            if (err) {
                res.status(500).end();
                return;
            }
            res.send(model);
        });
    });

    app.put('/subscriptions/:id', [app.authChecker], function (req, res) {
        var data = req.body;
        data.accountId = req.session.accountId;
        data.subscriptionId = req.params.id;

        app.logger.log('editSubscription ' + JSON.stringify(data));
        models.Subscription.edit(data, function(code) {
            res.status(code).end();
        });
    });

    app.delete('/subscriptions/:id', [app.authChecker], function (req, res) {
        app.logger.log('Deleting subscription id: ' + req.params.id);
        var accountId = req.session.accountId;

        models.Subscription.findById({accountId: accountId, subscriptionId: req.params.id}, function (subscription) {
            if (!subscription) {
                res.status(404).end();
            } else {
                subscription.remove(function (err) {
                    if (err) {
                        console.log('Deleting subscription model error: ' + err);
                    }
                    res.status(200).end();
                });
            }
        });
    });
};
