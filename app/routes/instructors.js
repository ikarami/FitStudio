module.exports = function (app, models) {
    app.get('/instructors/', [app.authChecker], function (req, res) {
        var accountId = req.session.accountId;
        models.Instructor.findAll(accountId, function (instructors) {
            res.send(instructors);
        });
    });

    app.get('/instructors/:id', [app.authChecker], function (req, res) {
        console.log('Getting details for instructor id: ' + req.params.id);
        var accountId = req.session.accountId;

        models.Instructor.findById({accountId: accountId, instructorId: req.params.id}, function (instructor) {
            if (!instructor) {
                res.status(404).end();
            } else {
                res.send(instructor);
            }
        });
    });

    app.post('/instructors/:id', [app.authChecker], function (req, res) {
        var data = req.body;
        data.accountId = req.session.accountId;
        console.log('addInstructor ' + JSON.stringify(data));
        models.Instructor.add(data, function() {
            res.status(200).end();
        });
    });

    app.put('/instructors/:id', [app.authChecker], function (req, res) {
        var data = req.body;
        data.accountId = req.session.accountId;
        data.instructorId = req.params.id;

        console.log('editInstructor ' + JSON.stringify(data));
        models.Instructor.edit(data, function(code) {
            res.status(code).end();
        });
    });

    app.delete('/instructors/:id', [app.authChecker], function (req, res) {
        console.log('Deleting instructor id: ' + req.params.id);
        var accountId = req.session.accountId;

        models.Instructor.findById({accountId: accountId, instructorId: req.params.id}, function (instructor) {
            if (!instructor) {
                res.status(404).end();
            } else {
                instructor.remove(function (err) {
                    res.status(200).end();
                });
            }
        });
    });
};