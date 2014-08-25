define(['jquery',
    'knockout',
    'kb',
    'collections/pouches',
    'models/pouch',
    'text!templates/editPouches.html'], function ($, ko, kb, pouchesCollection, PouchModel, editPouchesTemplate) {
    var EditPouchesView = Backbone.View.extend({
        el: $('#content'),

        initialize: function (args) {
            var view = this, ViewModel;

            ViewModel = function () {
                var self = this, model;

                self.addMode = (args.id === 'new') ? true : false;

                if (self.addMode) {
                    model = new PouchModel();
                } else {
                    model = pouchesCollection.findWhere({_id: args.id});
                }

                self.name = kb.observable(model, 'name');
                self.created = new Date(model.get('created'));
                self.lastUpdated = new Date(model.get('lastUpdated'));
                self.balance = kb.observable(model, 'balance');
                self.owner = kb.observable(model, 'owner');
                self.operations = kb.observable(model, 'operations');

                self.goToList = function () {
                    view.trigger('navigate', {
                        route: '#pouches'
                    });
                };

                self.add = function (event) {
                    pouchesCollection.add(model);
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