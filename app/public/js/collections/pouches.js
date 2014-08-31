define(['backbone',
    'models/pouch'], function (Backbone, PouchModel) {
    'use strict';

    var PouchesCollection = Backbone.Collection.extend({
        model: PouchModel,
        url: '/pouches/'
    });

    return new PouchesCollection();
});