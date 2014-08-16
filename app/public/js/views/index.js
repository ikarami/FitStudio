define(['jquery',
    'ko',
    'text!templates/index.html'], function ($, ko, indexTemplate) {
    var IndexView = Backbone.View.extend({
        el: $('#content'),

        initialize: function () {
            var ViewModel = function () {
                var self = this;
                self.logout = function () {
                    $.get('/account/logout').success(function () {
                        window.location.hash = '#login';
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