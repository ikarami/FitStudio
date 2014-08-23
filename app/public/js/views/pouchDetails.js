define(['jquery',
    'underscore',
    'ko',
    'text!templates/pouchDetails.html'], function ($, _, ko, pouchDetailsTemplate) {
    var PouchDetailsView = Backbone.View.extend({
        el: $('#content'),

        initialize: function (args) {
            var view = this;
            if (!args.data) {
                args.data = {};
            }

            var ViewModel = function () {
                var self = this, _id;

                self.name = ko.observable(args.data.name);
                self.created = new Date(args.data.created);
                self.lastUpdated = new Date(args.data.lastUpdated);
                self.balance = ko.observable(args.data.balance);
                self.owner = ko.observable(args.data.owner);
                self.operations = ko.observableArray(args.data.operations);
                _id = args.data._id;

                self.who = ko.observable('Me');
                self.comment = ko.observable('');
                self.amount = ko.observable(0);

                self.goToDashboard = function () {
                    view.trigger('navigate', {
                        route: '#index'
                    });
                };

                self.goToList = function () {
                    view.trigger('navigate', {
                        route: '#pouches'
                    });
                };

                self.addOperation = function () {
                    $.post('/pouches/' + _id + '/operations/', {
                        operation: {who: self.who(), amount: self.amount()}
                    });
                    self.operations.push({
                        who: self.who(),
                        amount: self.amount(),
                        comment: self.comment()
                    });
                    self.balance(self.balance() + Number(self.amount()));
                    self.amount(0);
                    self.comment('');
                    // TODO: date is not updated
                    self.lastUpdated = new Date();
                };

                self.edit = function () {
                    view.trigger('navigate', {
                        route: '#pouches/' + _id + '/edit',
                        model: {
                            _id: _id,
                            name: self.name(),
                            created: self.created.getTime(),
                            lastUpdated: self.lastUpdated.getTime(),
                            balance: self.balance(),
                            owner: self.owner(),
                            operations: self.operations()
                        }
                    });
                };

                self.remove = function () {
                    $.ajax({
                        method: 'DELETE',
                        url: '/pouches/' + _id,
                        success: function () {
                            view.trigger('navigate', {
                                route: '#pouches'
                            });
                        }.bind(this)
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
            this.$el.html(pouchDetailsTemplate);
        },

        bind: function () {
            ko.applyBindings(this.viewModel, this.el);
        },

        onHide: function () {
            ko.cleanNode(this.el);
        }
    });
    return PouchDetailsView;
});