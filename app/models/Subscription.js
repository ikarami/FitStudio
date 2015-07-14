module.exports = function (logger, mongoose) {
    'use strict';

    var SubscriptionSchema, Subscription, findAll, findById, add, edit;

    SubscriptionSchema = new mongoose.Schema({
        accountId: {type: mongoose.Schema.Types.ObjectId},
        name: {type: String},
        cost: {type: Number},
        numberOfEntries: {type: Number},
        params: {type: Array},
        classes: {type: Array}
    });

    Subscription = mongoose.model('Subscription', SubscriptionSchema);

    findById = function (ids, callback) {
        logger.log('Subscription :: findById :: ' + ids.accountId);
        Subscription.findOne({accountId: ids.accountId, _id: ids.subscriptionId}, function (err, docs) {
            callback(docs || false);
        });
    };

    findAll = function (accountId, callback) {
        logger.log('Subscription :: findAll :: ' + accountId);
        Subscription.find({accountId: accountId}, function (err, docs) {
            callback(docs);
        });
    };

    add = function (data, callback) {
        logger.log('Subscription :: add :: accountId ' + data.accountId);
        var course = new Subscription({
            accountId: data.accountId
        });

        course.save(callback);
        logger.log('Subscription :: add :: save command was sent');
    };

    edit = function (data, callback) {
        Subscription.update({
                accountId: data.accountId,
                _id: data.subscriptionId
            }, {
                name: data.name,
                cost: data.cost,
                numberOfEntries: data.numberOfEntries || '',
                params: data.params || [],
                classes: data.classes || []
            }, function (err) {
                if (err) {
                    logger.error('Subscription :: update :: error occurred: ' + err);
                    callback(500);
                } else {
                    logger.log('Subscription :: update :: success');
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
