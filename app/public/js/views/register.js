define(['jquery', 'knockout', 'text!templates/register.html'], function ($, ko, registerTemplate) {
    var RegisterView = Backbone.View.extend({
        el: $('#content'),

        initialize: function () {
            var ViewModel, view = this;

            ViewModel = function () {
                var self = this;
                self.firstName = ko.observable();
                self.lastName = ko.observable();
                self.email = ko.observable();
                self.cemail = ko.observable();
                self.password = ko.observable();
                self.cpassword = ko.observable();

                self.validationFailed = ko.observable(false);
                self.errorMessage = ko.observable();

                self.register = function () {
                    var errorMessage = '';
                    if (self.password() !== self.cpassword()) {
                        errorMessage = 'Passwords do not match.';
                    }
                    if (self.email() !== self.cemail()) {
                        if (errorMessage.length) {
                            errorMessage += '<br/>';
                        }
                        errorMessage += 'E-mails do not match.';
                    }

                    if (errorMessage) {
                        self.validationFailed(true);
                        self.errorMessage(errorMessage);
                    } else {
                        self.validationFailed(false);

                        $.post('/account/register', {
                            firstName: self.firstName(),
                            lastName: self.lastName(),
                            email: self.email(),
                            password: self.password()
                        }, function (data) {
                            view.trigger('navigate', {
                                route: '#login'
                            });
                        });
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
            this.$el.html(registerTemplate);
        },

        bind: function () {
            ko.applyBindings(this.viewModel, this.el);
        },

        onHide: function () {
            ko.cleanNode(this.el);
        }
    });
    return RegisterView;
});