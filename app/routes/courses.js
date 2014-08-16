module.exports = function (app, models) {
    app.get('/courses/', [app.authChecker], function (req, res) {
        var accountId = req.session.accountId;
        models.Course.findAll(accountId, function (courses) {
            res.send(courses);
        });
    });

    app.get('/courses/:id', [app.authChecker], function (req, res) {
        console.log('Getting details for course id: ' + req.params.id);
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
        console.log('addCourse ' + JSON.stringify(data));
        models.Course.add(data, function() {
            res.status(200).end();
        });
    });

    app.put('/courses/:id', [app.authChecker], function (req, res) {
        var data = req.body;
        data.accountId = req.session.accountId;
        data.courseId = req.params.id;
        console.log('editCourse ' + JSON.stringify(data));
        models.Course.edit(data, function(code) {
            res.status(code).end();
        });
    });

    app.delete('/courses/:id', [app.authChecker], function (req, res) {
        console.log('Deleting course id: ' + req.params.id);
        var accountId = req.session.accountId;

        models.Course.findById({accountId: accountId, courseId: req.params.id}, function (course) {
            if (!course) {
                res.status(404).end();
            } else {
                course.remove(function (err) {
                    res.status(200).end();
                });
            }
        });
    });
};