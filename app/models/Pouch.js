module.exports = function (mongoose) {
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
        console.log('Pouch.findById ' + ids.accountId);
        Pouch.findOne({accountId: ids.accountId, _id: ids.pouchId}, function (err, docs) {
            callback(docs || false);
        });
    };

    findAll = function (accountId, callback) {
        console.log('Pouch.findAll ' + accountId);
        Pouch.find({accountId: accountId}, function (err, docs) {
            callback(docs);
        });
    };

    add = function (data, callback) {
        console.log('Adding Pouch ');
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
        console.log('Save command was sent');
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