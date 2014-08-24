define(['jquery',
    'underscore',
    'backbone',
    'text!i18n/en.json',
    'text!i18n/pl.json'], function ($, _, Backbone, en, pl) {
    var locale, Locale;

    Locale = function () {
        this._locales = {};

        this.get = function (key) {
            if (this._locales.hasOwnProperty(key)) {
                return this._locales[key];
            } else {
                console.warn('Missing label ' + key + ' for language ' + this._currentLang);
                return key;
            }
        };

        this.setLanguage = function (lang) {
            switch (lang) {
                case 'en':
                    this._locales = JSON.parse(en);
                break;
                case 'pl':
                    this._locales = JSON.parse(pl);
                break;
                default:
                    this._locales = JSON.parse(en);
                    lang = 'en';
            }
            this._currentLang = lang;
            this.trigger('change', this);
        };
    };

    locale = new Locale();
    _.extend(locale, Backbone.Events);
    locale.setLanguage();

    return locale;
});