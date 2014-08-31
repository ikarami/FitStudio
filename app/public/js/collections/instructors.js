define(['backbone',
    'models/instructor'], function (Backbone, InstructorModel) {
    'use strict';

    var InstructorsCollection = Backbone.Collection.extend({
        model: InstructorModel,
        url: '/instructors/'
    });

    return new InstructorsCollection();
});