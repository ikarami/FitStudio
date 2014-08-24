define(['ko', 'locale'], function (ko, locale) {
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
            var result, value, html;

            value = ko.unwrap(valueAccessor());
            if (typeof value === 'object') {
                html = value.html;
                value = value.key;
            }

            result = ko.computed(function () {
                return locale.get(value);
            });

            if (html){
                ko.bindingHandlers.html.update(element, result);
            } else {
                ko.bindingHandlers.text.update(element, result);
            }
        }
    };
    ko.virtualElements.allowedBindings.translate = true;

    ko.bindingHandlers.placeholder = {
        update: function (element, valueAccessor) {
            var result, value;
            value = ko.unwrap(valueAccessor());

            result = ko.computed(function () {
                return {placeholder: locale.get(value)};
            });
            ko.bindingHandlers.attr.update(element, result);
        }
    };
});