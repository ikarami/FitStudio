define(['backbone',
    'models/pouch'], function (Backbone, PouchModel) {

    var PouchesCollection = Backbone.Collection.extend({
        model: PouchModel,
        url: '/pouches/'
    });

    return new PouchesCollection();
});