module.exports = function (logger, mongoose) {
    'use strict';

    var crypto, CourseSchema, Course, findAll, findById, add, edit;

    crypto = require('crypto');

    CourseSchema = new mongoose.Schema({
        accountId: {type: mongoose.Schema.Types.ObjectId},
        name: {type: String},
        shortName: {type: String},
        description: {type: String},
        time: {type: String},

        startDate: {type: Number},
        endDate: {type: Number},
        occurences: {type: Array},
        instructors: {type: Array},
        locations: {type: Array},
        users: {type: Array},

        private: {type: Boolean}
    });

    Course = mongoose.model('Course', CourseSchema);

    findById = function (ids, callback) {
        logger.log('Course :: findById :: ' + ids.accountId);
        Course.findOne({accountId: ids.accountId, _id: ids.courseId}, function (err, docs) {
            callback(docs || false);
        });
    };

    findAll = function (accountId, callback) {
        logger.log('Course :: findAll :: ' + accountId);
        Course.find({accountId: accountId}, function (err, docs) {
            callback(docs);
        });
    };

    add = function (data, callback) {
        logger.log('Course :: add :: ' + data.name);
        var course = new Course({
            accountId: data.accountId,
            name: data.name || '',
            shortName: data.shortName || '',
            description: data.description || '',
            time: data.time || '',
            startDate: data.startDate || -1,
            endData: data.endData || -1,
            instructors: data.instructors || [],
            users: data.users || [],
            locations: data.locations || [],
            occurences: data.occurences || [],
            private: data.private || false
        });

        course.save(callback);
        logger.log('Course :: add :: save command was sent');
    };

    edit = function (data, callback) {
        Course.update({accountId: data.accountId,
                _id: data.courseId
            }, {
                name: data.name || '',
                shortName: data.shortName || '',
                description: data.description || '',
                time: data.time || '',
                startDate: data.startDate || -1,
                endData: data.endData || -1,
                instructors: data.instructors || [],
                users: data.users || [],
                locations: data.locations || [],
                occurences: data.occurences || [],
                private: data.private || false
            }, function (err) {
                if (err) {
                    logger.error('Course :: update :: error occurred: ' + err);
                    callback(500);
                } else {
                    logger.log('Course :: update :: success');
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