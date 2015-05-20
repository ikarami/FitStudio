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
            instructors: [],
            locations: []
        },

        initialize: function () {
            this.on('instructorSaved', this.saveInstructorHandler);
            this.on('instructorRemoved', this.removeInstructorHandler);
            this.on('locationRemoved', this.locationRemovedHandler);
            this.on('locationSaved', this.locationSavedHandler);
        },

        saveInstructorHandler: function (model) {
            if (_.pluck(this.get('instructors'), ['_id']).indexOf(model.get('_id')) === -1) {
                var instructors = this.get('instructors');
                instructors.push(model.getShortInfo());
                console.log('adding instructor to classes', model.getShortInfo());
                this.set('instructors', instructors);
                this.save();
            }
        },

        removeInstructorHandler: function (model) {
            var i, shortInfo, position, instructors = this.get('instructors');
            shortInfo = model.getShortInfo();

            for (i = 0; i < instructors.length; ++i) {
                if (_.isEqual(instructors[i], shortInfo)) {
                    position = i;
                    break;
                }
            }
            if (position !== undefined) {
                console.log('removing instructor from classes', model.getShortInfo());
                instructors.splice(position, 1);
                this.set('instructors', instructors);
                this.save();
            }
        },

        locationSavedHandler: function (model) {
            var position, locations;
            position = _.pluck(this.get('locations'), ['_id']).indexOf(model.get('_id'));

            if (position !== -1) {
                locations = this.get('locations');
                console.log('CourseModel :: saving location ', model.getShortInfo());
                locations[position] = model.getShortInfo();
                this.set('locations', locations);
                this.save();
            }
        },

        locationRemovedHandler: function (model) {
            var i, shortInfo, position, locations = this.get('locations');
            shortInfo = model.getShortInfo();

            for (i = 0; i < locations.length; ++i) {
                if (_.isEqual(locations[i], shortInfo)) {
                    position = i;
                    break;
                }
            }
            if (position !== undefined) {
                console.log('CourseModel :: removing location', model.getShortInfo());
                locations.splice(position, 1);
                this.set('locations', locations);
                this.save();
            }
        },

        url: function () {
            // PUT for /courses/:id POST for /courses/me
            return this.id ? '/courses/' + this.id : '/courses/me';
        },

        getShortInfo: function () {
            return {
                _id: this.get('_id'),
                name: this.get('name'),
                shortName: this.get('shortName')
            };
        }
    });

    return CourseModel;
});