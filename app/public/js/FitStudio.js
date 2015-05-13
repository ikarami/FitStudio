define(['router', 'jquery', 'backbone', 'controllers/session'], function (router, $, Backbone, sessionController) {
    'use strict';

    var initialize, checkLogin, runApplication;
    initialize = function () {
        checkLogin(runApplication);
    };

    checkLogin = function (callback) {
        sessionController.checkLogin(callback);
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