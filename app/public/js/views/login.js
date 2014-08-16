define(['jquery', 'text!templates/login.html'], function ($, loginTemplate) {
    var LoginView = Backbone.View.extend({
        el: $('#content'),
        events: {
            "submit form": "login"
        },
        render: function() {
            this.$el.html(loginTemplate);
        },
        login: function () {
            $.post('/account/login', {
                email: $('input[name=email]').val(),
                password: $('input[name=password]').val()
            }, function () {
                window.location.hash = '#index';
            }).error(function () {
                $('.error').text('Unable to login.').slideDown();
            });
            return false;
        }
    });
    return LoginView;
});