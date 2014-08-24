define(['jquery',
    'underscore',
    'knockout',
    'kb',
    'collections/users',
    'text!templates/users.html'], function ($, _, ko, kb, usersCollection, usersTemplate) {
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

                self.remove = function () {
                    var model = usersCollection.findWhere({_id: this._id()});
                    model.destroy();
                };

                self.edit = function () {
                    view.trigger('navigate', {
                        route: '#users/' + this._id() + '/edit'
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