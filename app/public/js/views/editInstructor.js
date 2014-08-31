define(['jquery',
    'underscore',
    'backbone',
    'knockout',
    'kb',
    'collections/courses',
    'collections/instructors',
    'models/instructor',
    'text!templates/editInstructor.html'], function ($,
        _,
        Backbone,
        ko,
        kb,
        coursesCollection,
        instructorsCollection,
        InstructorModel,
        editInstructorTemplate) {
    'use strict';

    var EditInstructorView = Backbone.View.extend({
        el: $('#content'),

        initialize: function (args) {
            var view = this, ViewModel;

            view.on('save', function (args) {
                console.log(args.selected);
                view.viewModel.classesList(_.compact(args.selected.map(function (id) {
                    var model = coursesCollection.findWhere({_id: id});
                    if (model) {
                        return _.pick(model.toJSON(), ['_id', 'name', 'shortName']);
                    }
                })));
            });

            ViewModel = function () {
                var self = this, model;

                self.addMode = (args.id === 'new') ? true : false;

                if (self.addMode) {
                    model = new InstructorModel();
                } else {
                    model = instructorsCollection.findWhere({_id: args.id});
                    model.commit();
                }

                self.firstName = kb.observable(model, 'firstName');
                self.lastName = kb.observable(model, 'lastName');
                self.email = kb.observable(model, 'email');
                self.phone = kb.observable(model, 'phone');

                self.classesList = kb.observable(model, 'classes');

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
                        route: '#instructors'
                    });
                };

                self.add = function (event) {
                    instructorsCollection.add(model);
                    model.commit();
                    model.save();
                    self.goToList({clean: false});
                };

                self.save = function (event) {
                    model.commit();
                    model.save();
                    self.goToList({clean: false});
                };

                self.editCourses = function () {
                    view.trigger('modal', {
                        selected: _.compact(self.classesList().map(function (item) {return item && item._id; })),
                        content: coursesCollection.map(function (item) {return {value: item.get('_id'), label: item.get('name') + ' (' + item.get('shortName') + ')'}; }),
                        type: 'list',
                        title: 'modal.selectCourses'
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
            this.$el.html(editInstructorTemplate);
        },

        bind: function () {
            ko.applyBindings(this.viewModel, this.el);
        },

        onHide: function () {
            ko.cleanNode(this.el);
        }
    });
    return EditInstructorView;
});