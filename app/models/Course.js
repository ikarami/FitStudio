module.exports = function (logger, mongoose) {
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
        users: {type: Array}
    });

    Course = mongoose.model('Course', CourseSchema);

    findById = function (ids, callback) {
        logger.log('Course.findById ' + ids.accountId);
        Course.findOne({accountId: ids.accountId, _id: ids.courseId}, function (err, docs) {
            callback(docs || false);
        });
    };

    findAll = function (accountId, callback) {
        logger.log('Course.findAll ' + accountId);
        Course.find({accountId: accountId}, function (err, docs) {
            callback(docs);
        });
    };

    add = function (data, callback) {
        logger.log('Adding course ' + data.name);
        var course = new Course({
            accountId: data.accountId,
            name: data.name || '',
            shortName: data.shortName || '',
            description: data.description || '',
            time: data.time || '',
            startDate: date.startDate || -1,
            endData: date.endData || -1,
            instructors: data.instructors || [],
            users: data.users || [],
            occurences: data.occurences || []
        });

        course.save(callback);
        logger.log('Save command was sent');
    };

    edit = function (data, callback) {
        Course.update({accountId: data.accountId,
                _id: data.courseId
            }, {
                name: data.name || '',
                shortName: data.shortName || '',
                description: data.description || '',
                time: data.time || '',
                startDate: date.startDate || -1,
                endData: date.endData || -1,
                instructors: data.instructors || [],
                users: data.users || [],
                occurences: data.occurences || []
            }, function (err, numberAffected) {
                if (err) {
                    logger.error('Error occurred: ' + err);
                    callback(500);
                } else {
                    logger.log('The number of updated documents was %d', numberAffected);
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