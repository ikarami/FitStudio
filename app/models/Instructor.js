module.exports = function (mongoose, nodemailer, config) {
    var InstructorSchema, Instructor, findAll, findById, add;

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
        console.log('Instructor.findAll ' + ids.accountId);
        Instructor.findOne({accountId: ids.accountId, _id: ids.courseId}, function (err, docs) {
            callback(docs || false);
        });
    };

    findAll = function (accountId, callback) {
        console.log('Instructor.findAll ' + accountId);
        Course.find({accountId: accountId}, function (err, docs) {
            callback(docs);
        });
    };

    add = function (data, callback) {
        console.log('Adding Instructor ' + data.name);
        var course = new Course({
            accountId: data.accountId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            classes: data.classes || []
        });

        course.save(callback);
        console.log('Save command was sent');
    };

    return {
        findAll: findAll,
        add: add,
        findById: findById
    };
};