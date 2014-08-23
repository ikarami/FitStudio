define(['ko', 'json!i18n/en.json'], function (ko, en) {
    ko.bindingHandlers.href = {
        update: function (element, valueAccessor) {
            ko.bindingHandlers.attr.update(element, function () {
                return {href: valueAccessor()};
            });
        }
    };

    ko.bindingHandlers.src = {
        update: function (element, valueAccessor) {
            ko.bindingHandlers.attr.update(element, function () {
                return {src: valueAccessor()};
            });
        }
    };

    ko.bindingHandlers.translate = {
        update: function (element, valueAccessor) {
            var result, value = valueAccessor();

            var language = ko.observable('en');

            result = ko.computed(function () {
                var translation = '';
                if (language() === 'en') {
                    if (en[value]) {
                        translation = en[value];
                    } else {
                        console.warn('Missing label');
                        translation = value;
                    }
                } else {
                    console.error('Multi not supported yet');
                }
                return translation;
            });
            ko.bindingHandlers.text.update(element, result);
        }
    };
});