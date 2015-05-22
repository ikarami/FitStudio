define(['models/baseModel'], function (BaseModel) {
    'use strict';

    var UserModel = BaseModel.extend({
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
            // PUT for /users/:id POST for /users/me
            return this.id ? '/users/' + this.id : '/users/me';
        },

        getShortInfo: function () {
            return {
                _id: this.get('_id'),
                firstName: this.get('firstName'),
                lastName: this.get('lastName')
            };
        }
    });

    return UserModel;
});