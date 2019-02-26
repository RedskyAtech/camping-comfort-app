import Vue from 'nativescript-vue'
import Home from './components/pages/Home'

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

// Global components
import Menu from './components/elements/Menu'
import Hamburger from './components/elements/Hamburger'
Vue.component('menu', Menu);
Vue.component('hamburger', Hamburger);

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

new Vue({
  render: h => h('frame', [h(Home)])
}).$start()
