<template>
    <Page :class="pageClass" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <GridLayout rows="auto,*" columns="*">
            <StackLayout row="0" class="title-container">
                <Label :text="$t('reception.title')"></Label>
            </StackLayout>
            <ScrollView row="1" verticalAlignment="top">
                <StackLayout>
                    <StackLayout class="content">
                        <Label class="text" :text="item.reception_text" textWrap="true"></Label>
                        <StackLayout class="form">
                            <StackLayout class="input-field">
                                <Label text="Name" returnKeyType="next" class="label font-weight-bold m-b-5" />
                                <TextField class="input"></TextField>
                                <StackLayout class="hr-light"></StackLayout>
                            </StackLayout>
                            <StackLayout keyboardType="number" class="input-field">
                                <Label text="Pitch #" returnKeyType="next" class="label font-weight-bold m-b-5" />
                                <TextField class="input"></TextField>
                                <StackLayout class="hr-light"></StackLayout>
                            </StackLayout>
                            <StackLayout class="input-field">
                                <Label text="Phone number" returnKeyType="next" keyboardType="phone" class="label font-weight-bold m-b-5" />
                                <TextField class="input"></TextField>
                                <StackLayout class="hr-light"></StackLayout>
                            </StackLayout>
                            <StackLayout class="input-field">
                                <Label text="Message" returnKeyType="done" class="label font-weight-bold m-b-5" />
                                <TextView class="input"></TextView>
                                <StackLayout class="hr-light"></StackLayout>
                            </StackLayout>
                            <Button text="Send message" class="btn btn-primary"></Button>
                        </StackLayout>
                    </StackLayout>
                </StackLayout>
            </ScrollView>
        </GridLayout>
    </Page>
</template>

<script>
    import * as http from 'http'
    import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http";
    import EventBus from '../helpers/EventBus'
    import Connection from '../mixins/Connection'
    import Responsive from '../mixins/Responsive'
    import LocalStorage from '../mixins/LocalStorage'
    import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert";

    export default {
        data() {
            return {
                item: {},
                form: {
                    name: '',
                    location: '',
                    message: ''
                }
            }
        },
        mixins: [
            Responsive,
            Connection,
            LocalStorage
        ],
        mounted: function() {
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
                    }

                    // Get the live data
                    http.getJSON("https://www.campingcomfort.app/api/"+campingId+"/content/"+lang).then(result => {

                        // Assign the data
                        if(result.appContent){
                            self.item = result.appContent;
                            self.storeObject('settings', self.item);
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
            }
        }
    }
</script>

<style scoped>

    /* Title */
    .title-container {
        background-color: #f8f8f8;
        text-align: center;
        font-weight: 700;
        padding: 12.5;
        border-bottom-width: 1;
        border-color: #e5e5e5;
    }
    .content {
        padding: 25;
    }
    .text {
        opacity: 0.5;
        line-height: 5;
    }
    .form {
        margin-top: 20;
    }
    .input-field {
        margin-left: 0;
        margin-right: 0;
    }
    .btn {
        margin-left: 0;
        margin-right: 0;
    }
</style>