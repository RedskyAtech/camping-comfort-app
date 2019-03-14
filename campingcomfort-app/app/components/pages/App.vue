<template>
    <Page :class="pageClass" actionBarHidden="true">
        <GridLayout rows="*, auto" columns="*">
            <StackLayout row="0" col="0">
                <Frame id="mainContent">
                    <Home/>
                </Frame>
            </StackLayout>
            <StackLayout row="1" col="0" class="tabbar">
                <GridLayout rows="*" columns="*,*,*,*,*">
                    <StackLayout verticalAlignment="middle" row="0" col="0" class="tab" :class="[{'active': activeTab === 1}]" @tap="toHome">
                        <Label class="tab-icon fas">{{ 'fa-home' | fonticon }}</Label>
                        <Label class="tab-label" text="Home"></Label>
                    </StackLayout>
                    <StackLayout verticalAlignment="middle" row="0" col="1" class="tab" :class="[{'active': activeTab === 2}]" @tap="toCamping">
                        <Label class="tab-icon fas">{{ 'fa-campground' | fonticon }}</Label>
                        <Label class="tab-label" text="Camping"></Label>
                    </StackLayout>
                    <StackLayout verticalAlignment="middle" row="0" col="2" class="tab" :class="[{'active': activeTab === 3}]" @tap="toNearby">
                        <Label class="tab-icon fas">{{ 'fa-map-marker-alt' | fonticon }}</Label>
                        <Label class="tab-label" text="Omgeving"></Label>
                    </StackLayout>
                    <StackLayout verticalAlignment="middle" row="0" col="3" class="tab" :class="[{'active': activeTab === 4}]" @tap="toEvents">
                        <Label class="tab-icon fas">{{ 'fa-calendar-alt' | fonticon }}</Label>
                        <Label class="tab-label" text="Activiteiten"></Label>
                    </StackLayout>
                    <StackLayout verticalAlignment="middle" row="0" col="4" class="tab" :class="[{'active': activeTab === 5}]" @tap="toReception">
                        <Label class="tab-icon fa">{{ 'fa-comment' | fonticon }}</Label>
                        <Label class="tab-label" text="Receptie"></Label>
                    </StackLayout>
                </GridLayout>
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
    import Responsive from '../mixins/Responsive'
    import EventBus from '../helpers/EventBus'
    import Splash from '../pages/Splash'
    import Home from '../pages/Home'
    import Camping from '../pages/Camping'
    import Nearby from '../pages/Nearby'
    import Events from '../pages/Events'
    import Detail from '../pages/Detail'
    import ComingSoon from '../pages/ComingSoon'
    import SettingsModal from '../elements/SettingsModal'
    import MapModal from '../elements/MapModal'
    import WifiModal from '../elements/WifiModal'
    import RouteModal from '../elements/RouteModal'

    export default {
        data() {
            return {
                activeTab: 1
            }
        },
        mixins: [
            Responsive
        ],
        mounted: function(){
            let self = this;

            // Listen to navigation requests
            EventBus.$on('navigate', function(data){
                self.navigate(data.tab, data.page, data.switchTab, data.props);
            });

            // Listen to open-modal requests
            EventBus.$on('openModal', function(data){
                self.openModal(data.page, data.props);
            });

            // Listen to go back navigation requests
            EventBus.$on('back', function(){
                self.back();
            });
        },
        components: {

            // Pages
            Splash: Splash,
            Home: Home,
            Camping: Camping,
            Nearby: Nearby,
            Events: Events,
            Detail: Detail,
            ComingSoon: ComingSoon,
            SettingsModal: SettingsModal,
            MapModal: MapModal,
            WifiModal: WifiModal,
            RouteModal: RouteModal
        },
        methods: {
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
                    Component = ComingSoon;
                }
                if(page === 'coming-soon'){
                    Component = ComingSoon;
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
                    switchTab: true,
                    props: {
                        title: 'Receptie'
                    }
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
    Page.xs .tab-label {
        visibility: collapsed;
    }
    .tab-label {
        font-size: 12;
        padding-top: 3;
    }
</style>