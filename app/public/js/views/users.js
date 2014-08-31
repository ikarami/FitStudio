define(['jquery',
    'underscore',
    'backbone',
    'knockout',
    'kb',
    'collections/users',
    'text!templates/users.html'], function ($, _, Backbone, ko, kb, usersCollection, usersTemplate) {
    'use strict';

    var UsersView = Backbone.View.extend({
        el: $('#content'),

        initialize: function () {
            var ViewModel, view = this;

            ViewModel = function () {
                var self = this;
                self.users = kb.collectionObservable(usersCollection, {view_model: kb.ViewModel});

                self.add = function () {
                    view.trigger('navigate', {
                        route: '#users/new/edit'
                    });
                };

                self.details = function () {
                    view.trigger('navigate', {
                        route: '#users/' + this._id()
                    });
                };

                self.goToDashboard = function () {
                    view.trigger('navigate', {
                        route: '#index'
                    });
                };

                self.edit = function () {
                    view.trigger('navigate', {
                        route: '#users/' + this._id() + '/edit'
                    });
                };

                self.remove = function () {
                    var model = usersCollection.findWhere({_id: this._id()});
                    model.destroy();
                };
            };
            this.viewModel = new ViewModel();
        },

        show: function () {
            this.render();
            this.bind();
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