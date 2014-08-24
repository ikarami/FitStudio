define(['jquery',
    'underscore',
    'knockout',
    'kb',
    'collections/users',
    'text!templates/userDetails.html'], function ($, _, ko, kb, usersCollection, userDetailsTemplate) {
    var UserDetailsView = Backbone.View.extend({
        el: $('#content'),

        initialize: function (args) {
            var view = this;

            var ViewModel = function () {
                var self = this, model;

                model = usersCollection.findWhere({_id: args.id});

                self.firstName = kb.observable(model, 'firstName');
                self.lastName = kb.observable(model, 'lastName');
                self.email = kb.observable(model, 'email');
                self.phone = kb.observable(model, 'phone');
                self.classes = kb.observable(model, 'classes');

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
                        route: '#users/' + model.get('_id') + '/edit'
                    });
                };

                self.remove = function () {
                    var result, callback;
                    callback = function () {
                        view.trigger('navigate', {
                            route: '#users'
                        });
                    };

                    result = model.destroy();

                    if (result) {
                        result.always(callback);
                    } else {
                        callback();
                    }
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