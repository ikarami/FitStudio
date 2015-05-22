define(['models/baseModel'], function (BaseModel) {
    'use strict';

    var InstructorsModel = BaseModel.extend({
        idAttribute: '_id',
        defaults: {
            firstName: '',
            lastName: '',
            email: '',
            phone: null,
            classes: []
        },

        initialize: function () {
            this.on('courseSaved', this.saveToArray.bind(this, 'classes'));
            this.on('courseRemoved', this.removeFromArray.bind(this, 'classes'));
        },

        url: function () {
            // PUT for /instructors/:id POST for /instructors/me
            return this.id ? '/instructors/' + this.id : '/instructors/me';
        },

        getShortInfo: function () {
            return {
                _id: this.get('_id'),
                firstName: this.get('firstName'),
                lastName: this.get('lastName')
            };
        }
    });

    return InstructorsModel;
});