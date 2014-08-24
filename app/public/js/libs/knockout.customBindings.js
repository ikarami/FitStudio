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
            var result, value, html, lang;

            lang = 'en';

            value = valueAccessor();
            if (typeof value === 'object') {
                html = value.html;
                value = value.key;
            }

            var language = ko.observable(lang);

            result = ko.computed(function () {
                var translation = '';
                if (language() === lang) {
                    if (en[value]) {
                        translation = en[value];
                    } else {
                        console.warn('Missing label ' + value + ' for language + ' + language());
                        translation = value;
                    }
                } else {
                    console.error('Multi not supported yet');
                }
                return translation;
            });
            if (html){
                ko.bindingHandlers.html.update(element, result);
            } else {
                ko.bindingHandlers.text.update(element, result);
            }
        }
    };

    ko.bindingHandlers.placeholder = {
        update: function (element, valueAccessor) {
            var result, value, html, lang;
            value = valueAccessor();
            lang = 'en';

            var language = ko.observable(lang);

            result = ko.computed(function () {
                var translation = '';
                if (language() === lang) {
                    if (en[value]) {
                        translation = en[value];
                    } else {
                        console.warn('Missing label ' + value + ' for language + ' + language());
                        translation = value;
                    }
                } else {
                    console.error('Multi not supported yet');
                }
                return {placeholder: translation};
            });
            ko.bindingHandlers.attr.update(element, result);
        }
    };

    ko.virtualElements.allowedBindings.translate = true;
});