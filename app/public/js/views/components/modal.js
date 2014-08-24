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

                self.selected = ko.observableArray([]);
                self.content = ko.observableArray([]);
                self.type = ko.observable('');
                self.limit = ko.observable(0);

                self.controlType = ko.computed(function () {
                    if (self.type() === 'list' && (self.limit() > 1 || self.limit() === 0)) {
                        return 'options';
                    } else if (self.type() === 'list' && self.limit() === 1) {
                        return 'checkboxes';
                    }
                });

                self.saveChanges = function () {
                    console.log('Modal :: saveChanges ' + JSON.stringify(self.selected()));
                    view.trigger('save', {
                        selected: self.selected()
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

            this.checkArgs(args);
            this.viewModel.content(args.content);
            this.viewModel.type(args.type);
            this.viewModel.selected(args.selected);
            this.viewModel.limit(args.limit);

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

        checkArgs: function (args) {
            if (!args.content) {
                args.content = [];
                console.warn('Modal :: missing content');
            }
            if (!args.type) {
                args.type = 'list';
                console.info('Modal :: missing type, assuming list');
            }
            if (!args.selected) {
                args.selected = [];
                console.info('Modal :: missing selected, assuming empty');
            }
            if (!args.limit) {
                args.limit = 0;
                console.info('Modal :: missing limit, assuming no limit');
            }
        },

        onHide: function () {
            ko.cleanNode(this.el);
        }
    });
    return ModalComponentView;
});