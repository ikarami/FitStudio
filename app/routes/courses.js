module.exports = function (app, models) {
    'use strict';

    app.get('/courses/', [app.authChecker], function (req, res) {
        var accountId = req.session.accountId;
        models.Course.findAll(accountId, function (courses) {
            res.send(courses);
        });
    });

    app.get('/courses/:id', [app.authChecker], function (req, res) {
        app.logger.log('Getting details for course id: ' + req.params.id);
        var accountId = req.session.accountId;

        models.Course.findById({accountId: accountId, courseId: req.params.id}, function (course) {
            if (!course) {
                res.status(404).end();
            } else {
                res.send(course);
            }
        });
    });

    app.post('/courses/:id', [app.authChecker], function (req, res) {
        var data = req.body;
        data.accountId = req.session.accountId;
        app.logger.log('addCourse ' + JSON.stringify(data));
        models.Course.add(data, function (err, model) {
            if (err) {
                res.status(500).end();
                return;
            }
            res.send(model);
        });
    });

    app.put('/courses/:id', [app.authChecker], function (req, res) {
        var data = req.body;
        data.accountId = req.session.accountId;
        data.courseId = req.params.id;
        app.logger.log('editCourse ' + JSON.stringify(data));
        models.Course.edit(data, function(code) {
            res.status(code).end();
        });
    });

    app.delete('/courses/:id', [app.authChecker], function (req, res) {
        app.logger.log('Deleting course id: ' + req.params.id);
        var accountId = req.session.accountId;
        var courseId = req.params.id;

        models.Course.findById({accountId: accountId, courseId: courseId}, function (course) {
            if (!course) {
                res.status(404).end();
            } else {
                course.remove(function () {
                    app.logger.log('Deleted course id ' + courseId);

                    //TODO: delete entries in the FUTURE, leave present as they were
                    models.Entry.findAll({accountId: accountId, courseId: courseId}, function (entries) {
                        app.logger.log('Deleting entries (' + entries.length + ') corresponding to course id ' + courseId);
                        if (entries && entries.length) {
                            entries.forEach(function (entry) {
                                entry.remove(function (err) {
                                    if (err) {
                                        console.log('Error while removing entry: ' + err);
                                    }
                                });
                            });
                        }
                    });

                    res.status(200).end();
                });
            }
        });

    });
};
