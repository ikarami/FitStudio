define(['jquery',
    'underscore',
    'ko',
    'locale',
    'text!templates/components/modal.html'], function ($, _, ko, locale, modalTemplate) {
    var ModalComponentView = Backbone.View.extend({
        el: $('#modal'),

        initialize: function () {
            var viewModel, view = this;

            ViewModel = function () {
                var self = this;
                self.goToDashboard = function () {
                    view.trigger('navigate', {
                        route: '#index'
                    });
                };
                self.title = ko.observable();
            };
            this.viewModel = new ViewModel();
        },

        show: function (args) {
            if (!this.hasBeenRenderedAndBinded) {
                this.hasBeenRenderedAndBinded = true;
                this.render();
                this.bind();
                this.$el.children().first().modal();
            }

            if (args.title) {
                this.viewModel.title(locale.get(args.title));
            }

            this.$el.children().first().modal('show');
        },

        render: function() {
            this.$el.html(modalTemplate);
        },

        bind: function () {
            ko.applyBindings(this.viewModel, this.el);
        },

        onHide: function () {
            ko.cleanNode(this.el);
        }
    });
    return ModalComponentView;
});