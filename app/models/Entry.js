module.exports = function (logger, mongoose) {
    'use strict';

    var EntrySchema, Entry, findAll, findById, add, edit;

    EntrySchema = new mongoose.Schema({
        accountId: {type: mongoose.Schema.Types.ObjectId},
        courseId: {type: mongoose.Schema.Types.ObjectId},
        startDate: {type: Date},
        endDate: {type: Date},
        comments: {type: String},
        missedUsers: {type: Array},
        actualUsers: {type: Array},
        actualInstructors: {type: Array}
    });

    Entry = mongoose.model('Entry', EntrySchema);

    findById = function (ids, callback) {
        logger.log('Entry :: findById :: ' + ids.accountId);
        Entry.findOne({accountId: ids.accountId, courseId: ids.courseId, _id: ids.entryId}, function (err, docs) {
            callback(docs || false);
        });
    };

    findAll = function (ids, callback) {
        logger.log('Entry :: findAll :: ' + ids.accountId);
        Entry.find({accountId: ids.accountId, courseId: ids.courseId}, function (err, docs) {
            callback(docs);
        });
    };

    add = function (data, callback) {
        logger.log('Entry :: add :: ' + data.accountId + ' ' + data.courseId);
        var course = new Entry({
            accountId: data.accountId,
            courseId: data.courseId,
            startDate: data.startDate,
            endDate: data.endDate,
            comments: data.comments || '',
            missedUsers: data.missedUsers || [],
            actualUsers: data.actualUsers || [],
            instructors: data.instructors || []
        });

        course.save(callback);
        logger.log('Entry :: add :: save command was sent');
    };

    edit = function (data, callback) {
        Entry.update({accountId: data.accountId,
                _id: data.entryId
            }, {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email || '',
                phone: data.phone || '',
                classes: data.classes || []
            }, function (err) {
                if (err) {
                    logger.error('Entry :: update :: error occurred: ' + err);
                    callback(500);
                } else {
                    logger.log('Entry :: update :: success');
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