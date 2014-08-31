require(['underscore',
    'collections/courses',
    'collections/instructors',
    'collections/locations',
    'collections/pouches',
    'collections/users'
    ], function (_, courses, instructors, locations, pouches, users) {
    'use strict';

    var CollectionsController = function () {
        // unusued variables
        this.locations = locations;
        this.pouches = pouches;
        this.users = users;

        // courses collection update:
        // - instructors
        courses.on('save', function (model) {
            console.log('Course is added, will update instructors', model);
            var instructor;

            instructors.each(function (instructor) {
                instructor.trigger('courseRemoved', model.toJSON());
            });

            _.each(model.get('instructors'), function (data) {
                instructor = instructors.findWhere({_id: data._id});
                if (instructor) {
                    instructor.trigger('courseSaved', model);
                }
            }, this);
        });

        courses.on('remove', function (model) {
            console.log('A course is removed, will update instructors', model);
            instructors.each(function (instructor) {
                instructor.trigger('courseRemoved', model.toJSON());
            });
        });

        // instructors collection update:
        // - courses
        instructors.on('save', function (model) {
            console.log('Instructor is added or updated, will update courses', model);
            var course;

            courses.each(function (course) {
                course.trigger('instructorRemoved', model.toJSON());
            });

            _.each(model.get('classes'), function (data) {
                course = courses.findWhere({_id: data._id});
                if (course) {
                    course.trigger('instructorSaved', model);
                }
            }, this);
        });

        instructors.on('remove', function (model) {
            console.log('An instructor is removed, will update courses', model);
            courses.each(function (course) {
                course.trigger('instructorRemoved', model.toJSON());
            });
        });
    };

    return new CollectionsController();
});