define(['jquery',
    'knockout',
    'kb',
    'collections/courses',
    'models/course',
    'text!templates/editCourse.html'], function ($, ko, kb, coursesCollection, CourseModel, editCourseTemplate) {
    var EditCourseView = Backbone.View.extend({
        el: $('#content'),

        initialize: function (args) {
            var view = this, ViewModel;

            ViewModel = function () {
                var self = this;

                self.addMode = (args.id === 'new') ? true : false;

                if (self.addMode) {
                    model = new CourseModel();
                } else {
                    model = coursesCollection.findWhere({_id: args.id});
                }

                self.regularName = kb.observable(model, 'name');
                self.shortName = kb.observable(model, 'shortName');
                self.description = kb.observable(model, 'description');
                self.instructors = kb.observable(model, 'instructors');
                self.time = kb.observable(model, 'time');

                self.goToList = function () {
                    view.trigger('navigate', {
                        route: '#courses'
                    });
                };

                self.add = function (event) {
                    coursesCollection.add(model);
                    model.save();
                    self.goToList();
                };

                self.save = function (event) {
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
            this.$el.html(editCourseTemplate);
        },

        bind: function () {
            ko.applyBindings(this.viewModel, this.el);
        },

        onHide: function () {
            ko.cleanNode(this.el);
        }
    });
    return EditCourseView;
});