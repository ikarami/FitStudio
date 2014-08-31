define(['models/baseModel', 'underscore'], function (BaseModel, _) {
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
            this.on('courseSaved', this.saveCourseHandler);
            this.on('courseRemoved', this.removeCourseHandler);
        },

        saveCourseHandler: function (model) {
            if (_.pluck(this.get('classes'), ['_id']).indexOf(model.get('_id')) === -1) {
                var classes = this.get('classes');
                classes.push(_.pick(model.toJSON(), ['_id', 'name', 'shortName']));
                this.set('classes', classes);
                this.save();
            }
        },

        removeCourseHandler: function (model) {
            var position, classes = this.get('classes');
            position = _.indexOf(classes, _.pick(model, ['_id', 'name', 'shortName']));
            if (position !== -1) {
                classes.splice(position, 1);
                this.set('classes', classes);
                this.save();
            }
        },

        url: function () {
            // PUT for /instructors/:id POST for /instructors/me
            return this.id ? '/instructors/' + this.id : '/instructors/me';
        }
    });

    return InstructorsModel;
});