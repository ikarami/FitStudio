define(['backbone',
    'models/instructor'], function (Backbone, InstructorModel) {

    var InstructorsCollection = Backbone.Collection.extend({
        model: InstructorModel,
        url: '/instructors/'
    });

    return new InstructorsCollection();
});