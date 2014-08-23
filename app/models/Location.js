module.exports = function (logger, mongoose) {
    var LocationSchema, Location, findAll, findById, add, edit;

    LocationSchema = new mongoose.Schema({
        accountId: {type: mongoose.Schema.Types.ObjectId},
        name: {type: String},
        description: {type: String},
        location: {type: String},
        address: {type: String},
        street: {type: String},
        city: {type: String},
        code: {type: String}
    });

    Location = mongoose.model('Location', LocationSchema);

    findById = function (ids, callback) {
        logger.log('Location.findAll ' + ids.accountId);
        Location.findOne({accountId: ids.accountId, _id: ids.locationId}, function (err, docs) {
            callback(docs || false);
        });
    };

    findAll = function (accountId, callback) {
        logger.log('Location.findAll ' + accountId);
        Location.find({accountId: accountId}, function (err, docs) {
            callback(docs);
        });
    };

    add = function (data, callback) {
        logger.log('Adding Location ' + data.name + ' ' + data.location);
        var location = new Location({
            accountId: data.accountId,
            name: data.name,
            description: data.description || '',
            location: data.location || '',
            address: data.address || '',
            street: data.street || '',
            city: data.city || '',
            code: data.code || ''
        });

        location.save(callback);
        logger.log('Save command was sent');
    };

    edit = function (data, callback) {
        Location.update({accountId: data.accountId,
                _id: data.locationId
            }, {
                name: data.name,
                description: data.description || '',
                location: data.location || '',
                address: data.address || '',
                street: data.street || '',
                city: data.city || '',
                code: data.code || ''
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