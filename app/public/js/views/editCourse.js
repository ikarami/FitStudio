define(['jquery',
    'underscore',
    'backbone',
    'knockout',
    'kb',
    'config/timeSchemas',
    'locale',
    'collections/courses',
    'collections/instructors',
    'collections/locations',
    'collections/entries',
    'models/course',
    'text!templates/editCourse.html',
    'timepicker'], function ($, _, Backbone, ko, kb, timeSchemas, locale, coursesCollection, instructorsCollection, locationsCollection, Entries, CourseModel, editCourseTemplate) {
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
                var self = this, model, entriesCollection;

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
                self.duration = kb.observable(model, 'duration');

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

                    model.once('save', function saveOccurences(model) {
                        console.log('editCourse :: add :: saveOccurences');
                        entriesCollection.each(function (entry) {
                            entry.set('courseId', model.get('_id'));
                        });
                        entriesCollection.invoke('commit');
                        console.log(entriesCollection.toJSON());
                        entriesCollection.invoke('save');
                    });

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

                entriesCollection = new Entries();
                self.entriesList = kb.collectionObservable(entriesCollection, {view_model: kb.ViewModel});

                self.addOccurence = function () {
                    entriesCollection.add({});
                };
                self.removeOccurence = function () {
                    entriesCollection.remove(this.model());
                };

                self.selectedSchemaConfig = ko.observable();
                self.selectedSchema = ko.observable();
                self.timeSchemas = _.without(timeSchemas.map(function (schema) {
                    if (schema.enabled === true) {
                        return {
                            name: schema.name,
                            displayText: locale.get(schema.descriptionKey)
                        };
                    }
                }), undefined);

                self.selectedSchema.subscribe(function (schema) {
                    self.selectedSchemaConfig(
                        _.findWhere(timeSchemas, {name: schema.name})
                    );
                });

                self.generateOccurences = function () {
                    console.log('generateOccurences');

                    entriesCollection.generateBasedOn(self.selectedSchemaConfig(), self.model);

                    self.selectedSchemaConfig().parameters.forEach(function (p) {
                        console.log(p.value());
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

            _.each(this.$('[type="time"]'), function (element) {
                $(element).timepicker({show2400: true, timeFormat: 'H:i'});
            });
        },

        onHide: function () {
            ko.cleanNode(this.el);
            this.off('save');
        }
    });
    return EditCourseView;
});
