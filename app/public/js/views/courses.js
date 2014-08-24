define(['jquery',
    'underscore',
    'knockout',
    'kb',
    'collections/courses',
    'text!templates/courses.html'], function ($, _, ko, kb, coursesCollection, coursesTemplate) {
    var CoursesView = Backbone.View.extend({
        el: $('#content'),

        initialize: function () {
            var viewModel, view = this;

            ViewModel = function () {
                var self = this;
                self.courses = kb.collectionObservable(coursesCollection, {view_model: kb.ViewModel});

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