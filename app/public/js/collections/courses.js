define(['backbone',
    'models/course'], function (Backbone, CourseModel) {

    var CoursesCollection = Backbone.Collection.extend({
        model: CourseModel,
        url: '/courses/'
    });

    return new CoursesCollection();
});