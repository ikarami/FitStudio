define(['backbone', 'models/entry', 'controllers/recur', 'moment'], function (Backbone, EntryModel, recur, moment) {
    'use strict';

    var EntriesCollection = Backbone.Collection.extend({
        model: EntryModel,

        initialize: function (options) {
            options = options || {id: 'me'};

            this.courseId = options.id;
        },
        url: function () {
            var addParamLinkingChar = function addParamLinkingChar (string) {
                return string.length ? '&' : '?';
            };
            var queryParams = '';

            ['startDate', 'endDate'].forEach(function (param) {
                if (this[param]) {
                    queryParams += addParamLinkingChar(queryParams) + param + '=' + this[param];
                }
            }, this);

            return '/entries/' + this.courseId + queryParams;
        },
        setDates: function (dates) {
            if (dates.startDate) {
                this.startDate = dates.startDate;
            }
            if (dates.endDate) {
                this.endDate = dates.endDate;
            }
            this.fetch();
        },

        validateSchemaParameters: function (parameters) {
            var retValue = true;
            parameters.forEach(function (p) {
                if (p.optional !== true && !p.value()) {
                    retValue = false;
                }
            });
            return retValue;
        },

        generateBasedOn: function (schemaConfig, model) {
            var recurrence, list;
            console.log('EntriesCollection :: generateBasedOn :: ', schemaConfig);

            if (!this.validateSchemaParameters(schemaConfig.parameters)) {
                return false;
            }

            recurrence = recur.createRule(schemaConfig.parameters);

            list = recurrence.all('L');
            console.log(list);

            list.forEach(function (l) {
                this.add({
                    courseId: model.get('_id'),
                    startDate: l + ' ' + model.get('time'),
                    endDate: l + ' ' + moment(model.get('time'), 'H:mm').add(model.get('duration'), 'm').format('H:mm')
                });
            }.bind(this));


        }
    });

    return EntriesCollection;
});
