define(['jquery',
    'backbone',
    'knockout',
    'kb',
    'collections/users',
    'models/user',
    'text!templates/editUser.html'], function ($, Backbone, ko, kb, usersCollection, UserModel, editUserTemplate) {
    'use strict';

    var EditUserView = Backbone.View.extend({
        el: $('#content'),

        initialize: function (args) {
            var view = this, ViewModel;

            ViewModel = function () {
                var self = this, model;

                self.addMode = (args.id === 'new') ? true : false;

                if (self.addMode) {
                    model = new UserModel();
                } else {
                    model = usersCollection.findWhere({_id: args.id});
                    model.commit();
                }

                self.firstName = kb.observable(model, 'firstName');
                self.lastName = kb.observable(model, 'lastName');
                self.email = kb.observable(model, 'email');
                self.phone = kb.observable(model, 'phone');

                self.classesList = kb.observable(model, {
                    key: 'classes',
                    read: function () {
                        return model.get('classes') ? model.get('classes').join(', ') : '';
                    },
                    write: function (value) {
                        model.set('classes', value.split(',').map(function (item) {
                                return item.trim();
                            }));
                    }
                }, this);

                self.cleanModel = function () {
                    if (model.isNew()) {
                        model.destroy();
                    } else {
                        model.revert();
                    }
                };

                self.goToList = function () {
                    self.cleanModel();
                    view.trigger('navigate', {
                        route: '#users'
                    });
                };

                self.add = function (event) {
                    usersCollection.add(model);
                    model.commit();
                    model.save();
                    self.goToList();
                };

                self.save = function (event) {
                    model.commit();
                    model.save();
                    self.goToList();
                };
            };
            this.viewModel = new ViewModel();
        },
        show: function () {
            this.render();
            this.bind();
        },
        render: function() {
            this.$el.html(editUserTemplate);
        },

        bind: function () {
            ko.applyBindings(this.viewModel, this.el);
        },

        onHide: function () {
            ko.cleanNode(this.el);
        }
    });
    return EditUserView;
});