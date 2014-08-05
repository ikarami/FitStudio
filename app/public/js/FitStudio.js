define(['router'], function (router) {
    var initialize, checkLogin, runApplication;
    initialize = function () {
        checkLogin(runApplication);
    };

    checkLogin = function (callback) {
        $.ajax('/account/authenticated', {
            method: 'get',
            success: function () {
                return callback (true);
            },
            error: function () {
                return callback(false);
            }
        });
    };

    runApplication = function (authenticated) {
        if (authenticated) {
            window.location.hash = 'index';
        } else {
            window.location.hash = 'login';
        }
        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});