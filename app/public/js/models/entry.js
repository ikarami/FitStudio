define(['models/baseModel'], function (BaseModel) {
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

        blacklist: ['previousState', 'dirty', 'courseInfo'],

        url: function () {
            // PUT for /entries/:courseId/:_id POST for /entries/:courseId/me
            return '/entries/' + this.get('courseId') + '/' + (this.id ? this.get('courseId') : 'me');
        }
    });

    return EntryModel;
});
