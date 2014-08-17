define(['jquery',
    'ko',
    'text!templates/editLocation.html'], function ($, ko, editLocationTemplate) {
    var EditLocationView = Backbone.View.extend({
        el: $('#content'),

        initialize: function (args) {
            var view = this;
            if (!args.data) {
                args.data = {};
            }

            var ViewModel = function () {
                var self = this, _id;

                self.addMode = (args.id === 'new') ? true : false;
                self.name = ko.observable(args.data.name);
                self.description = ko.observable(args.data.description);
                self.location = ko.observable(args.data.location);
                self.address = ko.observable(args.data.address);
                self.street = ko.observable(args.data.street);
                self.city = ko.observable(args.data.city);
                self.code = ko.observable(args.data.code);
                _id = args.data._id;

                self.goToList = function () {
                    view.trigger('navigate', {
                        route: '#locations'
                    });
                };

                self.add = function (event) {
                    $.post('/locations/me', {
                        name: self.name(),
                        description: self.description(),
                        location: self.location(),
                        address: self.address(),
                        street: self.street(),
                        city: self.city(),
                        code: self.code()
                    }, function () {
                        view.trigger('navigate', {
                            route: '#locations'
                        });
                    });
                };

                self.save = function (event) {
                    $.ajax('/locations/' + _id, {
                        method: 'PUT',
                        data: {
                            name: self.name(),
                            description: self.description(),
                            location: self.location(),
                            address: self.address(),
                            street: self.street(),
                            city: self.city(),
                            code: self.code()
                        },
                        success: function () {
                            view.trigger('navigate', {
                                route: '#locations'
                            });
                        }
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