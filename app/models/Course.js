module.exports = function (mongoose, nodemailer, config) {
    var crypto, CourseSchema, Course, findAll, add;

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

    return {
        findAll: findAll,
        add: add
    };
};