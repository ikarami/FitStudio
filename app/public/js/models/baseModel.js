define(['backbone', 'underscore'], function (Backbone, _) {
    'use strict';

    var Model = Backbone.Model.extend({
        initialize: function () {
            this.set('previousState', {}, {silent: true});
            this.set('dirty', false, {silent: true});

            this.on('change', this.changeHandler);
        },

        changeHandler: function (model) {
            if (_.without(_.keys(model.changedAttributes()), 'dirty', 'previousState').length > 0) {
                this.set('dirty', true, {silent: true});
            }
        },

        commit: function () {
            var fields = _.omit(this.toJSON(), ['previousState', 'dirty']);

            this.set('previousState', fields, {silent: true});
            this.set('dirty', false, {silent: true});
        },

        revert: function () {
            var fields, changedFields;

            fields = this.get('previousState');
            changedFields = _.omit(this.changedAttributes(), 'previousState', 'dirty');

            _.each(changedFields, function (value, key) {
                console.log(key, fields[key]);
                this.set(fields, fields[key]);
            }, this);
            this.set('dirty', false, {silent: true});
        },

        isDirty: function () {
            return this.get('dirty') ? true : false;
        }
    });

    return Model;
});