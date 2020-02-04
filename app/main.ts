import Vue from 'nativescript-vue'
import Splash from './components/pages/Splash.vue'
import App from './components/pages/App.vue'
import * as appSettings from 'tns-core-modules/application-settings';
import { isAndroid, isIOS, device } from "tns-core-modules/platform";
import { connectionType, getConnectionType, startMonitoring, stopMonitoring } from 'tns-core-modules/connectivity';
let application = require("tns-core-modules/application");

// Set the current platform
Vue.prototype.$isAndroid = isAndroid;
Vue.prototype.$isIOS = isIOS;

// Font Icons
import {TNSFontIcon, fonticon} from 'nativescript-fonticon';
TNSFontIcon.debug = true;
TNSFontIcon.paths = {
    'fa': './assets/css/all.css'
};
TNSFontIcon.loadCss();
Vue.filter('fonticon', fonticon);//

// Moment
const moment = require('moment');
require('moment/locale/en-gb');
require('moment/locale/nl');
require('moment/locale/fr');
require('moment/locale/de');
require('moment/locale/it');
Vue.use(require('vue-moment'), {
    moment
});

// Localize
import VueI18n from 'vue-i18n'
Vue.use(VueI18n);

// RadListView
import RadListView from 'nativescript-ui-listview/vue';
Vue.use(RadListView);

// Translations
import { translations } from './translations';
let t = translations();
const i18n = new VueI18n({
    locale: getLanguage(t),
    messages: t
});

// Firebase
const firebase = require("nativescript-plugin-firebase");

// Star rating
import StarRating from 'nativescript-vue-star-rating';
Vue.use(StarRating);

// Nativescript Image Swipe
Vue.registerElement("ImageSwipe", () => require("nativescript-image-swipe/image-swipe").ImageSwipe)

// QR scanner
Vue.registerElement('BarcodeScanner', () => require('nativescript-barcodescanner').BarcodeScannerView)

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

// Set the environment mode
Vue.prototype.$mode = TNS_ENV === 'production' ? 'production' : 'development'

// Set the API version to use
Vue.prototype.$apiVersion = 2

// Set the API base URL
Vue.prototype.$apiBaseUrl = TNS_ENV === 'production' ? 'https://www.campingcomfort.app/api' : 'https://www.campingcomfort.app/api'

// Skip the splash page if a camping ID has already been stored
if(appSettings.getNumber('campingId') !== undefined){
    new Vue({
        i18n: i18n,
        render: h => h('frame', [h(App)])
    }).$start()
}
else {
    new Vue({
        i18n: i18n,
        render: h => h('frame', [h(Splash)])
    }).$start()
}

/**
 * In array method
 *
 * @param needle
 * @param haystack
 * @returns {boolean}
 */
function inArray(needle, haystack) {
    let length = haystack.length;
    for(let i = 0; i < length; i++) {
        if(haystack[i] === needle) return true;
    }
    return false;
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
        if (!inArray(language, allowedLanguages)) {
            language = fallbackLanguage;
        }

        // Store the language
        appSettings.setString('language', language);
    }
    return language;
}