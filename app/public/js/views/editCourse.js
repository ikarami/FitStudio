define(['jquery',
    'knockout',
    'text!templates/editCourse.html'], function ($, ko, editCourseTemplate) {
    var EditCourseView = Backbone.View.extend({
        el: $('#content'),

        initialize: function (args) {
            var view = this;
            if (!args.data) {
                args.data = {};
            }

            var ViewModel = function () {
                var self = this, _id;

                self.addMode = (args.id === 'new') ? true : false;
                self.regularName = ko.observable(args.data.name);
                self.shortName = ko.observable(args.data.shortName);
                self.description = ko.observable(args.data.description);
                self.instructors = ko.observable(args.data.instructors);
                self.time = ko.observable(args.data.time);
                _id = args.data._id;

                self.goToList = function () {
                    window.location.hash='#courses';
                };

                self.add = function (event) {
                    $.post('/courses/me', {
                        name:  self.regularName(),
                        shortName:  self.shortName(),
                        description:  self.description(),
                        instructors:  self.instructors(),
                        time:  self.time()
                    }, function () {
                        view.trigger('navigate', {
                            route: '#courses'
                        });
                    });
                };

                self.save = function (event) {
                    $.ajax('/courses/' + _id, {
                        method: 'PUT',
                        data: {
                            name:  self.regularName(),
                            shortName:  self.shortName(),
                            description:  self.description(),
                            instructors:  self.instructors(),
                            time:  self.time()
                        },
                        success: function () {
                            view.trigger('navigate', {
                                route: '#courses'
                            });
                        }
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
            this.$el.html(editCourseTemplate);
        },

        bind: function () {
            ko.applyBindings(this.viewModel, this.el);
        },

        onHide: function () {
            ko.cleanNode(this.el);
        }
    });
    return EditCourseView;
});