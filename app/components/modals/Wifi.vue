<template>
    <Page :class="pageClass" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <Header :hasHero="false" :title="$t('wifi.title')" :showHeader="true" :showBackBtn="true" :inModal="true">
            <GridLayout rows="*" columns="*" class="page">
                <ScrollView row="0" col="0">
                    <StackLayout class="content" verticalAlignment="top">
                        <Label class="title" :text="$t('wifi.title')"></Label>
                        <HtmlView :html="richText" @loaded="htmlViewLoaded" ref="htmlView"></HtmlView>
                        <StackLayout class="btn-container" v-if="item.wifi_code">
                            <StackLayout class="btn copy-btn" @tap="copyToClipboard">
                                <Label class="btn-icon far" verticalAlignment="center">{{ 'fa-clipboard' | fonticon }}</Label>
                                <Label class="btn-text" :text="$t('wifi.copy')" verticalAlignment="center"></Label>
                            </StackLayout>
                        </StackLayout>
                    </StackLayout>
                </ScrollView>
            </GridLayout>
        </Header>
    </Page>
</template>

<script>
    import * as http from 'http'
    import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http";
    import EventBus from '../helpers/EventBus'
    import Connection from '../mixins/Connection'
    import Responsive from '../mixins/Responsive'
    import Header from '../elements/Header'
    import HeaderMixin from '../mixins/HeaderMixin'
    import LocalStorage from '../mixins/LocalStorage'
    import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert";
    import RichText from '../mixins/RichText'

    export default {
        mixins: [
            Responsive,
            Connection,
            LocalStorage,
            HeaderMixin,
            RichText
        ],
        components: {
            Header: Header
        },
        data: function() {
            return {
                item: {},
            }
        },
        mounted: function(){
            this.init();
        },
        methods: {
            init: function(){
                let self = this;

                // Get the data from the api (internet) or local storage (offline)
                let campingId = this.getNumberFromStore('campingId');
                let lang = this.getStringFromStore('language');
                if(this.hasInternetConnection()){

                    // Show the cached version first to prevent flickering
                    if(self.keyExistsInStore('settings')) {
                        self.item = self.getObjectFromStore('settings');

                        // Add the text to the page
                        self.addRichText(self.item.wifi_text);
                    }

                    // Get the live data
                    http.getJSON(self.$apiBaseUrl + "/" + campingId + "/content/" + lang + "?v=" + self.$apiVersion).then(result => {

                        // Assign the data
                        if(result.appContent){
                            self.item = result.appContent;
                            self.storeObject('settings', self.item);

                            // Add the text to the page
                            self.addRichText(self.item.wifi_text);
                        }

                        // No data found, remove from storage
                        else {
                            self.item = {};
                            self.removeKeyFromStore('settings');
                        }
                    }, error => {
                        self.item = {};
                        self.removeKeyFromStore('settings');
                    });
                }
                else {

                    // Get the settings from storage
                    if(self.keyExistsInStore('settings')){
                        self.item = self.getObjectFromStore('settings');

                        // Add the text to the page
                        self.addRichText(self.item.wifi_text);
                    }

                    // Offline with no storage data
                    else {
                        setTimeout(function(){
                            TNSFancyAlert.showError(
                                self.$t('errors.offline.title'),
                                self.$t('errors.offline.message'),
                                self.$t('errors.offline.buttonText')
                            );
                        }, 500);
                    }
                }
            },
            copyToClipboard: function() {
                let self = this;
                let clipboard = require("nativescript-clipboard");
                clipboard.setText(this.item.wifi_code).then(function() {
                    TNSFancyAlert.showSuccess(
                        self.$t('wifi.alert.title'),
                        self.$t('wifi.alert.message'),
                        self.$t('wifi.alert.buttonText')
                    );
                })
            },
            closeModal: function(){
                this.$modal.close();
            }
        }
    }
</script>

<style scoped>
    Page {
        background: #fff;
    }
    .content {
        padding: 25;
    }
    .title {
        font-size: 18;
        font-weight: 700;
        padding-bottom: 10;
    }
    .text {
        opacity: 0.5;
        line-height: 5;
    }
    .btn-container {
        padding-top: 20;
        orientation: horizontal;
    }
    /*.btn {
        color: #fff;
        border-color: #fff;
    }*/
</style>