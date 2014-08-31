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
                classes.push(model.getShortInfo());
                console.log('adding class to instructor', model.getShortInfo());
                this.set('classes', classes);
                this.save();
            }
        },

        removeCourseHandler: function (model) {
            var i, shortInfo, position, classes = this.get('classes');
            shortInfo = model.getShortInfo();

            for (i = 0; i < classes.length; ++i) {
                if (_.isEqual(classes[i], shortInfo)) {
                    position = i;
                    break;
                }
            }
            if (position !== undefined) {
                console.log('removing class from instructor', model.getShortInfo());
                classes.splice(position, 1);
                this.set('classes', classes);
                this.save();
            }
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