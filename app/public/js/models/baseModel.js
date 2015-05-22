define(['backbone', 'underscore'], function (Backbone, _) {
    'use strict';

    var Model = Backbone.Model.extend({
        initialize: function () {
            this.set('previousState', {}, {silent: true});
            this.set('dirty', false, {silent: true});

            this.on('change', this.changeHandler);
        },

        blacklist: ['previousState', 'dirty'],

        toJSON: function() {
            return _.omit(this.attributes, this.blacklist);
        },

        save: function (previousState, options) {
            console.log('save previousState ', previousState);
            if (previousState) {
                if (this.isNew()) {
                    this.once('sync', function () {
                        this.trigger('save', this, previousState);
                    }, this);
                } else {
                    this.trigger('save', this, previousState);
                }
            }
            Backbone.Model.prototype.save.call(this, options);
        },

        changeHandler: function (model) {
            if (_.without(_.keys(model.changedAttributes()), 'dirty', 'previousState').length > 0) {
                this.set('dirty', true, {silent: true});
            }
        },

        commit: function () {
            var fields, previousState;
            previousState = this.get('previousState');
            fields = _.omit(this.toJSON(), ['previousState', 'dirty']);

            this.set('previousState', fields, {silent: true});
            this.set('dirty', false, {silent: true});
            return previousState;
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
        },

        saveToArray: function (arrayName, model) {
            var data = this.get(arrayName),
                position = _.pluck(data, ['_id']).indexOf(model.get('_id'));

            if (position === -1) {
                data.push(model.getShortInfo());
            } else {
                data.splice(position, 1, model.getShortInfo());
            }
            this.set(arrayName, data);
            this.save();
        },

        removeFromArray: function (arrayName, model) {
            var data = this.get(arrayName),
                position = _.pluck(data, ['_id']).indexOf(model.get('_id'));

            if (position !== -1) {
                data.splice(position, 1);
                this.set(arrayName, data);
                this.save();
            }
        }
    });

    return Model;
});