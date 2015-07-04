define(['backbone',
        'models/entry',
        'collections/courses',
        'controllers/recur',
        'moment'
], function (Backbone, EntryModel, coursesCollection, recur, moment) {
    'use strict';

    var EntriesCollection = Backbone.Collection.extend({
        model: EntryModel,

        initialize: function (options) {
            options = options || {id: 'me'};

            this.courseId = options.id;

            this.on('add', this.decorateWithCourseInformation);
            coursesCollection.on('change add', this.decorateWithCourseInformation);

            this.decorateWithCourseInformation();
        },

        decorateWithCourseInformation: function () {
            var courseInfo;
            this.toArray().forEach(function (entry) {
                var course = coursesCollection.get(entry.get('courseId'));
                if (course) {
                    courseInfo = {
                        name: course.get('name')
                    };
                } else {
                    courseInfo = {
                        name: ''
                    };
                }
                entry.set('courseInfo', courseInfo);
            });
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

        comparator: function (model) {
            return new Date(model.get('startDate')).getTime();
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
