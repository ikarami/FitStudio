define(['jquery',
    'underscore',
    'knockout',
    'text!templates/instructors.html'], function ($, _, ko, instructorsTemplate) {
    var InstructorsView = Backbone.View.extend({
        el: $('#content'),

        initialize: function () {
            var ViewModel, view = this;

            ViewModel = function () {
                var self = this;
                self.instructors = ko.observableArray();

                self.add = function () {
                    view.trigger('navigate', {
                        route: '#instructors/new/edit'
                    });
                };

                self.details = function () {
                    view.trigger('navigate', {
                        route: '#instructors/' + this._id,
                        model: this
                    });
                };

                self.goToDashboard = function () {
                    view.trigger('navigate', {
                        route: '#index'
                    });
                };

                self.remove = function () {
                    $.ajax({
                        method: 'DELETE',
                        url: '/instructors/' + this._id,
                        success: function () {
                            self.instructors.remove(this);
                        }.bind(this)
                    });
                };

                self.edit = function () {
                    view.trigger('navigate', {
                        route: '#instructors/' + this._id + '/edit',
                        model: this
                    });
                };
            };
            this.viewModel = new ViewModel();
        },

        show: function () {
            this.render();
            this.bind();

            $.get('/instructors/').success(function (data) {
                console.log('instructors data arrived');
                _.forEach(data, function (course) {
                    this.viewModel.instructors.push(course);
                }, this);
            }.bind(this));
        },

        render: function() {
            this.$el.html(instructorsTemplate);
        },

        bind: function () {
            ko.applyBindings(this.viewModel, this.el);
        },

        onHide: function () {
            ko.cleanNode(this.el);
        }
    });
    return InstructorsView;
});