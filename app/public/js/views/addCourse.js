define(['jquery',
    'text!templates/addCourse.html'], function ($, addCourseTemplate) {
    var AddCourseView = Backbone.View.extend({
        el: $('#content'),
        events: {
            "submit form": "addCourse"
        },
        initialize: function () {

        },
        render: function() {
            this.$el.html(addCourseTemplate);
        },
        addCourse: function (event) {
            $.post('/addCourse', {
                name:  $('input[name=regularName]').val(),
                shortName:  $('input[name=shortName]').val(),
                description:  $('input[name=description]').val(),
                instructors:  $('input[name=instructors]').val(),
                time:  $('input[name=time]').val()
            }, function () {
                window.location.hash='#courses';
            });
            return false;
        }
    });
    return AddCourseView;
});