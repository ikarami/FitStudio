define(['jquery', 'knockout', 'text!templates/forgotPassword.html'], function ($, ko, forgotPasswordTemplate) {
    var ForgotPasswordView = Backbone.View.extend({
        el: $('#content'),

        initialize: function () {
            var ViewModel, view = this;

            ViewModel = function () {
                var self = this;
                self.email = ko.observable();
                self.hasBeenSent = ko.observable(false);

                self.reset = function () {
                    $.post('/account/forgotPassword', {
                        email: self.email()
                    }, function () {
                        self.hasBeenSent(true);
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
            this.$el.html(forgotPasswordTemplate);
        },

        bind: function () {
            ko.applyBindings(this.viewModel, this.el);
        },

        onHide: function () {
            ko.cleanNode(this.el);
        }

    });
    return ForgotPasswordView;
});