define(['jquery', 'text!templates/forgotPassword.html'], function ($, forgotPasswordTemplate) {
    var ForgotPasswordView = Backbone.View.extend({
        el: $('#content'),
        events: {
            "submit form": "resetPassword"
        },
        render: function() {
            this.$el.html(forgotPasswordTemplate);
        },
        resetPassword: function () {
            $.post('/account/forgotPassword', {
                email: $('input[name=email]').val()
            }, function () {
                //window.location.hash = '#index';
            });
            return false;
        }
    });
    return ForgotPasswordView;
});