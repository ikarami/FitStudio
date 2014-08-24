define(['jquery',
    'underscore',
    'knockout',
    'text!templates/locations.html'], function ($, _, ko, locationsTemplate) {
    var LocationsView = Backbone.View.extend({
        el: $('#content'),

        initialize: function () {
            var viewModel, view = this;

            ViewModel = function () {
                var self = this;
                self.locations = ko.observableArray();

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
                        route: '#locations/' + this._id,
                        model: this
                    });
                };

                self.remove = function () {
                    $.ajax({
                        method: 'DELETE',
                        url: '/locations/'+this._id,
                        success: function () {
                            self.locations.remove(this);
                        }.bind(this)
                    });
                };
            };
            this.viewModel = new ViewModel();
        },

        show: function () {
            this.render();
            this.bind();

            $.get('/locations/').success(function (data) {
                console.log('data arrived');
                _.forEach(data, function (location) {
                    this.viewModel.locations.push(location);
                }, this);
            }.bind(this));
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