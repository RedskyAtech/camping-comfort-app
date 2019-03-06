import Vue from 'nativescript-vue'
import * as appSettings from 'tns-core-modules/application-settings';
import Splash from './components/pages/Splash'
import App from './components/pages/App'

// Font Icons
import {TNSFontIcon, fonticon} from 'nativescript-fonticon';
TNSFontIcon.debug = true;
TNSFontIcon.paths = {
    'fa': './assets/vendor/font-awesome/font-awesome.css'
};
TNSFontIcon.loadCss();
Vue.filter('fonticon', fonticon);

// Cards
Vue.registerElement('CardView', () => require('nativescript-cardview').CardView);

// Autocomplete
import RadAutoCompletePlugin from 'nativescript-ui-autocomplete/vue'
Vue.use(RadAutoCompletePlugin);

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

// Skip the splash page if a camping ID has already been stored
if(appSettings.getNumber('campingId') !== undefined){
    new Vue({
        render: h => h('frame', [h(App)])
    }).$start()
}
else {
    new Vue({
        render: h => h('frame', [h(Splash)])
    }).$start()
}