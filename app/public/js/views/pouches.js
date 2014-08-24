define(['jquery',
    'underscore',
    'knockout',
    'text!templates/pouches.html'], function ($, _, ko, pouchesTemplate) {
    var PouchesView = Backbone.View.extend({
        el: $('#content'),



// !!!!!!!!!!! http://documentation.mailgun.com/
// email as a service!!!
// https://www.appfog.com/product/
// https://dashboard.nexmo.com/register
// for smses worldwide :)

// http://www.appdynamics.com/pricing/
// for monitoring

// AN IDEA: simple uptime monitoring tools!!!

        initialize: function () {
            var viewModel, view = this;

            ViewModel = function () {
                var self = this;
                self.pouches = ko.observableArray();

//$.post('/pouches/53f1313c4e4866b0186ca943/operations/', {operation: {who: 'ME', amount: 20.2}, amount: 20.2})

                self.addPouch = function () {
                    view.trigger('navigate', {
                        route: '#pouches/new/edit'
                    });
                };

                self.goToDashboard = function () {
                    view.trigger('navigate', {
                        route: '#index'
                    });
                };

                self.details = function () {
                    view.trigger('navigate', {
                        route: '#pouches/' + this._id,
                        model: this
                    });
                };

                self.edit = function () {
                    view.trigger('navigate', {
                        route: '#pouches/' + this._id + '/edit',
                        model: this
                    });
                };

                self.remove = function () {
                    $.ajax({
                        method: 'DELETE',
                        url: '/pouches/'+this._id,
                        success: function () {
                            self.pouches.remove(this);
                        }.bind(this)
                    });
                };
            };
            this.viewModel = new ViewModel();
        },

        show: function () {
            this.render();
            this.bind();

            $.get('/pouches/').success(function (data) {
                console.log('data arrived');
                _.forEach(data, function (pouch) {
                    pouch.created = new Date(pouch.created).toString();
                    pouch.lastUpdated = new Date(pouch.lastUpdated).toString();
                    this.viewModel.pouches.push(pouch);
                }, this);
            }.bind(this));
        },

        render: function() {
            this.$el.html(pouchesTemplate);
        },

        bind: function () {
            ko.applyBindings(this.viewModel, this.el);
        },

        onHide: function () {
            ko.cleanNode(this.el);
        }
    });
    return PouchesView;
});