define(['models/baseModel'], function (BaseModel) {

    var UserModel = BaseModel.extend({
        idAttribute: '_id',
        defaults: {
            firstName: '',
            lastName: '',
            email: '',
            phone: null,
            classes: []
        },
        url: function () {
            // PUT for /users/:id POST for /users/me
            return this.id ? '/users/' + this.id : '/users/me';
        }
    });

    return UserModel;
});