require.config({
    paths: {
        jquery: 'libs/jquery-2.1.1',
        ko: 'libs/knockout-3.1.0',
        'ko.customBindings': 'libs/knockout.customBindings',
        underscore: 'libs/underscore',
        backbone: 'libs/backbone',
        text: 'libs/text',
        locale: 'modules/locale',
        templates: '../templates',
        i18n: '../i18n',
        bootstrap: 'http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min'
    },

    shim: {
        'ko.customBindings': ['ko'],
        backbone: ['underscore', 'jquery'],
        FitStudio: ['backbone'],
        bootstrap: ['jquery']
    }
});

require(['FitStudio', 'ko.customBindings', 'bootstrap'], function (FitStudio) {
    FitStudio.initialize();
});