<template>
    <GridLayout rows="*" columns="*">
        <ScrollView row="0" col="0">
            <StackLayout height="100%">
                <GridLayout rows="auto,*">
                    <GridLayout rows="*" row="0" :height="heroHeight">
                        <Image row="0" :src="settings.home_image" class="hero-image"></Image>
                        <StackLayout row="0" class="hero-overlay" v-if="settings.show_home_name"></StackLayout>
                        <GridLayout row="0" rows="*">
                            <StackLayout row="0" class="hero-title-container" horizontalAlignment="center" verticalAlignment="center">
                                <Label v-if="settings.show_home_name" :text="heroTitle" class="hero-title" textWrap="true"></Label>
                            </StackLayout>
                        </GridLayout>
                    </GridLayout>
                    <StackLayout row="1">
                        <GridLayout rows="auto,*">
                            <GridLayout row="0" columns="*">
                                <StackLayout col="0" class="tabs-bottom-line" verticalAlignment="bottom"></StackLayout>
                                <GridLayout rows="auto" columns="auto,auto,*" col="0" class="tabs-container" orientation="horizontal">
                                    <StackLayout col="0" class="tab" @tap="activateTab(1)" :class="[{'active': activeTab === 1}]">
                                        <Label class="tab-label" :text="$t('home.myVacation')"></Label>
                                    </StackLayout>
                                    <StackLayout col="1" class="tab" @tap="activateTab(2)" :class="[{'active': activeTab === 2}]">
                                        <Label class="tab-label" :text="$t('home.news')"></Label>
                                    </StackLayout>
                                    <StackLayout col="2" class="quick-links" orientation="horizontal" horizontalAlignment="right">
                                        <Label class="quick-link quick-link-wifi fas" verticalAlignment="center" @tap="toWifi">{{ 'fa-wifi' | fonticon }}</Label>
                                        <Label class="quick-link quick-link-map far" verticalAlignment="center" @tap="toMap">{{ 'fa-map' | fonticon }}</Label>
                                    </StackLayout>
                                </GridLayout>
                            </GridLayout>
                            <ScrollView row="1">
                                <GridLayout rows="*" columns="*" height="100%">
                                    <MyVacationList row="0" col="0" class="tab-content" :class="[{'active': activeTab === 1}]" :innerPageClass="pageClass"></MyVacationList>
                                    <NewsItemList row="0" col="0" class="tab-content" :class="[{'active': activeTab === 2}]"></NewsItemList>
                                </GridLayout>
                            </ScrollView>
                        </GridLayout>
                    </StackLayout>
                </GridLayout>
            </StackLayout>
        </ScrollView>
    </GridLayout>
</template>

<script>
    import * as http from 'http'
    import EventBus from '../helpers/EventBus'
    import Responsive from '../mixins/Responsive'
    import Connection from '../mixins/Connection'
    import LocalStorage from '../mixins/LocalStorage'
    import MyVacationList from '../elements/MyVacationList'
    import NewsItemList from '../elements/NewsItemList'
    import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert";

    export default {
        data() {
            return {
                activeTab: 1,
                settings: {},
                heroTitle: ''
            }
        },
        computed: {
            heroHeight: function() {
                return this.screenWidth * 0.566;
            }
        },
        mixins: [
            Responsive,
            Connection,
            LocalStorage
        ],
        components: {
            'MyVacationList': MyVacationList,
            'NewsItemList': NewsItemList
        },
        created: function() {

            // The camping name is stored when a camping is selected
            this.heroTitle = this.getStringFromStore('campingName');

            // Set the settings object to a local variable for this component
            if(this.keyExistsInStore('settings')) {
                this.settings = this.getObjectFromStore('settings');
            }
        },
        methods: {

            /**
             * Activate a tab
             */
            activateTab: function(tab){
                this.activeTab = tab;
            },

            /**
             * Open the WiFi modal
             */
            toWifi: function(){
                EventBus.$emit('openModal', {
                    page: 'wifi'
                });
            },
            /**
             * Open the map modal
             */
            toMap: function(){
                let self = this;
                if(self.hasInternetConnection()) {
                    EventBus.$emit('openModal', {
                        page: 'map'
                    });
                }
                else {
                    if(self.keyExistsInStore('settings')){
                        EventBus.$emit('openModal', {
                            page: 'map'
                        });
                    }
                    else {
                        TNSFancyAlert.showError(
                            self.$t('errors.offline.title'),
                            self.$t('errors.offline.message'),
                            self.$t('errors.offline.buttonText')
                        );
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .hero-image {
        stretch: aspectFill;
    }
    .hero-overlay {
        background-color: #000;
        opacity: 0.6;
        background: linear-gradient(to bottom, black, transparent);
    }
    .hero-title-container {
        text-align: center;
        padding: 0 12.5;
    }
    .hero-title {
        color: #fff;
        font-size: 25;
        font-weight: 700;
    }

    /* Tabs */
    .tabs-container {
        font-size: 14;
    }
    .tabs-bottom-line {
        border-bottom-width: 1;
        border-color: #e5e5e5;
    }
    .tab {
        padding: 10 12.5;
        color: #8e8e8e;
    }
    .tab.active {
        color: #0070da;
        border-bottom-width: 2;
        border-color: #0070da;
    }
    .tab-content {
        visibility: collapsed;
    }
    .tab-content.active {
        visibility: visible;
    }

    /* Quick links */
    .quick-links {
        color: #8f99ac;
    }
    .quick-link {
        font-size: 16;
    }
    Page.xxs .quick-link-wifi {
        padding: 10 15 10 15;
    }
    Page.xxs .quick-link-map {
        padding: 10 30 10 15;
    }
    .quick-link-wifi {
        padding: 10 20 10 20;
    }
    .quick-link-map {
        padding: 10 40 10 20;
    }
</style>