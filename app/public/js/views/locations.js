define(['jquery',
    'underscore',
    'backbone',
    'knockout',
    'kb',
    'collections/locations',
    'text!templates/locations.html'], function ($, _, Backbone, ko, kb, locationsCollection, locationsTemplate) {
    'use strict';

    var LocationsView = Backbone.View.extend({
        el: $('#content'),

        initialize: function () {
            var ViewModel, view = this;

            ViewModel = function () {
                var self = this;
                self.locations = kb.collectionObservable(locationsCollection, {view_model: kb.ViewModel});

                self.addLocation = function () {
                    view.trigger('navigate', {
                        route: '#locations/new'
                    });
                };

                self.goToDashboard = function () {
                    view.trigger('navigate', {
                        route: '#index'
                    });
                };

                self.edit = function () {
                    view.trigger('navigate', {
                        route: '#locations/' + this._id()
                    });
                };

                self.remove = function () {
                    var model = locationsCollection.findWhere({_id: this._id()});
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
            this.$el.html(locationsTemplate);
        },

        bind: function () {
            ko.applyBindings(this.viewModel, this.el);
        },

        onHide: function () {
            ko.cleanNode(this.el);
        }
    });
    return LocationsView;
});