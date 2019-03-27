import Vue from 'nativescript-vue'
import Splash from './components/pages/Splash'
import App from './components/pages/App'
import * as appSettings from 'tns-core-modules/application-settings';
import { isAndroid, isIOS, device } from "tns-core-modules/platform";

// Font Icons
import {TNSFontIcon, fonticon} from 'nativescript-fonticon';
TNSFontIcon.debug = true;
TNSFontIcon.paths = {
    'fa': './assets/vendor/font-awesome/font-awesome.css'
};
TNSFontIcon.loadCss();
Vue.filter('fonticon', fonticon);

// Image Zoom
Vue.registerElement('ImageSwipe', () => require('nativescript-image-swipe').ImageSwipe);

// Card View
Vue.registerElement('CardView', () => require('nativescript-cardview').CardView);

// Gradient
Vue.registerElement('gradient', () => require('nativescript-gradient').Gradient);

// Moment
Vue.use(require('vue-moment'));

// Localize
import VueI18n from 'vue-i18n'
Vue.use(VueI18n);

// Translations
import { translations } from './translations';
let t = translations();
const i18n = new VueI18n({
    locale: getLanguage(t),
    messages: t
});

// Autocomplete
import RadAutoCompletePlugin from 'nativescript-ui-autocomplete/vue'
Vue.use(RadAutoCompletePlugin);

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

// Skip the splash page if a camping ID has already been stored
if(appSettings.getNumber('campingId') !== undefined){
    new Vue({
        i18n,
        render: h => h('frame', [h(App)])
    }).$start()
}
else {
    new Vue({
        i18n,
        render: h => h('frame', [h(Splash)])
    }).$start()
}

/**
 * Get the app language
 *
 * @param translations
 * @returns {*}
 */
function getLanguage(translations){
    let language;

    // Language has been stored before
    if(appSettings.hasKey("language")) {
        language = appSettings.getString('language');
    }

    // Get the system language
    else {
        let locale;
        if (isAndroid) {
            locale = java.util.Locale.getDefault().getLanguage();
        }
        if (isIOS) {
            locale = NSLocale.preferredLanguages.firstObject;
        } else {
            locale = device.language;
        }

        // Strip the optional region part of the locale
        language = locale.substring(0, 2).toLowerCase();

        // Set the fallback language
        let fallbackLanguage = 'en';

        // Get the allowed languages from the translation file
        let allowedLanguages = [];
        Object.keys(translations).forEach(function(key,index) {
            allowedLanguages.push(key);
        });

        // Check to see if the system language is allowed, otherwise set the fallback language
        function inArray(needle, haystack) {
            let length = haystack.length;
            for(let i = 0; i < length; i++) {
                if(haystack[i] === needle) return true;
            }
            return false;
        }
        if (!inArray(language, allowedLanguages)) {
            language = fallbackLanguage;
        }

        // Store the language
        appSettings.setString('language', language);
    }
    return language;
}