define(['jquery',
    'underscore',
    'ko',
    'collections/users',
    'text!templates/users.html'], function ($, _, ko, usersCollection, usersTemplate) {
    var UsersView = Backbone.View.extend({
        el: $('#content'),

        initialize: function () {
            var ViewModel, view = this;

            ViewModel = function () {
                var self = this;
                self.users = ko.observableArray();

                self.add = function () {
                    view.trigger('navigate', {
                        route: '#users/new/edit'
                    });
                };

                self.details = function () {
                    view.trigger('navigate', {
                        route: '#users/' + this._id,
                        model: this
                    });
                };

                self.goToDashboard = function () {
                    view.trigger('navigate', {
                        route: '#index'
                    });
                };

                self.remove = function () {
                    $.ajax({
                        method: 'DELETE',
                        url: '/users/' + this._id,
                        success: function () {
                            self.users.remove(this);
                        }.bind(this)
                    });
                };

                self.edit = function () {
                    view.trigger('navigate', {
                        route: '#users/' + this._id + '/edit',
                        model: this
                    });
                };
            };
            this.viewModel = new ViewModel();
        },

        show: function () {
            this.render();
            this.bind();

            usersCollection.toArray().forEach(function (user) {
                this.viewModel.users.push(user.toJSON());
            }, this);
        },

        render: function() {
            this.$el.html(usersTemplate);
        },

        bind: function () {
            ko.applyBindings(this.viewModel, this.el);
        },

        onHide: function () {
            ko.cleanNode(this.el);
        }
    });
    return UsersView;
});