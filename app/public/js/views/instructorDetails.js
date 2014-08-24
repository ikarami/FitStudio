define(['jquery',
    'underscore',
    'knockout',
    'text!templates/instructorDetails.html'], function ($, _, ko, instructorDetailsTemplate) {
    var UserDetailsView = Backbone.View.extend({
        el: $('#content'),

        initialize: function (args) {
            var view = this;
            if (!args.data) {
                args.data = {};
            }

            var ViewModel = function () {
                var self = this, _id;

                self.firstName = ko.observable(args.data.firstName);
                self.lastName = ko.observable(args.data.lastName);
                self.email = ko.observable(args.data.email);
                self.phone = ko.observable(args.data.phone);
                self.classes = ko.observable(args.data.classes);
                _id = args.data._id;

                self.goToDashboard = function () {
                    view.trigger('navigate', {
                        route: '#index'
                    });
                };

                self.goToList = function () {
                    view.trigger('navigate', {
                        route: '#instructors'
                    });
                };

                self.edit = function () {
                    view.trigger('navigate', {
                        route: '#instructors/' + _id + '/edit',
                        model: {
                            _id: _id,
                            firstName:  self.firstName(),
                            lastName:  self.lastName(),
                            email:  self.email(),
                            phone:  self.phone(),
                            classes:  self.classes()
                        }
                    });
                };

                self.remove = function () {
                    $.ajax({
                        method: 'DELETE',
                        url: '/instructors/' + _id,
                        success: function () {
                            view.trigger('navigate', {
                                route: '#instructors'
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
            this.$el.html(instructorDetailsTemplate);
        },

        bind: function () {
            ko.applyBindings(this.viewModel, this.el);
        },

        onHide: function () {
            ko.cleanNode(this.el);
        }
    });
    return UserDetailsView;
});