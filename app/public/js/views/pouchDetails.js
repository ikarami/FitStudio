define(['jquery',
    'underscore',
    'knockout',
    'kb',
    'collections/pouches',
    'text!templates/pouchDetails.html'], function ($, _, ko, kb, pouchesCollection, pouchDetailsTemplate) {
    var PouchDetailsView = Backbone.View.extend({
        el: $('#content'),

        initialize: function (args) {
            var view = this;

            var ViewModel = function () {
                var self = this, model;

                model = pouchesCollection.findWhere({_id: args.id});

                self.name = kb.observable(model, 'name');
                self.created = new Date(model.get('created'));
                self.lastUpdated = new Date(model.get('lastUpdated'));
                self.balance = kb.observable(model, 'balance');
                self.owner = kb.observable(model, 'owner');
                self.operations = ko.observableArray(model.get('operations'));


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
                    $.post('/pouches/' + args.id + '/operations/', {
                        operation: {who: self.who(), amount: self.amount(), comment: self.comment()}
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
                        route: '#pouches/' + model.get('_id') + '/edit'
                    });
                };

                self.remove = function () {
                    var result, callback;
                    result = model.destroy();

                    if (result) {
                        result.always(self.goToList);
                    } else {
                        self.goToList();
                    }
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