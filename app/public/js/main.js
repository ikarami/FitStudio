require.config({
    paths: {
        jquery: 'libs/jquery-2.1.1',
        bootstrap: 'libs/bootstrap.min',
        knockout: 'libs/knockout-3.1.0',
        'ko.customBindings': 'libs/knockout.customBindings',
        kb: 'libs/knockback',
        underscore: 'libs/underscore',
        backbone: 'libs/backbone',
        text: 'libs/text',
        locale: 'controllers/locale',
        collectionsController: 'controllers/collections',
        templates: '../templates',
        i18n: '../i18n'
    },

    shim: {
        kb: ['knockout'],
        'ko.customBindings': ['knockout'],
        backbone: ['underscore', 'jquery'],
        FitStudio: ['backbone'],
        bootstrap: ['jquery']
    }
});

require(['FitStudio', 'ko.customBindings', 'bootstrap'], function (FitStudio) {
    'use strict';

    FitStudio.initialize();
});