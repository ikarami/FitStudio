define(['jquery',
    'underscore',
    'ko',
    'text!templates/pouches.html'], function ($, _, ko, pouchesTemplate) {
    var PouchesView = Backbone.View.extend({
        el: $('#content'),

        initialize: function () {
            var viewModel, view = this;

            ViewModel = function () {
                var self = this;
                self.pouches = ko.observableArray();

                self.addPouch = function () {
                    view.trigger('navigate', {
                        route: '#pouches/new'
                    });
                };

                self.goToDashboard = function () {
                    view.trigger('navigate', {
                        route: '#index'
                    });
                };

                self.edit = function () {
                    view.trigger('navigate', {
                        route: '#pouches/' + this._id,
                        model: this
                    });
                };

                self.remove = function () {
                    $.ajax({
                        method: 'DELETE',
                        url: '/pouches/'+this._id,
                        success: function () {
                            self.pouches.remove(this);
                        }.bind(this)
                    });
                };
            };
            this.viewModel = new ViewModel();
        },

        show: function () {
            this.render();
            this.bind();

            $.get('/pouches/').success(function (data) {
                console.log('data arrived');
                _.forEach(data, function (pouch) {
                    pouch.created = new Date(pouch.created).toString();
                    pouch.lastUpdated = new Date(pouch.lastUpdated).toString();
                    this.viewModel.pouches.push(pouch);
                }, this);
            }.bind(this));
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