<template>
    <Page :class="pageClass" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <GridLayout rows="*,auto" height="100%">
            <GridLayout row="0" rows="*,auto" columns="*">
                <StackLayout row="0" col="0" verticalAlignment="center" class="fields-container">
                    <GridLayout rows="auto,auto,auto,auto">
                        <StackLayout row="0" class="intro">
                            <StackLayout v-if="!scanFinished">
                                <Image class="icon" src="~/assets/images/qr.png"></Image>
                                <Label class="intro-text" textWrap="true" :text="$t('splash.introText')"></Label>
                                <StackLayout class="button scan-button" verticalAlignment="center" @tap="scan">
                                    <Label :text="$t('splash.continue')"></Label>
                                </StackLayout>
                            </StackLayout>
                            <StackLayout :class="[{'collapsed': !scanFinished}]">
                                <StackLayout>
                                    <Label class="intro-text" textWrap="true" :text="$t('splash.welcomeTo')"></Label>
                                </StackLayout>
                                <StackLayout>
                                    <Label class="intro-title" textWrap="true" :text="scanResult.campingName"></Label>
                                </StackLayout>
                                <StackLayout class="input-fields" :class="[{'collapsed': scanResult.userId !== undefined}]">
                                    <TextField v-model="guestName" :hint="$t('splash.name')" class="input" ref="inputName" editable="true" returnKeyType="done" />
                                    <TextField v-model="guestLocation" :hint="$t('splash.location')" class="input" ref="inputLocation"editable="true" returnKeyType="done" />
                                </StackLayout>
                                <StackLayout class="button" verticalAlignment="center" @tap="start(guestName, guestLocation)">
                                    <Label text="Start"></Label>
                                </StackLayout>
                            </StackLayout>
                        </StackLayout>
                    </GridLayout>
                </StackLayout>
                <Label row="1" col="0" horizontalAlignment="center" verticalAlignment="center" class="copyright" text="© 2019 Camping Comfort"></Label>
            </GridLayout>
            <StackLayout row="1" ref="keyboardHeight"></StackLayout>
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

    export default {
        mixins: [
            Responsive,
            LocalStorage,
            Connection
        ],
        data: function() {
            return {
                scanResult: {},
                scanFinished: false,
                guestName: '',
                guestLocation: ''
            }
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
            else {
                this.listenToKeyboardHeight();
            }
        },
        methods: {

            // Listen to a changing keyboard height, and change the spacer height to push the text input up
            listenToKeyboardHeight: function() {
                let self = this;
                if(isIOS) {
                    application.ios.addNotificationObserver(UIKeyboardWillChangeFrameNotification, function (notification) {
                        let hght = notification.userInfo.valueForKey(UIKeyboardFrameEndUserInfoKey).CGRectValue.size.height;
                        let keyboardHeightEl = self.$refs.keyboardHeight;
                        if(keyboardHeightEl !== undefined) {
                            let keyboardHeightNv = keyboardHeightEl.nativeView;
                            keyboardHeightNv.height = hght;
                        }
                    });
                }
            },
            resetSettings: function() {
                let self = this;

                // Keep the language
                let language;
                if(self.keyExistsInStore('language')) {
                    language = self.getStringFromStore('language');
                }

                // Keep the news topic (because it will be unsubscribed before subscribing)
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
                        request({
                            url: "https://www.campingcomfort.app/api/login",
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            content: JSON.stringify({
                                key: result.text
                            })
                        }).then((response) => {
                            self.scanResult = response.content.toJSON();
                            self.scanFinished = true;
                        }, (e) => {
                            console.log("Error: ");
                            console.log(e);
                        });

                    }, (errorMessage) => {
                        console.log("No scan. " + errorMessage);
                    }
                );
            },
            start: function() {
                let self = this;

                // Hide the keyboard
                self.$refs.inputName.nativeView.dismissSoftInput();
                self.$refs.inputLocation.nativeView.dismissSoftInput();
                self.$refs.keyboardHeight.nativeView.height = 0;

                // Validate the mandatory fields
                if(self.scanResult.userId === undefined && (self.guestName === '' || self.guestLocation === '')) {
                    TNSFancyAlert.showError(
                        self.$t('splash.alert.title'),
                        self.$t('splash.alert.message'),
                        self.$t('splash.alert.buttonText')
                    );
                }
                else {

                    // Reset the settings first
                    self.resetSettings();

                    // Store the name and location
                    if(self.scanResult.userId === undefined) {
                        self.storeString('guestName', self.guestName);
                        self.storeString('guestLocation', self.guestLocation);
                    }

                    // Store the selected camping and optional camping user
                    self.storeNumber('campingId', parseInt(self.scanResult.campingId));
                    self.storeString('campingName', self.scanResult.campingName);
                    if(self.scanResult.userId !== undefined) {
                        self.storeNumber('userId', parseInt(self.scanResult.userId));
                    }

                    // Redirect to the App page
                    self.redirect();
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
        background: #123c64;
    }
    .intro {
        color: #fff;
        text-align: center;
        padding: 25;
    }
    .intro-title {
        font-size: 18;
        font-weight: 700;
        padding-top: 12.5;
        padding-bottom: 25;
    }
    .icon {
        width: 90;
        height: 90;
        margin-bottom: 50;
    }
    .input {
        border-width: 1;
        border-color: rgba(255,255,255,0.25);
        color: #fff;
        height: 40;
        border-radius: 5;
        margin-bottom: 10;
        placeholder-color: #fff;
        text-align: left;
        padding-left: 10;
        padding-right: 10;
        background: rgba(255,255,255,0.1);
    }
    .button {
        color: #123c64;
        border-color: #fff;
        background-color: #fff;
        border-width: 1;
        height: 40;
        border-radius: 20;
    }
    .button.scan-button {
        margin-top: 25;
    }
    Page.lg .button,
    Page.xl .button{
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