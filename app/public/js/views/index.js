define(['jquery',
    'backbone',
    'knockout',
    'kb',
    'collections/entries',
    'collections/courses',
    'moment',
    'text!templates/index.html',
    'controllers/session'], function ($, Backbone, ko, kb, EntriesCollection, coursesCollection, moment, indexTemplate, sessionController) {
    'use strict';

    var IndexView = Backbone.View.extend({
        el: $('#content'),

        initialize: function () {
            var view = this,
                entriesCollection = new EntriesCollection();


            var ViewModel = function () {
                var self = this;

                self.shiftWeeksBy = ko.observable(0);

                self.previousWeek = function () {
                    self.shiftWeeksBy(self.shiftWeeksBy()-1);
                    entriesCollection.setDates({
                        startDate: moment().add(self.shiftWeeksBy(), 'weeks').startOf('isoWeek'),
                        endDate: moment().add(self.shiftWeeksBy(), 'weeks').endOf('isoWeek')
                    });
                };

                self.nextWeek = function () {
                    self.shiftWeeksBy(self.shiftWeeksBy()+1);
                    entriesCollection.setDates({
                        startDate: moment().add(self.shiftWeeksBy(), 'weeks').startOf('isoWeek'),
                        endDate: moment().add(self.shiftWeeksBy(), 'weeks').endOf('isoWeek')
                    });
                };

                self.logout = function () {
                    sessionController.logout();
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

                self.entries = kb.collectionObservable(entriesCollection);/*, {filters: function (model) {
                    if (!model) {
                        return false;
                    }
                    var st = new Date(entriesCollection.startDate).getTime();
                    var end = new Date(entriesCollection.endDate).getTime();
                    if (st < new Date(model.get('startDate')).getTime() &&
                        end > new Date(model.get('endDate')).getTime()) {
                        return true;
                    } else {
                        return false;
                    }
                }});*/
            };
            this.viewModel = new ViewModel();

            entriesCollection.setDates({
                startDate: moment().startOf('isoWeek'),
                endDate: moment().endOf('isoWeek')
            });
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
