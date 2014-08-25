define(['backbone'], function (Backbone) {

    var PouchModel = Backbone.Model.extend({
        idAttribute: '_id',
        defaults: {
            name: '',
            created: new Date().getTime(),
            lastUpdated: new Date().getTime(),
            balance: 0,
            owner: '',
            operations: []
        },
        url: function () {
            // PUT for /pouches/:id POST for /pouches/me
            return this.id ? '/pouches/' + this.id : '/pouches/me';
        }
    });

    return PouchModel;
});