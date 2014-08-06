module.exports = function (mongoose, nodemailer, config) {
    var crypto, AccountSchema, Account, registerCallback, changePassword, forgotPassword, login, register;

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
            return console.log(err);
        }
        return console.log('Account was created');
    };

    login = function (email, password, callback) {
        var shaSum = crypto.createHash('sha256');
        shaSum.update(password);
        Account.findOne({email: email, password: shaSum.digest('hex')}, function (err, doc) {
            callback(null !== doc);
        });
    };

    register = function (personData) {
        var shaSum, user;
        shaSum = crypto.createHash('sha256');
        shaSum.update(personData.password);

        console.log('Registering ' + personData.email);
        user = new Account({
            email: personData.email,
            name: {
                first: personData.firstName,
                last: personData.lastName
            },
            password: shaSum.digest('hex')
        });
        user.save(registerCallback);
        console.log('Save command was sent');
    };

    forgotPassword = function (email, resetPasswordUrl) {
        Account.findOne({
                email: email
            }, function findAccount(err, doc) {
                if (err) {
                    console.log('forgotPassword :: email is not related to any account');
                } else {
                    var smtpTransport = nodemailer.createTransport(config.mail);
                    if (!doc) {
                        console.log('url: ' + resetPasswordUrl);
                        return;
                    }
                    resetPasswordUrl += '?account=' + doc._id;
                    console.log('url: ' + resetPasswordUrl);
                    smtpTransport.sendMail({
                        from: 'thisapp@example.com',
                        to: doc.email,
                        subject: 'test reset hasla',
                        text: 'Click here to reset your password ' + resetPasswordUrl
                    }, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Message sent: ' + info.response);
                        }
                    });
                }
            }
        );
    };

    return {
        login: login,
        register: register,
        Account: Account,
        forgotPassword: forgotPassword
    };
};