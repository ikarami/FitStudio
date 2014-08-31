define(['models/baseModel', 'underscore'], function (BaseModel, _) {
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
            instructors: []
        },

        initialize: function () {
            this.on('instructorSaved', this.saveInstructorHandler);
            this.on('instructorRemoved', this.removeInstructorHandler);
        },

        saveInstructorHandler: function (model) {
            if (_.pluck(this.get('instructors'), ['_id']).indexOf(model.get('_id')) === -1) {
                var instructors = this.get('instructors');
                instructors.push(_.pick(model.toJSON(), ['_id', 'firstName', 'lastName']));
                this.set('instructors', instructors);
                this.save();
            }
        },

        removeInstructorHandler: function (model) {
            var position, instructors = this.get('instructors');
            position = _.indexOf(instructors, _.pick(model, ['_id', 'firstName', 'lastName']));
            if (position !== -1) {
                instructors.splice(position, 1);
                this.set('instructors', instructors);
                this.save();
            }
        },

        url: function () {
            // PUT for /courses/:id POST for /courses/me
            return this.id ? '/courses/' + this.id : '/courses/me';
        }
    });

    return CourseModel;
});