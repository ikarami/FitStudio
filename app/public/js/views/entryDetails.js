define(['jquery',
    'underscore',
    'backbone',
    'knockout',
    'kb',
    'collections/courses',
    'models/entry',
    'text!templates/entryDetails.html'], function ($, _, Backbone, ko, kb, coursesCollection, EntryModel, entryDetailsTemplate) {
    'use strict';

    var EntryDetailsView = Backbone.View.extend({
        el: $('#content'),

        initialize: function (args) {
            var view = this, ViewModel;

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
                self.courseUsers = kb.observable(courseModel, 'users');

                self.markAsPresent = function (data) {
                    var actualUsers = model.get('actualUsers');
                    actualUsers = actualUsers.slice();
                    actualUsers.push(data);
                    model.set('actualUsers', actualUsers);
                    model.save();
                };

                self.markAsMissed = function (data) {
                    var missedUsers = model.get('missedUsers');
                    missedUsers = missedUsers.slice();
                    missedUsers.push(data);
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
