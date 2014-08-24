define(['jquery',
    'underscore',
    'knockout',
    'text!templates/courseDetails.html'], function ($, _, ko, courseDetailsTemplate) {
    var CourseDetailsView = Backbone.View.extend({
        el: $('#content'),

        initialize: function (args) {
            var view = this;
            if (!args.data) {
                args.data = {};
            }

            var ViewModel = function () {
                var self = this, _id;

                self.name = ko.observable(args.data.name);
                self.shortName = ko.observable(args.data.shortName);
                self.description = ko.observable(args.data.description);
                self.instructors = ko.observable(args.data.instructors);
                self.time = ko.observable(args.data.time);
                _id = args.data._id;

                self.goToDashboard = function () {
                    view.trigger('navigate', {
                        route: '#index'
                    });
                };

                self.goToList = function () {
                    view.trigger('navigate', {
                        route: '#courses'
                    });
                };

                self.edit = function () {
                    view.trigger('navigate', {
                        route: '#courses/' + _id + '/edit',
                        model: {
                            _id: _id,
                            name:  self.name(),
                            shortName:  self.shortName(),
                            description:  self.description(),
                            instructors:  self.instructors(),
                            time:  self.time()
                        }
                    });
                };

                self.remove = function () {
                    $.ajax({
                        method: 'DELETE',
                        url: '/courses/' + _id,
                        success: function () {
                            view.trigger('navigate', {
                                route: '#courses'
                            });
                        }.bind(this)
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
            this.$el.html(courseDetailsTemplate);
        },

        bind: function () {
            ko.applyBindings(this.viewModel, this.el);
        },

        onHide: function () {
            ko.cleanNode(this.el);
        }
    });
    return CourseDetailsView;
});