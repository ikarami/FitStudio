define(['jquery',
    'underscore',
    'backbone',
    'knockout',
    'kb',
    'collections/courses',
    'locale',
    'text!templates/courses.html'], function ($, _, Backbone, ko, kb, coursesCollection, locale, coursesTemplate) {
    'use strict';

    var CoursesView = Backbone.View.extend({
        el: $('#content'),

        initialize: function () {
            var ViewModel, view = this;

            ViewModel = function () {
                var self = this, filterObject, filterOptions;
                self.selectedSortOption = ko.observable();
                self.selectedFilterOptions = ko.observableArray();

                self.courses = kb.collectionObservable(coursesCollection, {view_model: kb.ViewModel, filters: function (model) {
                    if (!self.selectedFilterOptions().length) {
                        return true;
                    }
                    var filterLocationsIds = _.pluck(_.where(self.selectedFilterOptions(), {field: 'locations'}), 'value'),
                        filterInstructorsIds = _.pluck(_.where(self.selectedFilterOptions(), {field: 'instructors'}), 'value'),
                        instructorsResult = _.intersection(_.pluck(model.get('instructors'), '_id'), filterInstructorsIds).length,
                        locationsResult = _.intersection(_.pluck(model.get('locations'), '_id'), filterLocationsIds).length;

                    if (!filterLocationsIds.length) {
                        return instructorsResult;
                    } else if (!filterInstructorsIds.length) {
                        return locationsResult;
                    }
                    return instructorsResult && locationsResult;
                }});

                self.sortOptions = [{
                        field: 'name',
                        displayText: locale.get('common.name')
                    }, {
                        field: 'shortName',
                        displayText: locale.get('common.short')
                    }, {
                        field: 'time',
                        displayText: locale.get('common.time')
                    }, {
                        field: 'users',
                        displayText: locale.get('common.users')
                    }];


                self.removeFiltering = function () {
                    self.selectedFilterOptions([]);
                };

                filterOptions = [];
                coursesCollection.each(function (course) {
                    course.get('instructors').forEach(function (instructor) {
                        filterObject = {
                            field: 'instructors',
                            value: instructor._id,
                            displayText: locale.get('common.instructor') + ': ' + instructor.firstName + ' ' + instructor.lastName
                        };
                        if (!_.contains(_.pluck(filterOptions, 'value'), filterObject.value)) {
                            filterOptions.push(filterObject);
                        }
                    });
                    course.get('locations').forEach(function (location) {
                        filterObject = {
                            field: 'locations',
                            value: location._id,
                            displayText: locale.get('common.location') + ': ' + location.name + ' (' + location.location + ')'
                        };
                        if (!_.contains(_.pluck(filterOptions, 'value'), filterObject.value)) {
                            filterOptions.push(filterObject);
                        }
                    });
                });

                self.filterOptions = ko.observableArray(_.sortBy(filterOptions, 'displayText'));

                // todo: check if unsubscribing is needed
                self.selectedSortOption.subscribe(function (value) {
                    self.courses.sortAttribute(value.field);
                });

                self.selectedSortOption(self.sortOptions[0]);

                self.addCourse = function () {
                    view.trigger('navigate', {
                        route: '#courses/new/edit'
                    });
                };

                self.details = function () {
                    view.trigger('navigate', {
                        route: '#courses/' + this._id(),
                        model: this
                    });
                };

                self.goToDashboard = function () {
                    view.trigger('navigate', {
                        route: '#index'
                    });
                };

                self.edit = function () {
                    view.trigger('navigate', {
                        route: '#courses/' + this._id() + '/edit'
                    });
                };

                self.remove = function () {
                    var model = coursesCollection.findWhere({_id: this._id()});
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
            this.$el.html(coursesTemplate);
        },

        bind: function () {
            ko.applyBindings(this.viewModel, this.el);
        },

        onHide: function () {
            ko.cleanNode(this.el);
        }
    });
    return CoursesView;
});