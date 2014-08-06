require.config({
    paths: {
        jquery: 'libs/jquery-2.1.1',
        underscore: 'libs/underscore',
        backbone: 'libs/backbone',
        text: 'libs/text',
        templates: '../templates',
        bootstrap: 'http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min'
    },

    shim: {
        backbone: ['underscore', 'jquery'],
        FitStudio: ['backbone'],
        bootstrap: ['jquery']
    }
});

require(['FitStudio', 'bootstrap'], function (FitStudio) {
    FitStudio.initialize();
});