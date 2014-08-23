module.exports = function (mongoose, nodemailer, config) {
    var crypto, AccountSchema, Account, registerCallback, changePassword, forgotPassword, login, register, findById;

    crypto = require('crypto');

    AccountSchema = new mongoose.Schema({
        email: {type: String, unique: true},
        password: {type: String},
        name: {
            first: {type: String},
            last: {type: String}
        },
        description: {type: String}
    });

    Account = mongoose.model('Account', AccountSchema);

    registerCallback = function (err) {
        if (err) {
            return app.logger.error(err);
        }
        return app.logger.log('Account was created');
    };

    login = function (email, password, callback) {
        var shaSum = crypto.createHash('sha256');
        shaSum.update(password);
        Account.findOne({email: email, password: shaSum.digest('hex')}, function (err, doc) {
            callback(doc || false);
        });
    };

    register = function (personData) {
        var shaSum, user;
        shaSum = crypto.createHash('sha256');
        shaSum.update(personData.password);

        app.logger.log('Registering ' + personData.email);
        user = new Account({
            email: personData.email,
            name: {
                first: personData.firstName,
                last: personData.lastName
            },
            password: shaSum.digest('hex')
        });
        user.save(registerCallback);
        app.logger.log('Save command was sent');
    };

    changePassword = function (accountId, newPassword) {
        var shaSum = crypto.createHash('sha256');
        shaSum.update(newPassword);
        Account.update({_id: accountId}, {$set: {password: shaSum.digest('hex')}}, {upsert: false}, function changePasswordCallback (err) {
            if (err) {
                app.logger.log('Change password failed for account ' + accountId + ' with an error: ' + err);
            } else {
                app.logger.log('Change password done for account ' + accountId);
            }
        });
    };

    forgotPassword = function (email, resetPasswordUrl) {
        Account.findOne({
                email: email
            }, function findAccount(err, doc) {
                if (err) {
                    app.logger.log('forgotPassword :: email is not related to any account');
                } else {
                    var smtpTransport = nodemailer.createTransport(config.mail);
                    if (!doc) {
                        app.logger.log('url: ' + resetPasswordUrl);
                        return;
                    }
                    resetPasswordUrl += '?account=' + doc._id;
                    app.logger.log('url: ' + resetPasswordUrl);
                    smtpTransport.sendMail({
                        from: 'thisapp@example.com',
                        to: doc.email,
                        subject: 'test reset hasla',
                        text: 'Click here to reset your password ' + resetPasswordUrl
                    }, function (error, info) {
                        if (error) {
                            app.logger.log(error);
                        } else {
                            app.logger.log('Message sent: ' + info.response);
                        }
                    });
                }
            }
        );
    };

    findById = function (ids, callback) {
        app.logger.log('Account.findOne ' + ids._id);
        Account.findOne({_id: ids._id}, function (err, docs) {
            callback(err, docs);
        });
    };

    return {
        login: login,
        register: register,
        Account: Account,
        findById: findById,
        forgotPassword: forgotPassword,
        changePassword: changePassword
    };
};