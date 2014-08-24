define(['jquery', 'ko', 'text!templates/login.html'], function ($, ko, loginTemplate) {
    var LoginView = Backbone.View.extend({
        el: $('#content'),

        initialize: function () {
            var ViewModel, view = this;

            ViewModel = function () {
                var self = this;
                self.email = ko.observable();
                self.password = ko.observable();

                self.validationFailed = ko.observable(false);

                self.login = function () {
                    $.post('/account/login', {
                        email: self.email(),
                        password: self.password()
                    }, function () {
                        view.trigger('loggedIn');
                        self.validationFailed(false);
                    }).error(function () {
                        self.validationFailed(true);
                    });
                    self.password('');
                };
            };
            this.viewModel = new ViewModel();
        },

        show: function () {
            this.render();
            this.bind();
        },

        render: function() {
            this.$el.html(loginTemplate);
        },

        bind: function () {
            ko.applyBindings(this.viewModel, this.el);
        },

        onHide: function () {
            ko.cleanNode(this.el);
        }
    });
    return LoginView;
});