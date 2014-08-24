define(['jquery',
    'knockout',
    'text!templates/editInstructor.html'], function ($, ko, editInstructorTemplate) {
    var EditInstructorView = Backbone.View.extend({
        el: $('#content'),

        initialize: function (args) {
            if (!args.data) {
                args.data = {};
            }

            var ViewModel = function () {
                var self = this, _id;

                self.addMode = (args.id === 'new') ? true : false;
                self.firstName = ko.observable(args.data.firstName);
                self.lastName = ko.observable(args.data.lastName);
                self.email = ko.observable(args.data.email);
                self.phone = ko.observable(args.data.phone);
                self.classes = ko.observable(args.data.classes ? args.data.classes.join(', ') : '');
                _id = args.data._id;

                self.goToList = function () {
                    window.location.hash='#instructors';
                };

                self.add = function (event) {
                    $.post('/instructors/me', {
                        firstName:  self.firstName(),
                        lastName:  self.lastName(),
                        email:  self.email(),
                        phone:  self.phone(),
                        classes:  self.classes().split(',')
                    }, function () {
                        window.location.hash='#instructors';
                    });
                };

                self.save = function (event) {
                    $.ajax('/instructors/' + _id, {
                        method: 'PUT',
                        data: {
                            firstName:  self.firstName(),
                            lastName:  self.lastName(),
                            email:  self.email(),
                            phone:  self.phone(),
                            classes:  self.classes().split(',').map(function (item) {
                                return item.trim();
                            })
                        },
                        success: function () {
                            window.location.hash='#instructors';
                        }
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
            this.$el.html(editInstructorTemplate);
        },

        bind: function () {
            ko.applyBindings(this.viewModel, this.el);
        },

        onHide: function () {
            ko.cleanNode(this.el);
        }
    });
    return EditInstructorView;
});