module.exports = function (mongoose, config) {
    var crypto, CourseSchema, Course, findAll, findById, add, edit;

    crypto = require('crypto');

    CourseSchema = new mongoose.Schema({
        accountId: {type: mongoose.Schema.Types.ObjectId},
        name: {type: String},
        shortName: {type: String},
        description: {type: String},
        instructors: {type: Array},
        time: {type: String}
    });

    Course = mongoose.model('Course', CourseSchema);

    findById = function (ids, callback) {
        console.log('Course.findAll ' + ids.accountId);
        Course.findOne({accountId: ids.accountId, _id: ids.courseId}, function (err, docs) {
            callback(docs || false);
        });
    };

    findAll = function (accountId, callback) {
        console.log('Course.findAll ' + accountId);
        Course.find({accountId: accountId}, function (err, docs) {
            callback(docs);
        });
    };

    add = function (data, callback) {
        console.log('Adding course ' + data.name);
        var course = new Course({
            accountId: data.accountId,
            name: data.name,
            shortName: data.shortName,
            description: data.description,
            instructors: data.instructors,
            time: data.time
        });

        course.save(callback);
        console.log('Save command was sent');
    };

    edit = function (data, callback) {
        Course.update({accountId: data.accountId,
                _id: data.courseId
            }, {
                name: data.name || '',
                shortName: data.shortName || '',
                description: data.description || '',
                instructors: data.instructors || '',
                time: data.time || ''
            }, function (err, numberAffected) {
                if (err) {
                    console.log('Error occurred: ' + err);
                    callback(500);
                } else {
                    console.log('The number of updated documents was %d', numberAffected);
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