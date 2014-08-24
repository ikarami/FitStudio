define(['backbone'], function (Backbone) {

    var LocationModel = Backbone.Model.extend({
        idAttribute: '_id',
        defaults: {
            name: '',
            description: '',
            location: '',
            address: '',
            street: '',
            city: '',
            code: ''
        },
        url: function () {
            // PUT for /users/:id POST for /users/me
            return this.id ? '/locations/' + this.id : '/locations/me';
        }
    });

    return LocationModel;
});