module.exports = function (logger, mongoose) {
    var UserSchema, User, findAll, findById, add, edit;

    UserSchema = new mongoose.Schema({
        accountIds: [mongoose.Schema.Types.ObjectId],
        firstName: {type: String},
        lastName: {type: String},
        email: {type: String},
        phone: {type: String},
        classes: {type: Array}
    });

    User = mongoose.model('User', UserSchema);

    findById = function (ids, callback) {
        logger.log('User.findById ' + ids.accountId);
        User.findOne({accountIds: ids.accountId, _id: ids.userId}, function (err, docs) {
            callback(docs || false);
        });
    };

    findAll = function (accountId, callback) {
        logger.log('User.findAll ' + accountId);
        User.find({accountIds: accountId}, function (err, docs) {
            callback(docs);
        });
    };

    add = function (data, callback) {
        logger.log('Adding User ' + data.firstName + ' ' + data.lastName);
        var course = new User({
            accountIds: [data.accountId],
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email || '',
            phone: data.phone || '',
            classes: data.classes || []
        });

        course.save(callback);
        logger.log('Save command was sent');
    };

    edit = function (data, callback) {
        User.update({accountIds: data.accountId,
                _id: data.userId
            }, {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email || '',
                phone: data.phone || '',
                classes: data.classes || []
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