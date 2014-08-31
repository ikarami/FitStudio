define(['jquery',
    'backbone',
    'knockout',
    'text!templates/index.html'], function ($, Backbone, ko, indexTemplate) {
    'use strict';

    var IndexView = Backbone.View.extend({
        el: $('#content'),

        initialize: function () {
            var view = this;
            var ViewModel = function () {
                var self = this;
                self.logout = function () {
                    $.get('/account/logout').always(function () {
                        window.location.hash = '#login';
                    });
                };
                self.modal = function () {
                    view.trigger('modal', {
                        limit: 2,
                        selected: ['1', '3'],
                        content: [{value: 1, label: '1'},{value: 3, label: '3'},{value: 5, label: '5'}],
                        type: 'list',
                        title: 'test.modalTitle'
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
            this.$el.html(indexTemplate);
        },

        bind: function () {
            ko.applyBindings(this.viewModel, this.el);
        },

        onHide: function () {
            ko.cleanNode(this.el);
        }
    });
    return IndexView;
});