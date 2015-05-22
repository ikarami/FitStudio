require(['underscore',
    'collections/courses',
    'collections/instructors',
    'collections/locations',
    'collections/pouches',
    'collections/users'
    ], function (_, courses, instructors, locations, pouches, users) {
    'use strict';

    var CollectionsController = function () {
        this.collections = {
            courses: courses,
            instructors: instructors,
            locations: locations,
            pouches: pouches,
            users: users,
        };

        this.dependencies = {
            courses: [
                {
                    on: 'save',
                    dependency: 'instructors',
                    triggerOnAll: 'courseRemoved',
                    checkModelField: 'instructors',
                    triggerOnDependent: 'courseSaved'
                }, {
                    on: 'remove',
                    dependency: 'instructors',
                    triggerOnAll: 'courseRemoved'
                }
            ],
            instructors: [
                {
                    on: 'save',
                    dependency: 'courses',
                    triggerOnAll: 'instructorRemoved',
                    checkModelField: 'classes',
                    triggerOnDependent: 'instructorSaved'
                }, {
                    on: 'remove',
                    dependency: 'courses',
                    triggerOnAll: 'instructorRemoved'
                }
            ],
            locations: [
                {
                    on: 'save',
                    dependency: 'courses',
                    triggerOnAll: 'locationSaved'
                }, {
                    on: 'remove',
                    dependency: 'courses',
                    triggerOnAll: 'locationRemoved'
                }
            ],
            users: [
                {
                    on: 'save',
                    dependency: 'courses',
                    triggerOnAll: 'userRemoved',
                    checkModelField: 'classes',
                    triggerOnDependent: 'userSaved'
                }, {
                    on: 'remove',
                    dependency: 'courses',
                    triggerOnAll: 'userRemoved'
                }
            ]
        };

        _.each(this.dependencies, function (dependencies, collectionName) {
            _.each(dependencies, function (depConfig) {
                this.collections[collectionName].on(depConfig.on, function (model, previousValues) {
                    console.log(depConfig.on, model, previousValues);
                    var dependentModel, dependentCollection = this.collections[depConfig.dependency];
                    if (depConfig.triggerOnAll) {
                        dependentCollection.each(function (dependentModel) {
                            dependentModel.trigger(depConfig.triggerOnAll, model);
                        });
                    }
                    if (depConfig.checkModelField) {
                        _.each(model.get(depConfig.checkModelField), function (data) {
                            dependentModel = dependentCollection.findWhere({_id: data._id});
                            if (dependentModel) {
                                dependentModel.trigger(depConfig.triggerOnDependent, model);
                            }
                        }, this);
                    }
                }, this);
            }, this);
        }, this);


/*
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
        });*/
    };

    return new CollectionsController();
});