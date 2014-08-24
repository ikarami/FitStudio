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
            router.navigate({route: '#index'});
            router.fetchData();
        } else {
            router.navigate({route: '#login'});
        }
        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});