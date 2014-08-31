define(['jquery',
    'underscore',
    'backbone',
    'knockout',
    'kb',
    'collections/pouches',
    'text!templates/pouches.html'], function ($, _, Backbone, ko, kb, pouchesCollection, pouchesTemplate) {
    'use strict';

    var PouchesView = Backbone.View.extend({
        el: $('#content'),



// !!!!!!!!!!! http://documentation.mailgun.com/
// email as a service!!!
// https://www.appfog.com/product/
// https://dashboard.nexmo.com/register
// for smses worldwide :)

// http://www.appdynamics.com/pricing/
// for monitoring

// AN IDEA: simple uptime monitoring tools!!!

        initialize: function () {
            var ViewModel, view = this;

            ViewModel = function () {
                var self = this;
                self.pouches = kb.collectionObservable(pouchesCollection, {view_model: kb.ViewModel});

                self.addPouch = function () {
                    view.trigger('navigate', {
                        route: '#pouches/new/edit'
                    });
                };

                self.goToDashboard = function () {
                    view.trigger('navigate', {
                        route: '#index'
                    });
                };

                self.details = function () {
                    view.trigger('navigate', {
                        route: '#pouches/' + this._id()
                    });
                };

                self.edit = function () {
                    view.trigger('navigate', {
                        route: '#pouches/' + this._id() + '/edit'
                    });
                };

                self.remove = function () {
                    var model = pouchesCollection.findWhere({_id: this._id()});
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
            this.$el.html(pouchesTemplate);
        },

        bind: function () {
            ko.applyBindings(this.viewModel, this.el);
        },

        onHide: function () {
            ko.cleanNode(this.el);
        }
    });
    return PouchesView;
});