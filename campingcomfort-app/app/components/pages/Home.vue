<template>
    <Page :class="pageClass" actionBarHidden="true">
        <GridLayout rows="*" columns="*">
            <ScrollView row="0" col="0">
                <StackLayout height="100%">
                    <GridLayout rows="auto,*">
                        <GridLayout rows="*" row="0" class="hero-grid">
                            <WebImage row="0" :src="heroImage" class="hero-image"></WebImage>
                            <StackLayout row="0" class="hero-overlay"></StackLayout>
                            <GridLayout row="0" rows="auto,*" columns="*,auto">
                                <StackLayout row="0" col="0">
                                    <StackLayout class="btn-container">
                                        <StackLayout class="btn wifi-btn" v-if="connectionType !== 'wifi'" @tap="toWifi">
                                            <Label class="btn-icon fas" verticalAlignment="center">{{ 'fa-wifi' | fonticon }}</Label>
                                        </StackLayout>
                                        <StackLayout class="btn contact-btn" @tap="toMap" v-if="plan">
                                            <Label class="btn-icon fa" verticalAlignment="center">{{ 'fa-map' | fonticon }}</Label>
                                            <Label class="btn-text" :text="$t('home.map')" verticalAlignment="center"></Label>
                                        </StackLayout>
                                    </StackLayout>
                                </StackLayout>
                                <StackLayout row="0" col="1">
                                    <StackLayout class="quick-links-container">
                                        <GridLayout columns="auto,auto">
                                            <Label class="quick-link fas" col="1" @tap="toSettings">{{ 'fa-cog' | fonticon }}</Label>
                                        </GridLayout>
                                    </StackLayout>
                                </StackLayout>
                                <StackLayout row="1" col="0" colSpan="2" class="hero-title-container" horizontalAlignment="center" verticalAlignment="center">
                                    <Label :text="heroTitle" class="hero-title" textWrap="true"></Label>
                                </StackLayout>
                            </GridLayout>
                        </GridLayout>
                        <StackLayout row="1">
                            <GridLayout rows="auto,*">
                                <GridLayout row="0" columns="*">
                                    <StackLayout col="0" class="tabs-bottom-line" verticalAlignment="bottom"></StackLayout>
                                    <StackLayout col="0" class="tabs-container" orientation="horizontal">
                                        <StackLayout class="tab" @tap="activateTab(1)" :class="[{'active': activeTab === 1}]">
                                            <Label class="tab-label" :text="$t('home.myVacation')"></Label>
                                        </StackLayout>
                                        <StackLayout class="tab" @tap="activateTab(2)" :class="[{'active': activeTab === 2}]">
                                            <Label class="tab-label" :text="$t('home.news')"></Label>
                                        </StackLayout>
                                    </StackLayout>
                                </GridLayout>
                                <ScrollView row="1">
                                    <GridLayout rows="*" columns="*" height="100%">
                                        <MyVacationList row="0" col="0" class="tab-content" :class="[{'active': activeTab === 1}]"></MyVacationList>
                                        <NewsItemList row="0" col="0" class="tab-content" :class="[{'active': activeTab === 2}]"></NewsItemList>
                                    </GridLayout>
                                </ScrollView>
                            </GridLayout>
                        </StackLayout>
                    </GridLayout>
                </StackLayout>
            </ScrollView>
        </GridLayout>
    </Page>
</template>

<script>
    import * as http from 'http'
    import EventBus from '../helpers/EventBus'
    import Responsive from '../mixins/Responsive'
    import Connection from '../mixins/Connection'
    import LocalStorage from '../mixins/LocalStorage'
    import MyVacationList from '../elements/MyVacationList'
    import NewsItemList from '../elements/NewsItemList'

    export default {
        data() {
            return {
                activeTab: 1,
                heroImage: '~/assets/images/placeholder.jpg',
                heroTitle: '',
                plan: ''
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
        created: function(){
            let self = this;

            // Hide the status bar
            EventBus.$emit('hideStatusBar');

            // Initialize
            self.init();

            // Listen to a clear storage event
            EventBus.$on('reInit', function(){
                self.init();
            });
        },
        methods: {
            init: function(){
                let self = this;

                // The camping name is stored when a camping is selected
                this.heroTitle = this.getStringFromStore('campingName');

                // Get the data from the api (internet) or local storage (offline)
                let campingId = this.getNumberFromStore('campingId');
                let lang = this.getStringFromStore('language');
                if(this.hasInternetConnection()){

                    // Show the cached version first to prevent flickering
                    if(self.keyExistsInStore('home_heroImage')) {
                        self.heroImage = self.getStringFromStore('home_heroImage', '~/assets/images/placeholder.jpg');
                    }
                    if(self.keyExistsInStore('plan')) {
                        self.plan = self.getStringFromStore('plan');
                    }

                    // Get the live data
                    http.getJSON("https://www.campingcomfort.app/api/"+campingId+"/content/"+lang).then(result => {

                        // Assign and store the hero image
                        if(result.appContent.home_image){
                            self.heroImage = result.appContent.home_image;
                            self.storeString('home_heroImage', self.heroImage);
                        }
                        else {
                            self.heroImage = '~/assets/images/placeholder.jpg';
                            self.removeKeyFromStore('home_heroImage');
                        }

                        // Assign and store the map
                        if(result.appContent.plan){
                            self.plan = result.appContent.plan;
                            self.storeString('plan', self.plan);
                        }
                        else {
                            self.plan = '';
                            self.removeKeyFromStore('plan');
                        }
                    }, error => {
                        self.heroImage = '~/assets/images/placeholder.jpg';
                        self.removeKeyFromStore('home_heroImage');
                        self.plan = '';
                        self.removeKeyFromStore('plan');
                    });
                }
                else {
                    self.heroImage = self.getStringFromStore('home_heroImage', '~/assets/images/placeholder.jpg');
                    self.plan = self.getStringFromStore('plan');
                }
            },
            activateTab: function(tab){
                this.activeTab = tab;
            },
            navigate: function(){
                EventBus.$emit('navigate', {
                    tab: 1,
                    page: 'coming-soon'
                });
            },
            toWifi: function(){
                EventBus.$emit('openModal', {
                    page: 'wifi'
                });
            },
            toMap: function(){
                let self = this;
                if(self.hasInternetConnection()) {
                    EventBus.$emit('openModal', {
                        page: 'map'
                    });
                }
                else {
                    if(self.keyExistsInStore('plan')){
                        EventBus.$emit('openModal', {
                            page: 'map'
                        });
                    }
                    else {
                        setTimeout(function(){
                            alert({
                                title: self.$t('errors.offline.title'),
                                message: self.$t('errors.offline.message'),
                                okButtonText: self.$t('errors.offline.buttonText')
                            }).then(() => {
                            });
                        }, 500);
                    }
                }
            },
            toSettings: function(){
                EventBus.$emit('openModal', {
                    page: 'settings'
                });
            }
        }
    }
</script>

<style scoped>
    /* Hero */
    Page.xs .hero-grid {
        height: 210;
    }
    Page.sm .hero-grid {
        height: 232;
    }
    Page.md .hero-grid {
        height: 270;
    }
    Page.lg .hero-grid {
        height: 432;
    }
    Page.xl .hero-grid {
        height: 576;
    }
    .hero-image {
        stretch: aspectFill;
    }
    .hero-overlay {
        background-color: #000;
        opacity: 0.35;
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

    /* Buttons */
    .btn-container {
        padding: 12.5 0 0 12.5;
        orientation: horizontal;
    }
    .wifi-btn {
        color: #fff;
        border-color: #fff;
    }
    .contact-btn {
        margin-left: 5;
        color: #fff;
        border-color: #fff;
    }

    /* Quick links */
    .quick-links-container {
        padding: 12.5 12.5 0 0;
        orientation: horizontal;
        color: #fff;
    }
    .quick-link {
        padding: 10 12.5 10 12.5;
        font-size: 20;
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
    .temp-tab-content {
        padding: 12.5;
    }
</style>