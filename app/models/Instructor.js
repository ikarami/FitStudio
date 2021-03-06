module.exports = function (logger, mongoose) {
    'use strict';

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
        logger.log('Instructor :: findById :: ' + ids.accountId);
        Instructor.findOne({accountId: ids.accountId, _id: ids.instructorId}, function (err, docs) {
            callback(docs || false);
        });
    };

    findAll = function (accountId, callback) {
        logger.log('Instructor :: findAll :: ' + accountId);
        Instructor.find({accountId: accountId}, function (err, docs) {
            callback(docs);
        });
    };

    add = function (data, callback) {
        logger.log('Instructor :: add :: ' + data.firstName + ' ' + data.lastName);
        var course = new Instructor({
            accountId: data.accountId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email || '',
            phone: data.phone || '',
            classes: data.classes || []
        });

        course.save(callback);
        logger.log('Instructor :: add :: save command was sent');
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
            }, function (err) {
                if (err) {
                    logger.error('Instructor :: update :: error occurred: ' + err);
                    callback(500);
                } else {
                    logger.log('Instructor :: update :: success');
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