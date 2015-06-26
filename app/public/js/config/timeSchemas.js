define([], function () {
    'use strict';

    return [{
        enabled: true,
        name: 'daysAWeek',
        descriptionKey: 'timeSchema.numberOfDaysAWeek',
        parameters: [{
            name: 'Monday',
            optional: true,
            inputType: 'checkbox'
        }, {
            name: 'Tuesday',
            optional: true,
            inputType: 'checkbox'
        }, {
            name: 'Wednesday',
            optional: true,
            inputType: 'checkbox'
        }, {
            name: 'Thursday',
            optional: true,
            inputType: 'checkbox'
        }, {
            name: 'Friday',
            optional: true,
            inputType: 'checkbox'
        }, {
            name: 'Saturday',
            optional: true,
            inputType: 'checkbox'
        }, {
            name: 'Sunday',
            optional: true,
            inputType: 'checkbox'
        }, {
            name: 'startDate',
            optional: false,
            inputType: 'date'
        }, {
            name: 'endDate',
            optional: false,
            inputType: 'date'
        }]
    }, {
        enabled: false,
        name: 'oncePerWeek',
        descriptionKey: 'timeSchema.oncePerWeek',
        parameters: [{
            name: 'startDate',
            optional: false,
            inputType: 'date'
        }, {
            name: 'endDate',
            optional: false,
            inputType: 'date'
        }],
        generateDates: function (parameters) {
            console.log('timeSchemas :: generateDates', parameters);
        }
    }, {
        enabled: false,
        name: 'twiceAWeek',
        descriptionKey: 'timeSchema.twiceAWeek',
        parameters: [{
            name: 'startDate',
            optional: false,
            inputType: 'date'
        }, {
            name: 'endDate',
            optional: false,
            inputType: 'date'
        }, {
            name: 'dayOfWeek',
            optional: false,
            inputType: 'select'
        }, {
            name: 'dayOfWeek',
            optional: false,
            inputType: 'select'
        }],
        generateDates: function (parameters) {
            console.log('timeSchemas :: generateDates', parameters);
        }
    }, {
        enabled: false,
        name: 'threeTimesAWeek',
        descriptionKey: 'timeSchema.threeTimesAWeek',
        parameters: [{
            name: 'startDate',
            optional: false,
            inputType: 'date'
        }, {
            name: 'endDate',
            optional: false,
            inputType: 'date'
        }, {
            name: 'dayOfWeek',
            optional: false,
            inputType: 'select'
        }, {
            name: 'dayOfWeek',
            optional: false,
            inputType: 'select'
        }, {
            name: 'dayOfWeek',
            optional: false,
            inputType: 'select'
        }],
        generateDates: function (parameters) {
            console.log('timeSchemas :: generateDates', parameters);
        }
    }, {
        enabled: false,
        name: 'singleEvent',
        descriptionKey: 'timeSchema.singleEvent',
        parameters: [{
            name: 'startingDate',
            optional: false,
            inputType: 'date'
        }],
        generateDates: function (parameters) {
            console.log('timeSchemas :: generateDates', parameters);
        }
    }, {
        enabled: false,
        name: 'oncePerMonthOnADay',
        descriptionKey: 'timeSchema.oncePerMonthOnADay',
        parameters: [{
            name: 'startingDate',
            optional: false,
            inputType: 'date'
        }],
        generateDates: function (parameters) {
            console.log('timeSchemas :: generateDates', parameters);
        }
    }, {
        enabled: false,
        name: 'oncePerMonthOnADate',
        descriptionKey: 'timeSchema.oncePerMonthOnADate',
        parameters: [{
            name: 'dayOfWeek',
            optional: false,
            inputType: 'date'
        }],
        generateDates: function (parameters) {
            console.log('timeSchemas :: generateDates', parameters);
        }
    }];
});
