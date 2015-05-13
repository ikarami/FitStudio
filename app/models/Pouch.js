module.exports = function (logger, mongoose) {
    'use strict';

    var PouchSchema, Pouch, findAll, findById, add, edit, addOperation;

    PouchSchema = new mongoose.Schema({
        accountId: {type: mongoose.Schema.Types.ObjectId},
        name: {type: String},
        created: {type: Number},
        lastUpdated: {type: Number},
        balance: {type: Number},
        operations: {type: Array},
        owner: {type: String}
    });

    Pouch = mongoose.model('Pouch', PouchSchema);

    findById = function (ids, callback) {
        logger.log('Pouch :: findById ' + ids.accountId);
        Pouch.findOne({accountId: ids.accountId, _id: ids.pouchId}, function (err, docs) {
            callback(docs || false);
        });
    };

    findAll = function (accountId, callback) {
        logger.log('Pouch :: findAll ' + accountId);
        Pouch.find({accountId: accountId}, function (err, docs) {
            callback(docs);
        });
    };

    add = function (data, callback) {
        logger.log('Pouch :: add');
        var course = new Pouch({
            accountId: data.accountId,
            name: data.name,
            created: data.created || new Date().getTime(),
            lastUpdated: data.lastUpdated || new Date().getTime(),
            balance: data.balance || 0,
            operations: data.operations || [],
            owner: data.owner || ''
        });

        course.save(callback);
        logger.log('Pouch :: add :: save command was sent');
    };

    edit = function (data, callback) {
        Pouch.update({accountId: data.accountId,
                _id: data.pouchId
            }, {
                name: data.name,
                lastUpdated: new Date().getTime(),
                balance: data.balance || 0,
                operations: data.operations || [],
                owner: data.owner || ''
            }, function (err) {
                if (err) {
                    logger.error('Pouch :: edit :: error occurred: ' + err);
                    callback(500);
                } else {
                    logger.log('Pouch :: edit :: success');
                    callback(200);
                }
            }
        );
    };

    addOperation = function (data, callback) {
        this.findById({accountId: data.accountId, pouchId: data.pouchId}, function (pouch) {
            if (!pouch) {
                callback(404);
                return;
            }
            pouch.operations.push(data.operation);
            pouch.markModified('operations');
            pouch.balance += Number(data.operation.amount);
            pouch.save(function (err) {
                if (err) {
                    callback(500);
                    return;
                }
                callback(200);
            });
        });
    };

    return {
        findAll: findAll,
        add: add,
        findById: findById,
        edit: edit,
        addOperation: addOperation
    };
};