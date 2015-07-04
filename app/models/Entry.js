module.exports = function (logger, mongoose) {
    'use strict';

    var EntrySchema, Entry, findAll, findById, findBetweenDates, add, edit;

    var _ = require('lodash-node');

    var timeStampToDate = function (timestamp) {
        return new Date(Number(timestamp)).toString();
    };

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

    findBetweenDates = function (ids, dates, callback) {
        var query;
        logger.log('Entry :: findBetweenDates :: ' + ids.accountId + ' courseId: ' + ids.courseId);
        query = {
            accountId: ids.accountId,
            courseId: ids.courseId
        };
        if (query.courseId === null) {
            delete query.courseId;
        }

        // check for timestamps -> dates have to be string objects here!
        if (!_.isNaN(Number(dates.startDate))) {
            logger.log('gotya');
            dates.startDate = timeStampToDate(dates.startDate);
        }
        if (!_.isNaN(Number(dates.endDate))) {
            logger.log('gotya');
            dates.endDate = timeStampToDate(dates.endDate);
        }

        logger.log('Entry :: findBetweenDates :: startDate ' + dates.startDate + ' endDate: ' + dates.endDate);
        query.startDate = {
            $gte: new Date(dates.startDate),
            $lt: new Date(dates.endDate)
        };
        Entry.find(query, function (err, docs) {
            callback(docs);
        });
    };

    findById = function (ids, callback) {
        logger.log('Entry :: findById :: ' + ids.accountId + ' courseId: ' + ids.courseId + ' entryId: ' + ids.entryId);
        Entry.findOne({accountId: ids.accountId, courseId: ids.courseId, _id: ids.entryId}, function (err, docs) {
            callback(docs || false);
        });
    };

    findAll = function (ids, callback) {
        var query;
        logger.log('Entry :: findAll :: ' + ids.accountId);
        query = {
            accountId: ids.accountId,
            courseId: ids.courseId
        };
        if (query.courseId === null) {
            delete query.courseId;
        }
        Entry.find(query, function (err, docs) {
            callback(docs);
        });
    };

    add = function (data, callback) {
        logger.log('Entry :: add :: ' + data.accountId + ' ' + data.courseId);
        var course = new Entry({
            accountId: data.accountId,
            courseId: data.courseId,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
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
                classes: data.classes || [],
                missedUsers: data.missedUsers || [],
                actualUsers: data.actualUsers || [],
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
        add: add,
        edit: edit,
        findAll: findAll,
        findBetweenDates: findBetweenDates,
        findById: findById
    };
};
