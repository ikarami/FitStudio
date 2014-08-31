define(['models/baseModel'], function (BaseModel) {

    var InstructorsModel = BaseModel.extend({
        idAttribute: '_id',
        defaults: {
            firstName: '',
            lastName: '',
            email: '',
            phone: null,
            classes: []
        },
        url: function () {
            // PUT for /instructors/:id POST for /instructors/me
            return this.id ? '/instructors/' + this.id : '/instructors/me';
        }
    });

    return InstructorsModel;
});