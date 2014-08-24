define(['jquery',
    'knockout',
    'kb',
    'collections/locations',
    'models/location',
    'text!templates/editLocation.html'], function ($, ko, kb, locationsCollection, LocationModel, editLocationTemplate) {
    var EditLocationView = Backbone.View.extend({
        el: $('#content'),

        initialize: function (args) {
            var view = this;

            var ViewModel = function () {
                var self = this, model;

                self.addMode = (args.id === 'new') ? true : false;

                if (self.addMode) {
                    model = new LocationModel();
                } else {
                    model = locationsCollection.findWhere({_id: args.id});
                }

                self.name = kb.observable(model, 'name');
                self.description = kb.observable(model, 'description');
                self.location = kb.observable(model, 'location');
                self.address = kb.observable(model, 'address');
                self.street = kb.observable(model, 'street');
                self.city = kb.observable(model, 'city');
                self.code = kb.observable(model, 'code');

                self.goToList = function () {
                    view.trigger('navigate', {
                        route: '#locations'
                    });
                };

                self.add = function (event) {
                    locationsCollection.add(model);
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
            this.$el.html(editLocationTemplate);
        },

        bind: function () {
            ko.applyBindings(this.viewModel, this.el);
        },

        onHide: function () {
            ko.cleanNode(this.el);
        }
    });
    return EditLocationView;
});