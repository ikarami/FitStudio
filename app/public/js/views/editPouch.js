define(['jquery',
    'ko',
    'text!templates/editPouches.html'], function ($, ko, editPouchesTemplate) {
    var EditPouchesView = Backbone.View.extend({
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
                self.created = new Date(args.data.created);
                self.lastUpdated = new Date(args.data.lastUpdated);
                self.balance = ko.observable(args.data.balance);
                self.owner = ko.observable(args.data.owner);
                self.operations = ko.observableArray(args.data.operations);
                _id = args.data._id;

                self.goToList = function () {
                    view.trigger('navigate', {
                        route: '#pouches'
                    });
                };

                self.add = function (event) {
                    $.post('/pouches/me', {
                        name: self.name(),
                        owner: self.owner(),
                        balance: self.balance(),
                        operations: self.operations()
                    }, function () {
                        view.trigger('navigate', {
                            route: '#pouches'
                        });
                    });
                };

                self.save = function (event) {
                    $.ajax('/pouches/' + _id, {
                        method: 'PUT',
                        data: {
                            name: self.name(),
                            owner: self.owner(),
                            balance: self.balance(),
                            operations: self.operations()
                        },
                        success: function () {
                            view.trigger('navigate', {
                                route: '#pouches'
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
            this.$el.html(editPouchesTemplate);
        },

        bind: function () {
            ko.applyBindings(this.viewModel, this.el);
        },

        onHide: function () {
            ko.cleanNode(this.el);
        }
    });
    return EditPouchesView;
});