define(['jquery',
    'text!templates/courses.html'], function ($, coursesTemplate) {
    var CoursesView = Backbone.View.extend({
        el: $('#content'),

        initialize: function () {

        },
        render: function() {
            this.$el.html(coursesTemplate);
        }
    });
    return CoursesView;
});