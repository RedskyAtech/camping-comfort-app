import Vue from 'nativescript-vue'
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

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

new Vue({
  render: h => h('frame', [h(App)])
}).$start()
