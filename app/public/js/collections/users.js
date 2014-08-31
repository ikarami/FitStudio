define(['backbone',
    'models/user'], function (Backbone, UserModel) {
    'use strict';

    var UsersCollection = Backbone.Collection.extend({
        model: UserModel,
        url: '/users/'
    });

    return new UsersCollection();
});