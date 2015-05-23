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
                var self = this;
                self.courses = kb.collectionObservable(coursesCollection, {view_model: kb.ViewModel});

                self.sortOptions = [{
                        field: 'name',
                        displayText: locale.get('common.name')
                    }, {
                        field: 'shortName',
                        displayText: locale.get('common.short')
                    }];

                self.selectedSortOption = ko.observable();

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