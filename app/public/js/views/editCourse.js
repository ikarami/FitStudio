define(['jquery',
    'underscore',
    'backbone',
    'knockout',
    'kb',
    'collections/courses',
    'collections/instructors',
    'collections/locations',
    'models/course',
    'text!templates/editCourse.html'], function ($, _, Backbone, ko, kb, coursesCollection, instructorsCollection, locationsCollection, CourseModel, editCourseTemplate) {
    'use strict';

    var EditCourseView = Backbone.View.extend({
        el: $('#content'),

        initialize: function (args) {
            var view = this, ViewModel;

            view.on('save', function (args) {
                console.log(args.selected);
                if (args.field === 'instructors') {
                    view.viewModel.instructorsList(_.compact(args.selected.map(function (id) {
                        var model = instructorsCollection.findWhere({_id: id});
                        if (model) {
                            return _.pick(model.toJSON(), ['_id', 'firstName', 'lastName']);
                        }
                    })));
                } else {
                    view.viewModel.locationsList(_.compact(args.selected.map(function (id) {
                        var model = locationsCollection.findWhere({_id: id});
                        if (model) {
                            return model.getShortInfo();
                        }
                    })));
                }
            });

            ViewModel = function () {
                var self = this, model;

                self.addMode = (args.id === 'new') ? true : false;

                if (self.addMode) {
                    model = new CourseModel();
                } else {
                    model = coursesCollection.findWhere({_id: args.id});
                    model.commit();
                }
                self.model = model;

                self.regularName = kb.observable(model, 'name');
                self.shortName = kb.observable(model, 'shortName');
                self.description = kb.observable(model, 'description');

                self.instructorsList = kb.observable(model, 'instructors');
                self.locationsList = kb.observable(model, 'locations');

                self.time = kb.observable(model, 'time');

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
                        route: '#courses'
                    });
                };

                self.add = function () {
                    coursesCollection.add(model);
                    model.commit();
                    model.save({}, {wait: true});
                    self.goToList({clean: false});
                };

                self.save = function () {
                    model.save(model.commit());
                    self.goToList({clean: false});
                };

                self.editInstructors = function () {
                    view.trigger('modal', {
                        limit: 2,
                        selected: _.compact(self.instructorsList().map(function (item) {return item && item._id; })),
                        content: instructorsCollection.map(function (item) {return {value: item.get('_id'), label: item.get('firstName') + ' ' + item.get('lastName')}; }),
                        type: 'list',
                        title: 'modal.selectInstructors',
                        field: 'instructors'
                    });
                };

                self.editLocations = function () {
                    view.trigger('modal', {
                        selected: _.compact(self.locationsList().map(function (item) {return item && item._id; })),
                        content: locationsCollection.map(function (item) {return {value: item.get('_id'), label: item.get('name') + ' (' + item.get('location') + ')'}; }),
                        type: 'list',
                        title: 'modal.selectLocations',
                        field: 'locations'
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
            this.$el.html(editCourseTemplate);
        },

        bind: function () {
            ko.applyBindings(this.viewModel, this.el);
        },

        onHide: function () {
            ko.cleanNode(this.el);
            this.off('save');
        }
    });
    return EditCourseView;
});