define(['jquery',
    'underscore',
    'backbone',
    'knockout',
    'kb',
    'collections/courses',
    'text!templates/courseDetails.html'], function ($, _, Backbone, ko, kb, coursesCollection, courseDetailsTemplate) {
    'use strict';

    var CourseDetailsView = Backbone.View.extend({
        el: $('#content'),

        initialize: function (args) {
            var view = this, ViewModel;

            ViewModel = function () {
                var self = this, model;

                model = coursesCollection.findWhere({_id: args.id});

                self.name = kb.observable(model, 'name');
                self.shortName = kb.observable(model, 'shortName');
                self.description = kb.observable(model, 'description');
                self.instructors = kb.observable(model, 'instructors');
                self.time = kb.observable(model, 'time');

                self.goToDashboard = function () {
                    view.trigger('navigate', {
                        route: '#index'
                    });
                };

                self.goToList = function () {
                    view.trigger('navigate', {
                        route: '#courses'
                    });
                };

                self.edit = function () {
                    view.trigger('navigate', {
                        route: '#courses/' + model.get('_id') + '/edit'
                    });
                };

                self.remove = function () {
                    var result, callback;
                    callback = function () {
                        view.trigger('navigate', {
                            route: '#courses'
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
            this.$el.html(courseDetailsTemplate);
        },

        bind: function () {
            ko.applyBindings(this.viewModel, this.el);
        },

        onHide: function () {
            ko.cleanNode(this.el);
        }
    });
    return CourseDetailsView;
});