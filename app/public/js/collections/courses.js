define(['backbone',
    'models/course'], function (Backbone, CourseModel) {
    'use strict';

    var CoursesCollection = Backbone.Collection.extend({
        model: CourseModel,
        url: '/courses/'
    });

    return new CoursesCollection();
});