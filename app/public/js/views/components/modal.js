define(['jquery',
    'underscore',
    'backbone',
    'knockout',
    'locale',
    'text!templates/components/modal.html'], function ($, _, Backbone, ko, locale, modalTemplate) {
    'use strict';

    var ModalComponentView = Backbone.View.extend({
        el: $('#modal'),

        initialize: function () {
            var ViewModel, view = this;

            ViewModel = function () {
                var self = this;

                self.selected = ko.observableArray([]);
                self.content = ko.observableArray([]);
                self.type = ko.observable('');
                self.limit = ko.observable(0);

                self.withinLimit = ko.computed(function () {
                    var limit = self.limit();
                    if (limit > 0 && self.selected().length > limit) {
                        return false;
                    }
                    return true;
                });

                self.controlType = ko.computed(function () {
                    if (self.type() === 'list' && (self.limit() > 1 || self.limit() === 0)) {
                        return 'checkboxes';
                    } else if (self.type() === 'list' && self.limit() === 1) {
                        return 'options';
                    }
                });

                self.saveChanges = function () {
                    console.log('Modal :: saveChanges ' + JSON.stringify(self.selected()));
                    view.trigger('save', {
                        selected: self.selected(),
                        field: view.currentField
                    });
                    view.$el.children().first().modal('hide');
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

            if (args.field) {
                this.currentField = args.field;
            } else {
                this.currentField = null;
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