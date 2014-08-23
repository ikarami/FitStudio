module.exports = function (mongoose) {
    var InstructorSchema, Instructor, findAll, findById, add, edit;

    InstructorSchema = new mongoose.Schema({
        accountId: {type: mongoose.Schema.Types.ObjectId},
        firstName: {type: String},
        lastName: {type: String},
        email: {type: String},
        phone: {type: String},
        classes: {type: Array}
    });

    Instructor = mongoose.model('Instructor', InstructorSchema);

    findById = function (ids, callback) {
        app.logger.log('Instructor.findById ' + ids.accountId);
        Instructor.findOne({accountId: ids.accountId, _id: ids.instructorId}, function (err, docs) {
            callback(docs || false);
        });
    };

    findAll = function (accountId, callback) {
        app.logger.log('Instructor.findAll ' + accountId);
        Instructor.find({accountId: accountId}, function (err, docs) {
            callback(docs);
        });
    };

    add = function (data, callback) {
        app.logger.log('Adding Instructor ' + data.firstName + ' ' + data.lastName);
        var course = new Instructor({
            accountId: data.accountId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email || '',
            phone: data.phone || '',
            classes: data.classes || []
        });

        course.save(callback);
        app.logger.log('Save command was sent');
    };

    edit = function (data, callback) {
        Instructor.update({accountId: data.accountId,
                _id: data.instructorId
            }, {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email || '',
                phone: data.phone || '',
                classes: data.classes || []
            }, function (err, numberAffected) {
                if (err) {
                    app.logger.error('Error occurred: ' + err);
                    callback(500);
                } else {
                    app.logger.log('The number of updated documents was %d', numberAffected);
                    callback(200);
                }
            }
        );
    };

    return {
        findAll: findAll,
        add: add,
        findById: findById,
        edit: edit
    };
};