define(['jquery',
    'underscore',
    'backbone',
    'knockout',
    'kb',
    'collections/courses',
    'collections/users',
    'collections/instructors',
    'models/entry',
    'text!templates/entryDetails.html'
], function ($, _, Backbone, ko, kb, coursesCollection, usersCollection, instructorsCollection, EntryModel, entryDetailsTemplate) {
    'use strict';

    var EntryDetailsView = Backbone.View.extend({
        el: $('#content'),

        initialize: function (args) {
            var view = this, ViewModel;

            view.on('save', function (args) {
                if (args.field === 'courseUsers') {
                    if (args.selected && args.selected.length) {
                        args.selected.forEach(function (id) {
                            var model = usersCollection.findWhere({_id: id});
                            if (model) {
                                view.viewModel.markAsPresent(model.getShortInfo());
                            }
                        });

                    }
                } else if (args.field === 'courseInstructors') {
                    if (args.selected && args.selected.length) {
                        args.selected.forEach(function (id) {
                            var model = instructorsCollection.findWhere({_id: id});
                            if (model) {
                                view.viewModel.addToActualInstructors(model.getShortInfo());
                            }
                        });
                    }
                }
            });

            ViewModel = function () {
                var self = this, model, courseModel;

                model = new EntryModel({
                    id: args.id,
                    courseId: args.courseId
                });
                model.fetch();

                courseModel = coursesCollection.get(args.courseId);

                self.startDate = kb.observable(model, 'startDate');
                self.endDate = kb.observable(model, 'endDate');
                self.comments = kb.observable(model, 'comments');

                self.actualUsers = kb.observable(model, 'actualUsers');

                self.missedUsers = kb.observable(model, 'missedUsers');
                self.actualInstructors = kb.observable(model, 'actualInstructors');

                self.courseName = kb.observable(courseModel, 'name');
                self._courseUsers = kb.observable(courseModel, 'users');

                self.courseUsers = ko.computed(function () {
                    var users = self._courseUsers();
                    // check for presence in missedUsers AND actualUsers
                    var actualUsersIds = _.pluck(self.actualUsers(), model.idAttribute);
                    var missedUsersIds = _.pluck(self.missedUsers(), model.idAttribute);

                    users = users.map(function (user) {
                        if ((actualUsersIds.indexOf(user._id) !== -1) || (missedUsersIds.indexOf(user._id) !== -1)) {
                            return undefined;
                        }
                        return user;
                    });

                    return _.without(users, undefined);
                });

                self.markAsPresent = function (data) {
                    var actualUsers = model.get('actualUsers');
                    actualUsers = actualUsers.slice();
                    actualUsers.push(data);
                    model.set('actualUsers', actualUsers);
                    model.save();
                };

                self.removeFromActualUsers = function (data) {
                    // find by id
                    var actualUsers = model.get('actualUsers');
                    actualUsers = _.without(actualUsers, data);
                    model.set('actualUsers', actualUsers);
                    model.save();
                };

                self.addToActualInstructors = function (data) {
                    var actualInstructors = model.get('actualInstructors');
                    actualInstructors = actualInstructors.slice();
                    actualInstructors.push(data);
                    model.set('actualInstructors', actualInstructors);
                    model.save();
                };

                self.removeInstructor = function (data) {
                    var actualInstructors = model.get('actualInstructors');
                    actualInstructors = _.without(actualInstructors, data);
                    model.set('actualInstructors', actualInstructors);
                    model.save();
                };

                self.markAsMissed = function (data) {
                    var missedUsers = model.get('missedUsers');
                    missedUsers = missedUsers.slice();
                    missedUsers.push(data);
                    model.set('missedUsers', missedUsers);
                    model.save();
                };

                self.removeFromMissedUsers = function (data) {
                    // find by id
                    var missedUsers = model.get('missedUsers');
                    missedUsers = _.without(missedUsers, data);
                    model.set('missedUsers', missedUsers);
                    model.save();
                };

                self.goToDashboard = function () {
                    view.trigger('navigate', {
                        route: '#index'
                    });
                };

                /*self.goToList = function () {
                    view.trigger('navigate', {
                        route: '#courses'
                    });
                };

                self.edit = function () {
                    view.trigger('navigate', {
                        route: '#courses/' + model.get('_id') + '/edit'
                    });
                };*/

                self.remove = function () {
                    var result, callback;
                    callback = function () {
                        view.trigger('navigate', {
                            route: '#index'
                        });
                    };

                    result = model.destroy();

                    if (result) {
                        result.always(callback);
                    } else {
                        callback();
                    }
                };

                self.addInstructor = function () {
                    var alreadyAddedIds = _.pluck(self.actualInstructors(), '_id');
                    view.trigger('modal', {
                        content: _.compact(instructorsCollection.map(function (item) {
                            if (alreadyAddedIds.indexOf(item.get('_id')) === -1) {
                                return {value: item.get('_id'), label: item.get('firstName') + ' ' + item.get('lastName')};
                            }
                        })),
                        type: 'list',
                        title: 'modal.selectInstructors',
                        field: 'courseInstructors',
                        filtering: true
                    });
                };

                self.addUser = function () {
                    var alreadyAddedIds = _.pluck(self._courseUsers(), '_id');
                    view.trigger('modal', {
                        content: _.compact(usersCollection.map(function (item) {
                            if (alreadyAddedIds.indexOf(item.get('_id')) === -1) {
                                return {value: item.get('_id'), label: item.get('firstName') + ' ' + item.get('lastName')};
                            }
                        })),
                        type: 'list',
                        title: 'modal.selectUsers',
                        field: 'courseUsers',
                        filtering: true
                    });
                };

                self.showInstructor = function () {
                    if (this._id) {
                        view.trigger('navigate', {
                            route: '#instructors/' + this._id
                        });
                    }
                };

                self.showUser = function () {
                    if (this._id) {
                        view.trigger('navigate', {
                            route: '#users/' + this._id
                        });
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
            this.$el.html(entryDetailsTemplate);
        },

        bind: function () {
            ko.applyBindings(this.viewModel, this.el);
        },

        onHide: function () {
            ko.cleanNode(this.el);
        }
    });
    return EntryDetailsView;
});
