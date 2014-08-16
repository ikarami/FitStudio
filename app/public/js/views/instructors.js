define(['jquery',
    'underscore',
    'ko',
    'text!templates/instructors.html'], function ($, _, ko, instructorsTemplate) {
    var InstructorsView = Backbone.View.extend({
        el: $('#content'),

        initialize: function () {
            var view = this;
            var ViewModel = function () {
                var self = this;
                self.instructors = ko.observableArray();
                self.add = function () {
                    window.location.hash='#instructors/new';
                };
                self.goToDashboard = function () {
                    window.location.hash='#index';
                };
                self.remove = function () {
                    $.ajax({
                        method: 'DELETE',
                        url: '/instructors/'+this._id,
                        success: function () {
                            self.instructors.remove(this);
                        }.bind(this)
                    });
                };
                self.edit = function () {
                    view.trigger('navigate', {
                        route: '#instructors/' + this._id,
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
                console.log('data arrived');
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