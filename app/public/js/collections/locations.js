define(['backbone',
    'models/location'], function (Backbone, LocationModel) {
    'use strict';

    var LocationsCollection = Backbone.Collection.extend({
        model: LocationModel,
        url: '/locations/'
    });

    return new LocationsCollection();
});