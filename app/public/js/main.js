require.config({
    paths: {
        jquery: 'libs/jquery-2.1.1',
        underscore: 'libs/underscore',
        backbone: 'libs/backbone',
        text: 'libs/text',
        templates: '../templates'
    },

    shim: {
        backbone: ['underscore', 'jquery'],
        FitStudio: ['backbone']
    }
});

require(['FitStudio'], function (FitStudio) {
    FitStudio.initialize();
});