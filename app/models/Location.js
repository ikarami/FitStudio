module.exports = function (logger, mongoose) {
    'use strict';

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
        logger.log('Location :: findAll ' + accountId);
        Location.find({accountId: accountId}, function (err, docs) {
            callback(docs);
        });
    };

    add = function (data, callback) {
        logger.log('Location :: add :: adding ' + data.name + ' ' + data.location);
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
        logger.log('Location :: add :: save command was sent');
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
            }, function (err) {
                if (err) {
                    logger.error('Location :: edit :: error occurred: ' + err);
                    callback(500);
                } else {
                    logger.log('Location :: edit :: success');
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