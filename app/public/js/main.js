require.config({
    paths: {
        jquery: 'libs/jquery-2.1.4',
        bootstrap: 'libs/bootstrap.min',
        knockout: 'libs/knockout-3.3.0',
        'ko.customBindings': 'libs/knockout.customBindings',
        'ko.customComponents': 'libs/knockout.customComponents',
        kb: 'libs/knockback',
        underscore: 'libs/underscore',
        backbone: 'libs/backbone',
        text: 'libs/text',
        locale: 'controllers/locale',
        collectionsController: 'controllers/collections',
        templates: '../templates',
        i18n: '../i18n',
        moment: 'libs/moment',
        timepicker: 'libs/jquery.timepicker',
        'moment-recur': 'libs/moment-recur'
    },

    shim: {
        kb: ['knockout'],
        'ko.customBindings': ['knockout'],
        backbone: ['underscore', 'jquery'],
        FitStudio: ['backbone'],
        bootstrap: ['jquery']
    }
});

require(['FitStudio', 'ko.customBindings', 'ko.customComponents', 'bootstrap'], function (FitStudio) {
    'use strict';

    FitStudio.initialize();
});
