define(['models/baseModel'], function (BaseModel) {
    'use strict';

    var CourseModel = BaseModel.extend({
        idAttribute: '_id',
        defaults: {
            name: '',
            shortName: '',
            description: '',
            time: '',
            startDate: -1,
            endData: -1,
            occurences: [],
            users: [],
            instructors: []
        },

        url: function () {
            // PUT for /courses/:id POST for /courses/me
            return this.id ? '/courses/' + this.id : '/courses/me';
        }
    });

    return CourseModel;
});