define(['jquery',
    'underscore',
    'backbone',
    'knockout',
    'kb',
    'collections/users',
    'collections/courses',
    'models/user',
    'text!templates/editUser.html'], function ($, _, Backbone, ko, kb, usersCollection, coursesCollection, UserModel, editUserTemplate) {
    'use strict';

    var EditUserView = Backbone.View.extend({
        el: $('#content'),

        initialize: function (args) {
            var view = this, ViewModel;

            view.on('save', function (args) {
                view.viewModel.coursesList(_.compact(args.selected.map(function (id) {
                    var model = coursesCollection.findWhere({_id: id});
                    if (model) {
                        return model.getShortInfo();
                    }
                })));
            });

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

                self.coursesList = kb.observable(model, 'classes');

                self.cleanModel = function () {
                    if (model.isNew()) {
                        model.destroy();
                    } else {
                        model.revert();
                    }
                };

                self.goToList = function (args) {
                    if (!args || (args && args.clean !== false)) {
                        self.cleanModel();
                    }
                    view.trigger('navigate', {
                        route: '#users'
                    });
                };

                self.add = function () {
                    usersCollection.add(model);
                    model.commit();
                    model.save({}, {wait: true});
                    self.goToList({clean: false});
                };

                self.save = function () {
                    model.save(model.commit());
                    self.goToList({clean: false});
                };

                self.editCourses = function () {
                    view.trigger('modal', {
                        selected: _.compact(self.coursesList().map(function (item) {return item && item._id; })),
                        content: coursesCollection.map(function (item) {return {value: item.get('_id'), label: item.get('name') + ' - ' + item.get('description')}; }),
                        type: 'list',
                        title: 'modal.selectCourses'
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