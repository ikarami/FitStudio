define(['knockout',
    'underscore',
    'locale',
    'text!templates/components/timeSchemaParameters.html'
    ], function (ko,
        _,
        locale,
        timeSchemaParametersTemplate) {
    'use strict';

    ko.components.register('timeSchemaParameters', {
        viewModel: function (params) {
            this.parameters = ko.observable();

            this.weekDays = locale.get('common.weekDays')
                                .split(',')
                                .map(function (day, index) {
                                    return {
                                        value: index,
                                        displayText: day
                                    };
                                });

            params.config.subscribe(function (config) {
                this.parameters(config.parameters.map(function (param) {
                    return _.extend(param, {value: ko.observable()});
                }));

                _.each(_.pluck(this.parameters(), 'value'), function (o) {
                    o.subscribe(function (v) {
                        console.log(v);
                    });
                });

            }.bind(this));
        },
        template: timeSchemaParametersTemplate
    });
});