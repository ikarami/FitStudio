define(['jquery',
    'knockout',
    'kb',
    'collections/courses',
    'collections/instructors',
    'models/course',
    'text!templates/editCourse.html'], function ($, ko, kb, coursesCollection, instructorsCollection, CourseModel, editCourseTemplate) {
    var EditCourseView = Backbone.View.extend({
        el: $('#content'),

        initialize: function (args) {
            var view = this, ViewModel;

            view.on('save', function (args) {
                console.log(args.selected);
                model.set('instructors', _.compact(args.selected.map(function (id) {
                    var model = instructorsCollection.findWhere({_id: id});
                    return _.pick(model.toJSON(), ['_id', 'firstName', 'lastName']);
                })));
            });

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

                self.instructorsList = kb.observable(model, 'instructors');

                /*self.instructors = ko.computed(function () {
                    return self.instructorsList().map(function (instructor) {
                        return instructor.firstName + ' ' + instructor.lastName;
                    });
                });*/
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

                self.editInstructors = function () {
                    view.trigger('modal', {
                        limit: 2,
                        selected: _.compact(self.instructorsList().map(function (item) {return item && item._id; })),
                        content: instructorsCollection.map(function (item) {return {value: item.get('_id'), label: item.get('firstName') + ' ' + item.get('lastName')}; }),
                        type: 'list',
                        title: 'modal.selectInstructors'
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