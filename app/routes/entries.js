module.exports = function (app, models) {
    'use strict';

    app.get('/entries/:courseId/', [app.authChecker], function (req, res) {
        app.logger.log('Entries route :: getting entries for course id: ' + req.params.courseId);
        var queryParams,
            ids,
            accountId = req.session.accountId;

        if (req.params.courseId === 'me') {
            req.params.courseId = null;
        }

        ids = {accountId: accountId, courseId: req.params.courseId};

        if (Object.keys(req.query).length === 0) {
            models.Entry.findAll(ids, function (entries) {
                res.send(entries);
            });
        } else {
            app.logger.log('Entries route :: query params :: ' + JSON.stringify(req.query));
            queryParams = req.query;
            if (queryParams.startDate && queryParams.endDate) {
                models.Entry.findBetweenDates(ids, {
                    startDate: queryParams.startDate,
                    endDate: queryParams.endDate
                }, function (entries) {
                    res.send(entries);
                });
            } else {
                res.status(204).end();
            }
        }
    });

    app.get('/entries/:courseId/:entryId', [app.authChecker], function (req, res) {
        var data = {
            accountId: req.session.accountId,
            courseId: req.params.courseId,
            entryId: req.params.entryId
        };

        models.Entry.findById(data, function (entry) {
            if (!entry) {
                res.status(404).end();
            } else {
                res.send(entry);
            }
        });
    });

    app.post('/entries/:courseId/:entryId', [app.authChecker], function (req, res) {
        var data = req.body;
        data.accountId = req.session.accountId;
        // todo: validate if there is such course!
        data.courseId = req.params.courseId !== 'me' ? req.params.courseId : null;

        app.logger.log('Entries route :: add entry ' + JSON.stringify(data));
        models.Entry.add(data, function (err, model) {
            if (err) {
                res.status(500).end();
                return;
            }
            res.send(model);
        });
    });

    // todo:
    //app.get('/entries/:courseId:/:entryId/actualUsers/')
    //app.post('/entries/:courseId:/:entryId/actualUsers/')

    //app.get('/entries/:courseId:/:entryId/expectedUsers/')
    //app.post('/entries/:courseId:/:entryId/expectedUsers/')

    //app.get('/entries/:courseId:/:entryId/instructors/')
    //app.post('/entries/:courseId:/:entryId/instructors/')

    app.put('/entries/:courseId/:entryId', [app.authChecker], function (req, res) {
        var data = req.body;
        data.accountId = req.session.accountId;
        data.courseId = req.params.courseId;
        data.entryId = req.params.entryId;

        app.logger.log('Entries route :: edit entry ' + JSON.stringify(data));
        models.Entry.edit(data, function(code) {
            res.status(code).end();
        });
    });

    app.delete('/entries/:courseId/:entryId', [app.authChecker], function (req, res) {
        app.logger.log('Entries route :: deleting entry id: ' + req.params.entryId);
        var accountId = req.session.accountId;

        models.Entry.findById({
            accountId: accountId,
            courseId: req.params.courseId,
            entryId: req.params.entryId
        }, function (entry) {
            if (!entry) {
                res.status(404).end();
            } else {
                entry.remove(function () {
                    res.status(200).end();
                });
            }
        });
    });
};
