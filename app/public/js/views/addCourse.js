define(['jquery',
    'ko',
    'text!templates/addCourse.html'], function ($, ko, addCourseTemplate) {
    var AddCourseView = Backbone.View.extend({
        el: $('#content'),
        events: {
            "submit form": "addCourse"
        },
        initialize: function () {
            var ViewModel = function () {
                var self = this;

                self.regularName = ko.observable();
                self.shortName = ko.observable();
                self.description = ko.observable();
                self.instructors = ko.observable();
                self.time = ko.observable();

                self.goToList = function () {
                    window.location.hash='#courses';
                };

                self.addCourse = function (event) {
                    $.post('/courses/me', {
                        name:  self.regularName(),
                        shortName:  self.shortName(),
                        description:  self.description(),
                        instructors:  self.instructors(),
                        time:  self.time()
                    }, function () {
                        window.location.hash='#courses';
                    });
                };
            };
            this.viewModel = new ViewModel();
        },
        show: function () {
            this.render();
            this.bind();
        },
        render: function() {
            this.$el.html(addCourseTemplate);
        },

        bind: function () {
            ko.applyBindings(this.viewModel, this.el);
        },

        onHide: function () {
            ko.cleanNode(this.el);
        }
    });
    return AddCourseView;
});