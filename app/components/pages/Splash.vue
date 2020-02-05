<template>
    <Page :class="pageClass" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <GridLayout rows="*" height="100%">
            <GridLayout row="0" rows="*,auto" columns="*">
                <StackLayout row="0" col="0" verticalAlignment="center" class="fields-container">
                    <GridLayout rows="auto,auto,auto,auto">
                        <StackLayout row="0" class="intro">
                            <StackLayout>
                                <Image class="icon" src="~/assets/images/logo_white.png"></Image>
                                <Label class="intro-text" textWrap="true" :text="$t('splash.introText')"></Label>
                                <StackLayout class="button scan-button" verticalAlignment="center" @tap="scan">
                                    <Label :text="$t('splash.continue')"></Label>
                                </StackLayout>
                            </StackLayout>
                        </StackLayout>
                    </GridLayout>
                </StackLayout>
                <Label row="1" col="0" horizontalAlignment="center" verticalAlignment="center" class="copyright" text="© 2020 Camping Comfort"></Label>
            </GridLayout>
        </GridLayout>
    </Page>
</template>

<script>
    import EventBus from '../helpers/EventBus';
    import Responsive from '../mixins/Responsive';
    import App from './App';
    import { BarcodeScanner } from "nativescript-barcodescanner";
    import LocalStorage from '../mixins/LocalStorage'
    import Connection from '../mixins/Connection'
    import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http";
    import {exit} from 'nativescript-exit';
    import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert";
    import * as appSettings from "tns-core-modules/application-settings";
    import * as application from "tns-core-modules/application";
    import { isAndroid, isIOS, device, screen } from "tns-core-modules/platform";
    import ListPicker from 'tns-core-modules/ui/list-picker'

    export default {
        mixins: [
            Responsive,
            LocalStorage,
            Connection
        ],
        components: {
            ListPicker
        },
        mounted: function() {
            let self = this;

            if(!this.hasInternetConnection()) {
                setTimeout(function() {
                    TNSFancyAlert.showError(
                        self.$t('errors.offline.title'),
                        self.$t('errors.offline.message'),
                        self.$t('errors.offline.buttonText')
                    ).then(() => {
                        exit();
                    });
                }, 500);
            }
        },
        methods: {
            resetSettings: function() {
                let self = this;

                // Keep the language
                let language;
                if(self.keyExistsInStore('language')) {
                    language = self.getStringFromStore('language');
                }

                // Keep the news topic
                let newsTopic;
                if(self.keyExistsInStore('news_topic')) {
                    newsTopic = self.getStringFromStore('news_topic');
                }

                // Keep the camping messaging topic
                let campingMessagingTopic;
                if(self.keyExistsInStore('camping_messaging_topic')) {
                    campingMessagingTopic = self.getStringFromStore('camping_messaging_topic');
                }

                // Keep the guest messaging topic
                let guestMessagingTopic;
                if(self.keyExistsInStore('guest_messaging_topic')) {
                    guestMessagingTopic = self.getStringFromStore('guest_messaging_topic');
                }

                // Clear all stored data
                self.removeAllKeysFromStore();

                // Re-store the language
                if(language) {
                    self.storeString('language', language);
                }

                // Re-store the news topic
                if(newsTopic) {
                    self.storeString('news_topic', newsTopic);
                }

                // Re-store the camping messaging topic
                if(campingMessagingTopic) {
                    self.storeString('camping_messaging_topic', campingMessagingTopic);
                }

                // Re-store the guest messaging topic
                if(guestMessagingTopic) {
                    self.storeString('guest_messaging_topic', guestMessagingTopic);
                }

            },
            scan: function() {
                let self = this;
                if(self.$mode === 'development') {

                    // Set the data and redirect
                    self.processScanResult({text: 'c_32805_84_$2y$10$i1thehGAJVkEPXxwjZLmnu.T4sN6.iTnz2zxNAxWF/DtnEuyEfSCO'});
                }
                else {

                    // Scan the QR code
                    let barcodescanner = new BarcodeScanner();
                    barcodescanner.scan({
                        formats: "QR_CODE",
                        cancelLabel: "Close", // iOS only, default 'Close'
                        cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
                        message: "Place a barcode inside the viewfinder rectangle to scan it.", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
                        showFlipCameraButton: false,   // default false
                        preferFrontCamera: false,     // default false
                        showTorchButton: true,        // default false
                        beepOnScan: true,             // Play or Suppress beep on scan (default true)
                        torchOn: false,               // launch with the flashlight on (default false)
                        closeCallback: () => { console.log("Scanner closed")}, // invoked when the scanner was closed (success or abort)
                        resultDisplayDuration: 0,   // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
                        orientation: 'portrait',     // Android only, default undefined (sensor-driven orientation), other options: portrait|landscape
                        openSettingsIfPermissionWasPreviouslyDenied: true, // On iOS you can send the user to the settings app if access was previously denied
                        presentInRootViewController: true // iOS-only; If you're sure you're not presenting the (non embedded) scanner in a modal, or are experiencing issues with fi. the navigationbar, set this to 'true' and see if it works better for your app (default false).
                    }).then((result) => {
                            self.processScanResult(result);
                        }, (errorMessage) => {
                            console.log("No scan. " + errorMessage);
                        }
                    );
                }
            },

            /**
             * Process the scan result
             *
             * @param result
             */
            processScanResult(result) {
                let self = this;
                let url = self.$apiBaseUrl + "/login";
                request({
                    url: url,
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    content: JSON.stringify({
                        key: result.text,
                        v: self.$apiVersion
                    })
                }).then((response) => {
                    let result = response.content.toJSON();

                    // Reset the settings first
                    self.resetSettings();


                    // Store all user groups
                    if(result.userGroups.length > 0) {
                        self.storeUserGroups(result.userGroups);
                    }

                    // Logged in as administrator
                    if(result.userId) {

                        // Ask the user for the group to login to
                        if(result.userGroups.length > 0) {

                            // Create a local object for reference
                            // This one has the name as the key
                            let options = {};
                            result.userGroups.forEach(function (item, key) {
                                options[item.name] = item.id;
                            });
                            let userGroups = options;

                            // Create an action list
                            options = [];
                            result.userGroups.forEach(function (item, key) {
                                options.push(item.name);
                            });

                            // Show the action list
                            if(options.length > 0) {
                                action(self.$t('splash.userGroupTitle'), self.$t('splash.cancel'), options)
                                .then(selection => {

                                    // Store the group selection, camping and user data
                                    self.storeSettings(result.campingId, result.campingName, result.userId, {id: userGroups[selection], name: selection});

                                    // Redirect to the App page
                                    self.redirect();
                                });
                            }
                            else {

                                // Store the camping and user data
                                self.storeSettings(result.campingId, result.campingName, result.userId);

                                // Redirect to the App page
                                self.redirect();
                            }
                        }

                        // The camping doesn't have any user groups
                        else {
                            // Store the camping and user data
                            self.storeSettings(result.campingId, result.campingName, result.userId);

                            // Redirect to the App page
                            self.redirect();
                        }
                    }

                    // Logged in as camping
                    else {

                        // Store the camping
                        self.storeSettings(result.campingId, result.campingName);

                        // Redirect to the App page
                        self.redirect();
                    }

                }, (e) => {
                    console.log("Error: ");
                    console.log(e);
                });
            },
            storeUserGroups: function(userGroups) {
                this.storeObject('userGroups', userGroups);
            },
            storeSettings: function(campingId, campingName, userId=null, userGroup=null) {
                let self = this;

                // Store the data
                self.storeNumber('campingId', parseInt(campingId));
                self.storeString('campingName', campingName);
                if(userId) {
                    self.storeNumber('userId', parseInt(userId));
                }
                if(userGroup) {
                    self.storeNumber('userGroupId', parseInt(userGroup.id));
                    self.storeString('userGroupName', userGroup.name);
                }
            },
            redirect() {
                this.$navigateTo(App, {
                    clearHistory: true,
                    transition: {
                        name: 'fade',
                    }
                });
            }
        }
    }
</script>

<style scoped>
    Page {
        background: linear-gradient(to bottom, #009fe3, rgba(0,159,227,0.7));
    }
    .intro {
        color: #fff;
        text-align: center;
        padding: 25;
    }
    .icon {
        width: 200;
        height: 79;
        margin-bottom: 75;
    }
    .input {
        border-width: 1;
        border-color: rgba(255,255,255,0.25);
        color: #fff;
        height: 40;
        border-radius: 6;
        margin-bottom: 10;
        placeholder-color: #fff;
        text-align: left;
        padding-left: 10;
        padding-right: 10;
        background: rgba(255,255,255,0.1);
    }
    .button {
        color: #009fe3;
        border-color: #fff;
        background-color: #fff;
        border-width: 1;
        height: 40;
        border-radius: 20;
    }
    .button Label {
        color: #009fe3;
    }
    .button.scan-button {
        margin-top: 25;
        color: #009fe3;
    }
    Page.lg .button,
    Page.xl .button,
    Page.xxl .button{
        width: 350;
    }
    .copyright {
        color: #fff;
        opacity: 0.5;
        font-size: 12;
        padding: 12.5;
    }
    .collapsed {
        visibility: collapse;
    }
</style>