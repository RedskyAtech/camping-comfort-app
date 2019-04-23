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
                                <Label :text="$t('reception.name')" class="label font-weight-bold m-b-5" />
                                <TextField returnPress="doneTap" returnKeyType="done" class="input" v-model="form.name"></TextField>
                                <StackLayout class="hr-light"></StackLayout>
                            </StackLayout>
                            <StackLayout class="input-field">
                                <Label :text="$t('reception.pitch')" class="label font-weight-bold m-b-5" />
                                <TextField returnPress="doneTap" returnKeyType="done" keyboardType="number" class="input" v-model="form.pitch"></TextField>
                                <StackLayout class="hr-light"></StackLayout>
                            </StackLayout>
                            <StackLayout class="input-field">
                                <Label :text="$t('reception.phone')" class="label font-weight-bold m-b-5" />
                                <TextField returnPress="doneTap" returnKeyType="done" keyboardType="phone" class="input" v-model="form.phone"></TextField>
                                <StackLayout class="hr-light"></StackLayout>
                            </StackLayout>
                            <StackLayout class="input-field">
                                <Label :text="$t('reception.message')" class="label font-weight-bold m-b-5" />
                                <TextField returnPress="doneTap" returnKeyType="done" class="input" v-model="form.message"></TextField>
                                <StackLayout class="hr-light"></StackLayout>
                            </StackLayout>
                            <StackLayout class="btn-container" horizontalAlignment="center">
                                <StackLayout class="btn send-btn" @tap="send">
                                    <Label class="btn-icon far" verticalAlignment="center">{{ 'fa-paper-plane' | fonticon }}</Label>
                                    <Label class="btn-text" :text="$t('reception.sendMessage')" verticalAlignment="center"></Label>
                                </StackLayout>
                            </StackLayout>
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
                    pitch: '',
                    phone: '',
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
            doneTap: function(args) {
                let myTextField = args.object;
                myTextField.dismissSoftInput();
            },
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
            },
            send: function() {

                let self = this;

                // Validation
                let mandatoryFields = [];
                if(this.form.name.length === 0) {
                    mandatoryFields.push(this.$t('reception.name'))
                }
                if(this.form.message.length === 0) {
                    mandatoryFields.push(this.$t('reception.message'))
                }
                if(mandatoryFields.length > 0) {
                    let fieldsMsg = '';
                    mandatoryFields.forEach(function (field) {
                        fieldsMsg += '-'+field+'\r\n';
                    });
                    TNSFancyAlert.showError(
                        this.$t('validation.mandatoryMessage'),
                        fieldsMsg,
                        this.$t('errors.other.buttonText')
                    );
                }

                // Send
                else {
                    let campingId = this.getNumberFromStore('campingId');
                    let data = JSON.stringify({
                        name: self.form.name,
                        pitch: self.form.pitch,
                        phone: self.form.phone,
                        message: self.form.message
                    });

                    let loadingId = Date.now();
                    EventBus.$emit('startLoading', loadingId);
                    request({
                        url: "https://www.campingcomfort.app/api/"+campingId+"/reception-email",
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        content: data
                    }).then((response) => {
//                        result = response.content.toJSON();
                        EventBus.$emit('stopLoading', loadingId);

                        // Reset the values
                        self.form.name = '';
                        self.form.pitch = '';
                        self.form.phone = '';
                        self.form.message = '';

                        // Show an alert
                        TNSFancyAlert.showSuccess(
                            self.$t('reception.alert.title'),
                            self.$t('reception.alert.text'),
                            self.$t('reception.alert.buttonText')
                        );
                    }, (e) => {
                        EventBus.$emit('stopLoading', loadingId);

                        TNSFancyAlert.showError(
                            self.$t('errors.other.title'),
                            self.$t('errors.other.message'),
                            self.$t('errors.other.buttonText')
                        );
                    });
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
    .input-field .label {
        color: #191919;
        opacity: 0.5;
        font-family: 'Avenir';
        font-weight: 500;
    }
    .btn-container {
        orientation: horizontal;
        padding: 12.5 0 0 0;
    }
</style>