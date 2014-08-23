define(['jquery',
    'underscore',
    'ko',
    'text!templates/courses.html'], function ($, _, ko, coursesTemplate) {
    var CoursesView = Backbone.View.extend({
        el: $('#content'),

        initialize: function () {
            var viewModel, view = this;

            ViewModel = function () {
                var self = this;
                self.courses = ko.observableArray();

                self.addCourse = function () {
                    view.trigger('navigate', {
                        route: '#courses/new/edit'
                    });
                };

                self.details = function () {
                    view.trigger('navigate', {
                        route: '#courses/' + this._id,
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
                        route: '#courses/' + this._id + '/edit',
                        model: this
                    });
                };

                self.remove = function () {
                    $.ajax({
                        method: 'DELETE',
                        url: '/courses/'+this._id,
                        success: function () {
                            self.courses.remove(this);
                        }.bind(this)
                    });
                };
            };
            this.viewModel = new ViewModel();
        },

        show: function () {
            this.render();
            this.bind();

            $.get('/courses/').success(function (data) {
                console.log('data arrived');
                _.forEach(data, function (course) {
                    this.viewModel.courses.push(course);
                }, this);
            }.bind(this));
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