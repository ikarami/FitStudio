define(['jquery', 'text!templates/register.html'], function ($, registerTemplate) {
    var RegisterView = Backbone.View.extend({
        el: $('#content'),
        events: {
            "submit form": "register"
        },
        render: function() {
            this.$el.html(registerTemplate);
        },
        register: function () {
            $.post('/account/register', {
                firstName: $('input[name=firstName]').val(),
                lastName: $('input[name=lastName]').val(),
                email: $('input[name=email]').val(),
                password: $('input[name=password]').val()
            }, function (data) {
                window.location.hash='#login';
            });
            return false;
        }
    });
    return RegisterView;
});