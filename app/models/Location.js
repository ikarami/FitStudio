module.exports = function (mongoose) {
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
        console.log('Location.findAll ' + ids.accountId);
        Location.findOne({accountId: ids.accountId, _id: ids.locationId}, function (err, docs) {
            callback(docs || false);
        });
    };

    findAll = function (accountId, callback) {
        console.log('Location.findAll ' + accountId);
        Location.find({accountId: accountId}, function (err, docs) {
            callback(docs);
        });
    };

    add = function (data, callback) {
        console.log('Adding Location ' + data.name + ' ' + data.location);
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
        console.log('Save command was sent');
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