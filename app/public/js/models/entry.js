define(['underscore', 'models/baseModel'], function (_, BaseModel) {
    'use strict';

    var EntryModel = BaseModel.extend({
        idAttribute: '_id',
        defaults: {
            accountId: '',
            courseId: '',
            startDate: null,
            endDate: null,
            comments: '',
            missedUsers: [],
            actualUsers: [],
            actualInstructors: []
        },
        /* TODO: why it does not work?
        addTo: function (field, object) {
            var fieldData = this.get(field);
            fieldData = fieldData.slice();
            fieldData.push(object);
            this.set(field, fieldData);
            this.save(this.commit());
        },

        removeFrom: function (field, object) {
            var fieldData = this.get(field);
            fieldData = _.without(fieldData, object);
            this.set('fieldData', fieldData);
            this.save(this.commit());
        },*/

        blacklist: ['previousState', 'dirty', 'courseInfo'],

        url: function () {
            // PUT for /entries/:courseId/:_id POST for /entries/:courseId/me
            return '/entries/' + this.get('courseId') + '/' + (this.get('id') ? this.get('id') : 'me');
        }
    });

    return EntryModel;
});
