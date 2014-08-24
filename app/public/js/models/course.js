define(['backbone'], function (Backbone) {

    var CourseModel = Backbone.Model.extend({
        idAttribute: '_id',
        defaults: {
            name: '',
            shortName: '',
            description: '',
            instructors: [],
            time: ''
        },
        url: function () {
            // PUT for /courses/:id POST for /courses/me
            return this.id ? '/courses/' + this.id : '/courses/me';
        }
    });

    return CourseModel;
});