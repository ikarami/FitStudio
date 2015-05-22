define(['underscore', 'jquery'], function (_, $) {
    'use strict';

    var Session = function SessionConstructor() {
        var intervalValue = 15 * 1000,
            interval,
            intervalHandler;

        intervalHandler = function sessionIntervalHandler() {
            this.checkLogin(function (result) {
                if (!result) {
                    window.alert('You have been logged out');
                    clearInterval(interval);
                }
            });
        }.bind(this);

        this.start = function sessionStart() {
            if (interval) {
                clearInterval(interval);
            }
            interval = setInterval(intervalHandler, intervalValue);
        };

        this.logout = function sessionLogout() {
            clearInterval(interval);
            $.get('/account/logout').always(function () {
                // to do: it should notify router instead of doing direct navigation!
                window.location.hash = '#login';
            });
        };

        this.checkLogin = function (callback) {
            $.ajax('/account/authenticated', {
                method: 'get',
                success: function () {
                    return callback(true);
                },
                error: function () {
                    return callback(false);
                }
            });
        };
    };

    return new Session();
});