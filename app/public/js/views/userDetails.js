define(['jquery',
    'underscore',
    'ko',
    'text!templates/userDetails.html'], function ($, _, ko, userDetailsTemplate) {
    var UserDetailsView = Backbone.View.extend({
        el: $('#content'),

        initialize: function (args) {
            var view = this;
            if (!args.data) {
                args.data = {};
            }

            var ViewModel = function () {
                var self = this, _id, constructUser;

                self.addMode = (args.id === 'new') ? true : false;
                self.firstName = ko.observable(args.data.firstName);
                self.lastName = ko.observable(args.data.lastName);
                self.email = ko.observable(args.data.email);
                self.phone = ko.observable(args.data.phone);
                self.classes = ko.observable(args.data.classes ? args.data.classes.join(', ') : '');
                _id = args.data._id;

                self.goToDashboard = function () {
                    view.trigger('navigate', {
                        route: '#index'
                    });
                };

                self.goToList = function () {
                    view.trigger('navigate', {
                        route: '#users'
                    });
                };

                self.edit = function () {
                    view.trigger('navigate', {
                        route: '#users/' + _id + '/edit',
                        model: {
                            _id: _id,
                            firstName:  self.firstName(),
                            lastName:  self.lastName(),
                            email:  self.email(),
                            phone:  self.phone(),
                            classes:  self.classes().split(',')
                        }
                    });
                };

                self.remove = function () {
                    $.ajax({
                        method: 'DELETE',
                        url: '/users/' + _id,
                        success: function () {
                            view.trigger('navigate', {
                                route: '#users'
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
            this.$el.html(userDetailsTemplate);
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