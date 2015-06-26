define(['moment', 'moment-recur'], function (moment) {
    'use strict';
    console.log('https://github.com/c-trimm/moment-recur/releases', moment);
    var createRule, getDate;

    getDate = function (parameters, date) {
        var returnValue;
        parameters.forEach(function (p) {
            if (p.name === date) {
                returnValue = p.value();
            }
        });
        return returnValue;
    };

    createRule = function (parameters) {
        var days = [],
            recurrence;

        recurrence = moment.recur({
            start: getDate(parameters, 'startDate'),
            end: getDate(parameters, 'endDate')
        });

        parameters.forEach(function (p) {
            debugger;
            if (p.name === 'dayOfWeek') {
                days.push(p.value().value + 1);
            } else if (p.inputType === 'checkbox' && p.value()) {
                days.push(p.name);
            }
        });

        return recurrence.every(days).daysOfWeek();
    };


    return {
        createRule: createRule
    }
});
