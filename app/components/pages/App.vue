<template>
    <Page :class="pageClass" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <GridLayout rows="*" columns="*">
            <GridLayout row="0" col="0" rows="*, auto" columns="*">
                <StackLayout row="0" col="0">
                    <Home v-if="activeTab === 1"></Home>
                    <Camping v-if="activeTab === 2"></Camping>
                    <Nearby v-if="activeTab === 3"></Nearby>
                    <Events v-if="activeTab === 4"></Events>
                    <Threads v-if="activeTab === 5"></Threads>
                </StackLayout>
                <StackLayout row="1" col="0" class="tabbar">
                    <GridLayout rows="*" :columns="settings.enable_messaging ? '*,*,*,*,*' : '*,*,*,*'">
                        <StackLayout verticalAlignment="middle" row="0" col="0" class="tab" :class="[{'active': activeTab === 1}]" @tap="activeTab=1">
                            <Label class="tab-icon fas">{{ 'fa-heart' | fonticon }}</Label>
                            <Label class="tab-label" :text="$t('tabs.home')"></Label>
                        </StackLayout>
                        <StackLayout verticalAlignment="middle" row="0" col="1" class="tab" :class="[{'active': activeTab === 2}]" @tap="activeTab=2">
                            <Label class="tab-icon fas">{{ 'fa-map-signs' | fonticon }}</Label>
                            <Label class="tab-label" :text="$t('tabs.camping_'+settings.type)"></Label>
                        </StackLayout>
                        <StackLayout verticalAlignment="middle" row="0" col="2" class="tab" :class="[{'active': activeTab === 3}]" @tap="activeTab=3">
                            <Label class="tab-icon fas">{{ 'fa-landmark' | fonticon }}</Label>
                            <Label class="tab-label" :text="$t('tabs.nearby')"></Label>
                        </StackLayout>
                        <StackLayout verticalAlignment="middle" row="0" col="3" class="tab" :class="[{'active': activeTab === 4}]" @tap="activeTab=4">
                            <Label class="tab-icon fas">{{ 'fa-calendar-alt' | fonticon }}</Label>
                            <Label class="tab-label" :text="$t('tabs.activities')"></Label>
                        </StackLayout>
                        <StackLayout v-if="settings.enable_messaging" verticalAlignment="middle" row="0" col="4" class="tab" :class="[{'active': activeTab === 5}]" @tap="checkIdentification">
                            <Label class="tab-icon fas">{{ 'fa-comments' | fonticon }}</Label>
                            <Label class="tab-label" :text="$t('tabs.reception')"></Label>
                        </StackLayout>
                    </GridLayout>
                </StackLayout>
            </GridLayout>
            <Loader></Loader>
        </GridLayout>
    </Page>
</template>

<script>
    import * as platform from "tns-core-modules/platform";
    import StatusBar from '../mixins/StatusBar'
    import Responsive from '../mixins/Responsive'
    import EventBus from '../helpers/EventBus'
    import Home from '../pages/Home'
    import Camping from '../pages/Camping'
    import Nearby from '../pages/Nearby'
    import Events from '../pages/Events'
    import Threads from '../pages/Threads'
    import Thread from '../modals/Thread'
    import Detail from '../modals/Detail'
    import Map from '../modals/Map'
    import Wifi from '../modals/Wifi'
    import Route from '../modals/Route'
    import GuestIdentification from '../modals/GuestIdentification'
    import LocalStorage from '../mixins/LocalStorage'
    import Loader from '../elements/Loader'
    import Connection from '../mixins/Connection'
    import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http"
    import * as firebase from 'nativescript-plugin-firebase';
    import { isAndroid, isIOS, device, screen } from "tns-core-modules/platform"
    import * as http from 'http'
    import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert"
    import DeepLink from '../mixins/DeepLink'

    export default {
        name: 'App',
        data() {
            return {
                activeTab: null,
                settings: {}
            }
        },
        mixins: [
            Responsive,
            StatusBar,
            LocalStorage,
            Connection,
            DeepLink
        ],
        components: {

            // Pages
            Home: Home,
            Camping: Camping,
            Nearby: Nearby,
            Events: Events,
            Detail: Detail,
            Threads: Threads,
            Thread: Thread,
            Map: Map,
            Wifi: Wifi,
            Route: Route,
            Loader: Loader
        },
        beforeDestroy: function() {

            // Destroy any listeners in the event bus
            console.log('Listeners removed: App');
            EventBus.$off('log');
            EventBus.$off('navigate');
            EventBus.$off('openModal');
            EventBus.$off('back');
            EventBus.$off('toTab5');
        },
        mounted: function(){
            let self = this;

            // Log the app activity
            EventBus.$on('log', function(data) {
                console.log('Listener fired: App->log');
                self.log(data.type, data.data);
            });

            // Listen to navigation requests
            EventBus.$on('navigate', function(data) {
                console.log('Listener fired: App->navigate');
                self.log('navigate', data);
                self.navigate(data.tab, data.page, data.clearHistory, data.props, data.fullFrame);
            });

            // Listen to open-modal requests
            EventBus.$on('openModal', function(data) {
                console.log('Listener fired: App->openModal');
                self.log('navigate', data);
                self.openModal(data.page, data.props);
            });

            // Listen to go back navigation requests
            EventBus.$on('back', function() {
                console.log('Listener fired: App->back');
                self.back();
            });

            // Listen to go back navigation requests
            EventBus.$on('toTab5', function() {
                self.activeTab = 5;
            });

            // Initialize firebase
            self.initializeFirebase();

            // Load the app settings and load the home page in the frame
            self.loadAppSettings();
        },
        methods: {

            checkIdentification: function() {

                // Go to tab 5 if the guest already entered his name or if the current user is a camping
                if(this.keyExistsInStore('guestName') || this.keyExistsInStore('userId')) {
                    this.activeTab = 5;
                }

                // Open the identification modal
                else {
                    this.openModal('guestIdentification');
                }
            },

            /**
             * Load the app settings
             */
            loadAppSettings: function() {
                let self = this;

                // Get the data from the api (internet) or local storage (offline)
                let campingId = this.getNumberFromStore('campingId');
                let lang = this.getStringFromStore('language');
                if(this.hasInternetConnection()){

                    // Set the settings object from storage to prevent flickering
                    if(self.keyExistsInStore('settings')) {
                        self.settings = self.getObjectFromStore('settings');
                    }

                    // Get the live data
                    let loadingId = Date.now();
                    EventBus.$emit('startLoading', loadingId);
                    http.getJSON(self.$apiBaseUrl + "/" + campingId + "/content/" + lang + "?v=" + self.$apiVersion).then(result => {

                        // Assign and store the hero image
                        if(result.appContent){
                            self.settings = result.appContent;
                            self.storeObject('settings', result.appContent);
                        }
                        else {
                            self.settings = {};
                            self.removeKeyFromStore('settings');
                        }

                        // Hide the loader
                        EventBus.$emit('stopLoading', loadingId);

                        // Go to home page
                        self.activeTab = 1;
                    }, error => {
                        self.settings = {};
                        self.removeKeyFromStore('settings');

                        // Hide the loader
                        EventBus.$emit('stopLoading', loadingId);

                        // Show the error
                        setTimeout(function() {
                            TNSFancyAlert.showError(
                                self.$t('errors.other.title'),
                                self.$t('errors.other.message'),
                                self.$t('errors.other.buttonText')
                            ).then(() => {
                                // Close the app
                            });
                        }, 500);
                    });
                }
                else {
                    if(self.keyExistsInStore('settings')) {
                        self.settings = self.getObjectFromStore('settings');

                        // Go to home page
                        setTimeout(function() {
                            self.activeTab = 1;
                        }, 1500); // I don't know what the script is waiting for but for now, this is needed.
                    }
                    else {
                        setTimeout(function() {
                            TNSFancyAlert.showError(
                                self.$t('errors.offline.title'),
                                self.$t('errors.offline.message'),
                                self.$t('errors.offline.buttonText')
                            ).then(() => {
                                // Close the app
                            });
                        }, 500);
                    }
                }
            },

            /**
             * Initialize firebase
             */
            initializeFirebase() {
                let self = this;

                if(!firebase.initialized) {

                    // Initialize Firebase
                    firebase.init({
                        showNotifications: true,
                        showNotificationsWhenInForeground: true,

                        onPushTokenReceivedCallback: function(token) {
                            console.log('[Firebase] onPushTokenReceivedCallback:', { token });
                        },

                        onMessageReceivedCallback: function(message) {
                            console.log('[Firebase] onMessageReceivedCallback:', { message });

                            // Redirect to the App page
                            if(message.data.type === 'news_item') {

                                // Navigate
                                EventBus.$emit('navigate', {
                                    tab: 1,
                                    page: 'detail',
                                    clearHistory: false,
                                    props: {
                                        type: 'news_item',
                                        id: parseFloat(message.data.id)
                                    }
                                });
                            }
                            if(message.data.type === 'message') {

                                console.log('message received');

                                // Emit an event that a new message is received
                                EventBus.$emit('messageReceived');

                                // Open the modal
                                EventBus.$emit('openModal', {
                                    page: 'thread',
                                    props: {
                                        id: parseFloat(message.data.id)
                                    }
                                });
                            }
                        }
                    })
                    .then(() => {
                        console.log('[Firebase] Initialized');

                        // Update the subscription and redirect to the App page
                        self.updateSubscriptions();
                    })
                    .catch(error => {
                        console.log('[Firebase] Initialize', { error });
                    });
                }
                else {

                    // Firebase is already initialized, so manage the subscriptions
                    self.updateSubscriptions();
                }
            },

            // Manage the subscriptions
            updateSubscriptions: function() {
                let self = this;
                self.subscribeToTopic({ type: 'news' });

                if(self.keyExistsInStore('userId')) {
                    self.subscribeToTopic({ type: 'camping_messaging' });
                }
                else {
                    self.subscribeToTopic({ type: 'guest_messaging' });
                }
            },

            /**
             * Subscribe to a topic
             *
             * The "data" parameter is an object and needs at least a "type" key.
             *
             * @param data
             */
            subscribeToTopic: function(data) {
                let self = this;

                let campingId = this.getNumberFromStore('campingId');
                let uuid = device.uuid;
                let lang = self.getStringFromStore('language');
                let topic = '';
                let topicStoreKey = '';
                let unsubscribePrevious = false;

                // Subscribe to camping news
                if(data.type === 'news') {
                    topic = "camping_"+campingId+"_news_"+lang;
                    topicStoreKey = 'news_topic';
                    unsubscribePrevious = true;
                }

                // Subscribe to messages for camping users
                if(data.type === 'camping_messaging') {

                    // Subscribe to the group messaging topic
                    if(self.keyExistsInStore('userGroupId')) {
                        topic = "camping_messaging_"+campingId+"_"+self.getNumberFromStore('userGroupId');
                    }

                    // Subscribe to the general camping messaging topic
                    else {
                        topic = "camping_messaging_"+campingId;
                    }
                    topicStoreKey = 'camping_messaging_topic';
                    unsubscribePrevious = true;
                }

                // Subscribe to messages for guests
                if(data.type === 'guest_messaging') {
                    topic = "guest_messaging_"+uuid;
                    topicStoreKey = 'guest_messaging_topic';
                    unsubscribePrevious = true;
                }

                // Unsubscribe a previous subscription
                if(unsubscribePrevious === true) {
                    if(self.keyExistsInStore(topicStoreKey)) {
                        let oldTopic = self.getStringFromStore(topicStoreKey);
                        firebase.unsubscribeFromTopic(oldTopic).then(function() {
                            console.log("Firebase unsubscribed from topic " + oldTopic);//

                            // Subscribe to a Firebase topic
                            firebase.subscribeToTopic(topic).then(function() {
                                console.log("Firebase subscribed to topic "+topic);

                                // Store the subscription so it can be unsubscribed.
                                if(topicStoreKey !== '') {
                                    self.storeString(topicStoreKey, topic);
                                }
                            });
                        });
                    }
                    else {

                        // Subscribe to a Firebase topic
                        firebase.subscribeToTopic(topic).then(function() {
                            console.log("Firebase subscribed to topic "+topic);

                            // Store the subscription so it can be unsubscribed.
                            if(topicStoreKey !== '') {
                                self.storeString(topicStoreKey, topic);
                            }
                        });
                    }

                    // Only allow one of camping or guest messaging
                    if(topicStoreKey === 'guest_messaging_topic') {
                        let oldTopic = self.getStringFromStore('camping_messaging_topic');
                        if(oldTopic) {
                            firebase.unsubscribeFromTopic(oldTopic).then(function() {
                                console.log("Firebase unsubscribed from topic " + oldTopic);//
                            });
                        }
                    }
                    if(topicStoreKey === 'camping_messaging_topic') {
                        let oldTopic = self.getStringFromStore('guest_messaging_topic');
                        if(oldTopic) {
                            firebase.unsubscribeFromTopic(oldTopic).then(function () {
                                console.log("Firebase unsubscribed from topic " + oldTopic);//
                            });
                        }
                    }
                }
                else {

                    // Subscribe to a Firebase topic
                    firebase.subscribeToTopic(topic).then(function() {
                        console.log("Firebase subscribed to topic "+topic);

                        // Store the subscription so it can be unsubscribed.
                        if(topicStoreKey !== '') {
                            self.storeString(topicStoreKey, topic);
                        }
                    });
                }
            },

            // Log an action
            log: function(type, data) {

                let self = this;

                // Only log with an active internet connection, and not logged in as camping
                if(this.hasInternetConnection() && !this.keyExistsInStore('userId')) {

                    let campingId = this.getNumberFromStore('campingId');
                    if (type === 'navigate') {

                        // Set the props to an empty object
                        if (data.props === undefined) {
                            data.props = {};
                        }

                        // Create the data object
                        let content = JSON.stringify({
                            uuid: platform.device.uuid,
                            name: this.keyExistsInStore('guestName') ? this.getStringFromStore('guestName') : '',
                            location: this.keyExistsInStore('guestLocation') ? this.getStringFromStore('guestLocation') : '',
                            page: data.page,
                            type: data.props.type !== undefined ? data.props.type : '',
                            id: data.props.id !== undefined ? data.props.id : '',
                            v: self.$apiVersion
                        });

                        // Create the request
                        request({
                            url: self.$apiBaseUrl + "/" + campingId + "/log/navigate",
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                            content: content
                        }).then((response) => {
                        }, (e) => {
                        });
                    }
                    if (type === 'like') {

                        // Create the data object
                        let content = JSON.stringify({
                            uuid: platform.device.uuid,
                            name: this.keyExistsInStore('guestName') ? this.getStringFromStore('guestName') : '',
                            location: this.keyExistsInStore('guestLocation') ? this.getStringFromStore('guestLocation') : '',
                            id: data.id,
                            v: self.$apiVersion
                        });

                        // Create the request
                        request({
                            url: self.$apiBaseUrl + "/" + campingId + "/log/like",
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                            content: content
                        }).then((response) => {
                        }, (e) => {
                        });
                    }
                }
            },
            openModal: function(page, props={}){
                let Component;
                if(page === 'guestIdentification'){
                    Component = GuestIdentification;
                }
                if(page === 'detail'){
                    Component = Detail;
                }
                if(page === 'map'){
                    Component = Map;
                }
                if(page === 'wifi'){
                    Component = Wifi;
                }
                if(page === 'route'){
                    Component = Route;
                }
                if(page === 'thread'){
                    Component = Thread;
                }
                this.$showModal(Component, {
                    fullscreen: true,
                    props: props,
                    animated: true
                });
            },
            back: function(){
                this.$navigateBack();
            }
        }
    }
</script>

<style scoped>

    /* Tabbar */
    .tabbar {
        background-color: #ffffff;
        border-top-width: 1;
        border-color: #e5e5e5;
        color: #8f99ac;
        padding: 10 12.5;
    }
    .tab {
        text-align: center;
    }
    .tab.active {
        color: #0070da;
    }
    .tab-icon {
        font-size: 16;
    }
    Page.xxs .tab-label,
    Page.xs .tab-label {
        visibility: collapsed;
    }
    .tab-label {
        font-size: 12;
        padding-top: 3;
    }
</style>