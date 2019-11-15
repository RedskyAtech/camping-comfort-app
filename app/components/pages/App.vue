<template>
    <Page :class="pageClass" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <GridLayout rows="*" columns="*">
            <GridLayout row="0" col="0" rows="*, auto" columns="*">
                <StackLayout row="0" col="0">
                    <Frame id="mainContent">
                        <Home/>
                    </Frame>
                </StackLayout>
                <StackLayout row="1" col="0" class="tabbar" v-if="!hideTabs">
                    <GridLayout rows="*" columns="*,*,*,*,*">
                        <StackLayout verticalAlignment="middle" row="0" col="0" class="tab" :class="[{'active': activeTab === 1}]" @tap="toHome">
                            <Label class="tab-icon fas">{{ 'fa-heart' | fonticon }}</Label>
                            <Label class="tab-label" :text="$t('tabs.home')"></Label>
                        </StackLayout>
                        <StackLayout verticalAlignment="middle" row="0" col="1" class="tab" :class="[{'active': activeTab === 2}]" @tap="toCamping">
                            <Label class="tab-icon fas">{{ 'fa-campground' | fonticon }}</Label>
                            <Label class="tab-label" :text="$t('tabs.camping')"></Label>
                        </StackLayout>
                        <StackLayout verticalAlignment="middle" row="0" col="2" class="tab" :class="[{'active': activeTab === 3}]" @tap="toNearby">
                            <Label class="tab-icon fas">{{ 'fa-map-signs' | fonticon }}</Label>
                            <Label class="tab-label" :text="$t('tabs.nearby')"></Label>
                        </StackLayout>
                        <StackLayout verticalAlignment="middle" row="0" col="3" class="tab" :class="[{'active': activeTab === 4}]" @tap="toEvents">
                            <Label class="tab-icon fas">{{ 'fa-calendar-alt' | fonticon }}</Label>
                            <Label class="tab-label" :text="$t('tabs.activities')"></Label>
                        </StackLayout>
                        <StackLayout verticalAlignment="middle" row="0" col="4" class="tab" :class="[{'active': activeTab === 5}]" @tap="toReception">
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
    import Splash from '../pages/Splash'
    import Home from '../pages/Home'
    import Camping from '../pages/Camping'
    import Nearby from '../pages/Nearby'
    import Events from '../pages/Events'
    import Detail from '../pages/Detail'
    import Threads from '../pages/Threads'
    import Thread from '../pages/Thread'
    import Shop from '../pages/Shop'
    import MapModal from '../elements/MapModal'
    import WifiModal from '../elements/WifiModal'
    import RouteModal from '../elements/RouteModal'
    import LocalStorage from '../mixins/LocalStorage'
    import Loader from '../elements/Loader'
    import Connection from '../mixins/Connection'
    import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http"
    import * as firebase from 'nativescript-plugin-firebase';
    import { isAndroid, isIOS, device, screen } from "tns-core-modules/platform";

    export default {
        data() {
            return {
                activeTab: 1,
                hideTabs: false
            }
        },
        mixins: [
            Responsive,
            StatusBar,
            LocalStorage,
            Connection
        ],
        components: {

            // Pages
            Splash: Splash,
            Home: Home,
            Camping: Camping,
            Nearby: Nearby,
            Events: Events,
            Detail: Detail,
            Threads: Threads,
            Thread: Thread,
            MapModal: MapModal,
            WifiModal: WifiModal,
            RouteModal: RouteModal,
            Loader: Loader
        },
        beforeDestroy: function() {

            // Destroy any listeners in the event bus
            console.log('Listeners removed: App');
            EventBus.$off('log');
            EventBus.$off('navigate');
            EventBus.$off('openModal');
            EventBus.$off('back');

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

            // Initialize firebase
            firebase.init({
                showNotifications: true,
                showNotificationsWhenInForeground: false,

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
                self.subscribeToTopic({ type: 'news' });

                if(self.keyExistsInStore('userId')) {
                    self.subscribeToTopic({ type: 'camping_messaging' });
                }
                else {
                    self.subscribeToTopic({ type: 'guest_messaging' });
                }
            })
            .catch(error => {
                console.log('[Firebase] Initialize', { error });
            });
        },
        methods: {

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
                    topic = "camping_messaging_"+campingId;
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
            log: function(type, data) {
                if(this.hasInternetConnection()) {

                    let campingId = this.getNumberFromStore('campingId');
                    if (type === 'navigate') {

                        // Set the props to an empty object
                        if (data.props === undefined) {
                            data.props = {};
                        }

                        // Create the data object
                        let content = JSON.stringify({
                            uuid: platform.device.uuid,
                            page: data.page,
                            type: data.props.type !== undefined ? data.props.type : '',
                            id: data.props.id !== undefined ? data.props.id : ''
                        });

                        // Create the request
                        request({
                            url: "https://www.campingcomfort.app/api/" + campingId + "/log/navigate",
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
                            id: data.id
                        });

                        // Create the request
                        request({
                            url: "https://www.campingcomfort.app/api/" + campingId + "/log/like",
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                            content: content
                        }).then((response) => {
                        }, (e) => {
                        });
                    }
                }
            },
            navigate: function(tab, page, clearHistory=false, props={}, fullFrame=false){

                // Set the right tab
                this.activeTab = tab;

                // Navigate to the page
                let Component;
                if(page === 'splash'){
                    Component = Splash;
                }
                if(page === 'home'){
                    Component = Home;
                }
                if(page === 'camping'){
                    Component = Camping;
                }
                if(page === 'nearby'){
                    Component = Nearby;
                }
                if(page === 'events'){
                    Component = Events;
                }
                if(page === 'detail'){
                    Component = Detail;
                }
                if(page === 'threads'){
                    Component = Threads;
                }
                if(page === 'thread'){
                    Component = Thread;
                }
                if(clearHistory === true && fullFrame === false){
                    this.$navigateTo(Component, {
                        frame: 'mainContent',
                        clearHistory: true,
                        animated: false,
                        props: props
                    });
                }
                else if(clearHistory === false && fullFrame === false) {
                    this.$navigateTo(Component, {
                        frame: 'mainContent',
                        props: props
                    });
                }
                else if(clearHistory === true && fullFrame === true){
                    this.$navigateTo(Component, {
                        clearHistory: true,
                        animated: true,
                        transition: {
                            name: 'fade'
                        },
                        props: props
                    });
                }
                else if(clearHistory === false && fullFrame === true) {
                    this.$navigateTo(Component, {
                        clearHistory: false,
                        animated: true,
                        transition: {
                            name: 'fade'
                        },
                        props: props
                    });
                }
            },
            openModal: function(page, props={}){
                let Component;
                if(page === 'map'){
                    Component = MapModal;
                }
                if(page === 'wifi'){
                    Component = WifiModal;
                }
                if(page === 'route'){
                    Component = RouteModal;
                }
                if(page === 'thread'){
                    Component = Thread;
                }
                if(page === 'shop'){
                    Component = Shop;
                }
                this.$showModal(Component, {
                    fullscreen: true,
                    props: props
                });
            },
            back: function(){
                if(!this.$navigateBack({
                    frame: 'mainContent'
                })) {

                    // Go to home
                    console.log('not back');
                }
//                this.$navigateBack({
//                    frame: 'mainContent'
//                });
            },
            toHome: function(){
                EventBus.$emit('navigate', {
                    tab: 1,
                    page: 'home',
                    clearHistory: true
                });
            },
            toCamping: function(){
                EventBus.$emit('navigate', {
                    tab: 2,
                    page: 'camping',
                    clearHistory: true
                });
            },
            toNearby: function(){
                EventBus.$emit('navigate', {
                    tab: 3,
                    page: 'nearby',
                    clearHistory: true
                });
            },
            toEvents: function(){
                EventBus.$emit('navigate', {
                    tab: 4,
                    page: 'events',
                    clearHistory: true
                });
            },
            toReception: function(){
                EventBus.$emit('navigate', {
                    tab: 5,
                    page: 'threads',
                    clearHistory: true
                });
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