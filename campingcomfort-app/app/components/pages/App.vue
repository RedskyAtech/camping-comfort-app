<template>
    <Page :class="pageClass" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <GridLayout rows="*" columns="*">
            <GridLayout row="0" col="0" rows="*, auto" columns="*">
                <StackLayout row="0" col="0">
                    <Frame id="mainContent">
                        <Home/>
                    </Frame>
                </StackLayout>
                <StackLayout row="1" col="0" class="tabbar">
                    <GridLayout rows="*" columns="*,*,*,*,*">
                        <StackLayout verticalAlignment="middle" row="0" col="0" class="tab" :class="[{'active': activeTab === 1}]" @tap="toHome">
                            <Label class="tab-icon fas">{{ 'fa-home' | fonticon }}</Label>
                            <Label class="tab-label" :text="$t('tabs.home')"></Label>
                        </StackLayout>
                        <StackLayout verticalAlignment="middle" row="0" col="1" class="tab" :class="[{'active': activeTab === 2}]" @tap="toCamping">
                            <Label class="tab-icon fas">{{ 'fa-campground' | fonticon }}</Label>
                            <Label class="tab-label" :text="$t('tabs.camping')"></Label>
                        </StackLayout>
                        <StackLayout verticalAlignment="middle" row="0" col="2" class="tab" :class="[{'active': activeTab === 3}]" @tap="toNearby">
                            <Label class="tab-icon fas">{{ 'fa-map-marker-alt' | fonticon }}</Label>
                            <Label class="tab-label" :text="$t('tabs.nearby')"></Label>
                        </StackLayout>
                        <StackLayout verticalAlignment="middle" row="0" col="3" class="tab" :class="[{'active': activeTab === 4}]" @tap="toEvents">
                            <Label class="tab-icon fas">{{ 'fa-calendar-alt' | fonticon }}</Label>
                            <Label class="tab-label" :text="$t('tabs.activities')"></Label>
                        </StackLayout>
                        <StackLayout verticalAlignment="middle" row="0" col="4" class="tab" :class="[{'active': activeTab === 5}]" @tap="toReception">
                            <Label class="tab-icon far">{{ 'fa-comment' | fonticon }}</Label>
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
    import Reception from '../pages/Reception'
    import SettingsModal from '../elements/SettingsModal'
    import MapModal from '../elements/MapModal'
    import WifiModal from '../elements/WifiModal'
    import RouteModal from '../elements/RouteModal'
    import LocalStorage from '../mixins/LocalStorage'
    import Loader from '../elements/Loader'
    import Connection from '../mixins/Connection'
    import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http"

    export default {
        data() {
            return {
                activeTab: 1
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
            Reception: Reception,
            SettingsModal: SettingsModal,
            MapModal: MapModal,
            WifiModal: WifiModal,
            RouteModal: RouteModal,
            Loader: Loader
        },
        created: function(){
            let self = this;

            // Log the app activity
            EventBus.$on('log', function(data) {
                self.log(data.type, data.data);
            });

            // Listen to navigation requests
            EventBus.$on('navigate', function(data){
                self.log('navigate', data);
                self.navigate(data.tab, data.page, data.switchTab, data.props);
            });

            // Listen to open-modal requests
            EventBus.$on('openModal', function(data){
                self.log('navigate', data);
                self.openModal(data.page, data.props);
            });

            // Listen to go back navigation requests
            EventBus.$on('back', function(){
                self.back();
            });
        },
        methods: {
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
                    if (type === 'reception_submit') {

                        // Create the data object
                        let content = JSON.stringify({
                            uuid: platform.device.uuid,
                        });

                        // Create the request
                        request({
                            url: "https://www.campingcomfort.app/api/" + campingId + "/log/reception_submit",
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                            content: content
                        }).then((response) => {
                        }, (e) => {
                        });
                    }
                }
            },
            navigate: function(tab, page, switchTab=false, props={}){

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
                if(page === 'reception'){
                    Component = Reception;
                }
                if(switchTab === true){
                    this.$navigateTo(Component, {
                        frame: 'mainContent',
                        clearHistory: true,
                        animated: false,
                        props: props
                    });
                }
                else {
                    this.$navigateTo(Component, {
                        frame: 'mainContent',
                        props: props
                    });
                }
            },
            openModal: function(page, props={}){
                let Component;
                if(page === 'settings'){
                    Component = SettingsModal;
                }
                if(page === 'map'){
                    Component = MapModal;
                }
                if(page === 'wifi'){
                    Component = WifiModal;
                }
                if(page === 'route'){
                    Component = RouteModal;
                }
                this.$showModal(Component, {
                    fullscreen: true,
                    props: props
                });
            },
            back: function(){
                this.$navigateBack({
                    frame: 'mainContent'
                });
            },
            toHome: function(){
                EventBus.$emit('navigate', {
                    tab: 1,
                    page: 'home',
                    switchTab: true
                });
            },
            toCamping: function(){
                EventBus.$emit('navigate', {
                    tab: 2,
                    page: 'camping',
                    switchTab: true
                });
            },
            toNearby: function(){
                EventBus.$emit('navigate', {
                    tab: 3,
                    page: 'nearby',
                    switchTab: true
                });
            },
            toEvents: function(){
                EventBus.$emit('navigate', {
                    tab: 4,
                    page: 'events',
                    switchTab: true
                });
            },
            toReception: function(){
                EventBus.$emit('navigate', {
                    tab: 5,
                    page: 'reception',
                    switchTab: true
                });
            }
        }
    }
</script>

<style scoped>

    /* Tabbar */
    .tabbar {
        background-color: #f8f8f8;
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