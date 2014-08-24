define(['jquery',
    'underscore',
    'knockout',
    'kb',
    'collections/instructors',
    'text!templates/instructors.html'], function ($, _, ko, kb, instructorsCollection, instructorsTemplate) {
    var InstructorsView = Backbone.View.extend({
        el: $('#content'),

        initialize: function () {
            var ViewModel, view = this;

            ViewModel = function () {
                var self = this;
                self.instructors = kb.collectionObservable(instructorsCollection, {view_model: kb.ViewModel});

                self.add = function () {
                    view.trigger('navigate', {
                        route: '#instructors/new/edit'
                    });
                };

                self.details = function () {
                    view.trigger('navigate', {
                        route: '#instructors/' + this._id()
                    });
                };

                self.goToDashboard = function () {
                    view.trigger('navigate', {
                        route: '#index'
                    });
                };

                self.edit = function () {
                    view.trigger('navigate', {
                        route: '#instructors/' + this._id() + '/edit'
                    });
                };

                self.remove = function () {
                    var model = instructorsCollection.findWhere({_id: this._id()});
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