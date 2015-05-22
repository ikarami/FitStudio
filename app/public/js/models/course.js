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
            instructors: [],
            locations: []
        },

        initialize: function () {
            this.on('instructorSaved', this.saveToArray.bind(this, 'instructors'));
            this.on('locationSaved', this.saveToArray.bind(this, 'locations'));
            this.on('userSaved', this.saveToArray.bind(this, 'users'));

            this.on('instructorRemoved', this.removeFromArray.bind(this, 'instructors'));
            this.on('locationRemoved', this.removeFromArray.bind(this, 'locations'));
            this.on('userRemoved', this.removeFromArray.bind(this, 'users'));
        },

        url: function () {
            // PUT for /courses/:id POST for /courses/me
            return this.id ? '/courses/' + this.id : '/courses/me';
        },

        getShortInfo: function () {
            return {
                _id: this.get('_id'),
                name: this.get('name'),
                shortName: this.get('shortName')
            };
        }
    });

    return CourseModel;
});