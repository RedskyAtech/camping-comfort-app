<template>
    <Page :class="pageClass" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <Header :hasHero="false" :title="threadTitle" :showHeader="true" :showBackBtn="true" :inModal="true">
            <GridLayout rows="*,auto,auto" height="100%">
                <ScrollView ref="scrollView" row="0">
                    <StackLayout class="content" :class="[{ 'visible': scrolledDown}]" v-if="messages.length > 0">
                        <Bubble v-for="message in messages" :type="(keyExistsInStore('userId') && message.is_message_from_camping === 1) || (!keyExistsInStore('userId') && message.is_message_from_camping === 0) ? 'me' : 'he'" :time="humanizeDate(message.updated_at)" v-bind:data="message" v-bind:key="message.id" :name="keyExistsInStore('userId') ? thread.name + ' ('+thread.location+')' : getStringFromStore('campingName')">
                            <Label textWrap="true" :text="message.message"></Label>
                        </Bubble>
                    </StackLayout>
                    <GridLayout height="100%" rows="*" v-else>
                        <ResultPlaceHolder row="0" icon-label-class="far" icon-class="fa-comments" :title="$t('thread.emptyThreadTitle')" :text="$t('thread.emptyThreadText')"></ResultPlaceHolder>
                    </GridLayout>
                </ScrollView>
                <StackLayout row="1" class="form">
                    <GridLayout width="100%" columns="*,auto" rows="*" v-if="hasInternetConnection()">
                        <TextField col="0" class="input" v-model="message" ref="input" :hint="$t('thread.typeAMessage')" returnKeyType="send" @returnPress="sendMessage" />
                        <StackLayout col="1" class="button" verticalAlignment="center" @tap="sendMessage">
                            <Label class="far" :text="'fa-paper-plane' | fonticon"></Label>
                        </StackLayout>
                    </GridLayout>
                    <Label v-else class="no-internet" :text="$t('errors.offline.message')" horizontalAlignment="center" textAlignment="center" textWrap="true"></Label>
                </StackLayout>
                <StackLayout row="2" ref="keyboardHeight"></StackLayout>
            </GridLayout>
        </Header>
    </Page>
</template>

<script>
    import * as platform from "tns-core-modules/platform";
    import * as http from 'http'
    import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http";
    import EventBus from '../helpers/EventBus'
    import Connection from '../mixins/Connection'
    import Responsive from '../mixins/Responsive'
    import LocalStorage from '../mixins/LocalStorage'
    import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert";
    import Header from '../elements/Header'
    import HeaderMixin from '../mixins/HeaderMixin'
    import Bubble from '../elements/Bubble'
    import Dates from '../mixins/Dates'
    import ResultPlaceHolder from '../elements/ResultPlaceHolder'
    import * as application from "tns-core-modules/application";
    import { isAndroid, isIOS } from "tns-core-modules/platform";

    export default {
        props: {
            id: {
                type: Number
            }
        },
        data() {
            return {
                createdId: 0,
                message: '',
                scrolledDown: false,
                thread: {
                    name: '',
                    location: ''
                },
                messages: [],
                isPosting: false
            }
        },
        computed: {
            threadTitle: function() {
                if(this.keyExistsInStore('userId') && this.thread.name && this.thread.location) {
                    return this.thread.name + ' ('+this.thread.location+')';
                }
                else if(!this.keyExistsInStore('userId')){
                    return this.getStringFromStore('campingName');
                }
                else {
                    return '';
                }
            },
            computedId: function() {
                if(this.createdId > 0) {
                    return this.createdId;
                }
                else {
                    return this.id;
                }
            }
        },
        mixins: [
            Responsive,
            Connection,
            LocalStorage,
            HeaderMixin,
            Dates
        ],
        components: {
            Header: Header,
            Bubble: Bubble,
            ResultPlaceHolder: ResultPlaceHolder
        },
        beforeDestroy: function() {

            // Destroy any listeners in the event bus
            console.log('Listener removed: Thread->messageReceived');
            EventBus.$off('messageReceived');
        },
        mounted: function() {
            let self = this;
            this.listenToKeyboardHeight();
            this.init();

            // Refresh the list when a message is received
            EventBus.$on('messageReceived', function() {
                self.init();
            })
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
            init: function(){
                let self = this;

                if(self.computedId !== undefined) {

                    // Get the data from the api (internet) or local storage (offline)
                    let campingId = this.getNumberFromStore('campingId');
                    let uuid = platform.device.uuid;
                    if (this.hasInternetConnection()) {

                        // Show the cached version first to prevent flickering
                        if (self.keyExistsInStore('thread_'+self.computedId)) {
                            self.messages = self.getObjectFromStore('thread_'+self.computedId);
                        }

                        // Get the live data
                        let loadingId = Date.now();
                        EventBus.$emit('startLoading', loadingId);

                        // Define the URL for camping users or for guests
                        let url;
                        if(self.keyExistsInStore('userId')) {
                            url = "https://test.campingcomfort.app/api/" + campingId + "/threads/" + self.computedId + "/messages";
                        }
                        else {
                            url = "https://test.campingcomfort.app/api/" + campingId + "/threads/" + self.computedId + "/" + uuid + "/messages"
                        }

                        http.getJSON(url).then(result => {

                            // Assign the data
                            if (result.messages) {
                                self.messages = result.messages;
                                self.storeObject('thread_'+self.computedId, self.messages);

                                // Set the general thread data
                                self.thread = result.thread;

                                // Show the header
                                self.showHeader = true;

                                // Scroll down
                                self.scrollDown();

                                // Set the isPosting flag
                                self.isPosting = false;

                                // Stop the loader
                                EventBus.$emit('stopLoading', loadingId);
                            }

                            // No data found, remove from storage
                            else {
                                self.messages = [];
                                self.removeKeyFromStore('thread_'+self.id);

                                // Show the header
                                self.showHeader = true;

                                // Scroll down
                                self.scrollDown();

                                // Set the isPosting flag
                                self.isPosting = false;

                                // Stop the loader
                                EventBus.$emit('stopLoading', loadingId);
                            }

                            // Update the thread list
                            EventBus.$emit('threadChanged');

                        }, error => {

                            self.messages = [];
                            self.removeKeyFromStore('thread_'+self.computedId);

                            // Show the header
                            self.showHeader = true;

                            // Scroll down
                            self.scrollDown();

                            // Set the isPosting flag
                            self.isPosting = false;

                            // Stop the loader
                            EventBus.$emit('stopLoading', loadingId);
                        });
                    }
                    else {

                        // Get the settings from storage
                        if (self.keyExistsInStore('thread_'+self.computedId)) {
                            self.messages = self.getObjectFromStore('thread_'+self.computedId);

                            // Show the header
                            self.showHeader = true;

                            // Scroll down
                            self.scrollDown();

                            // Set the isPosting flag
                            self.isPosting = false;
                        }

                        // Offline with no storage data
                        else {

                            // Show the header
                            self.showHeader = true;

                            // Scroll down
                            self.scrollDown();

                            // Set the isPosting flag
                            self.isPosting = false;

                            setTimeout(function () {
                                TNSFancyAlert.showError(
                                    self.$t('errors.offline.title'),
                                    self.$t('errors.offline.message'),
                                    self.$t('errors.offline.buttonText')
                                );
                            }, 500);
                        }
                    }
                }
            },

            // Scroll down to the latest message
            // TODO: Scrolling down doesn't work without an internet connection
            scrollDown: function() {
                let self = this;
                setTimeout(function() {

                    let scrollView = self.$refs.scrollView.nativeView;
                    scrollView.scrollToVerticalOffset(scrollView.scrollableHeight, true);

                    // Set the scrolledDown status so the content becomes visible
                    self.scrolledDown = true;
                }, 250);
            },

            // Send a new message
            sendMessage: function() {

                let self = this;

                // Check if a previous post is busy
                if(self.isPosting === false) {

                    // Set the isPosting flag
                    self.isPosting = true;

                    // Hide the keyboard
                    self.$refs.input.nativeView.dismissSoftInput();
                    self.$refs.keyboardHeight.nativeView.height = 0;

                    // Send the message
                    if (self.message.length > 0) {

                        let campingId = this.getNumberFromStore('campingId');
                        let data = JSON.stringify({
                            threadId: self.computedId,
                            uuid: platform.device.uuid,
                            isMessageFromCamping: self.keyExistsInStore('userId') ? 1 : 0,
                            name: self.keyExistsInStore('guestName') ? self.getStringFromStore('guestName') : '',
                            location: self.keyExistsInStore('guestLocation') ? self.getStringFromStore('guestLocation') : '',
                            message: self.message
                        });

                        let loadingId = Date.now();
                        EventBus.$emit('startLoading', loadingId);

                        let url = "https://test.campingcomfort.app/api/" + campingId + "/threads/messages"
                        request({
                            url: url,
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                            content: data
                        }).then((response) => {

                            // Convert the response to JSON
                            let result = response.content.toJSON();

                            if (result.threadId) {

                                if (self.computedId === undefined) {

                                    // Set the created thread id
                                    self.createdId = result.threadId;

                                    // Log the submit activity
                                    EventBus.$emit('log', {
                                        type: 'new_thread',
                                        data: {}
                                    });
                                }

                                // Reload the data
                                self.init();

                                // Reset the values
                                self.message = '';

                                // Stop the loader
                                EventBus.$emit('stopLoading', loadingId);
                            }
                            else {

                                // Set the isPosting flag
                                self.isPosting = false;

                                EventBus.$emit('stopLoading', loadingId);

                                TNSFancyAlert.showError(
                                    self.$t('errors.other.title'),
                                    self.$t('errors.other.message'),
                                    self.$t('errors.other.buttonText')
                                );
                            }
                        }, (e) => {
                            console.log(url);
                            console.log(e);

                            // Set the isPosting flag
                            self.isPosting = false;

                            EventBus.$emit('stopLoading', loadingId);

                            TNSFancyAlert.showError(
                                self.$t('errors.other.title'),
                                self.$t('errors.other.message'),
                                self.$t('errors.other.buttonText')
                            );
                        });
                    }
                    else {

                        // Set the isPosting flag
                        self.isPosting = false;
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .content {
        padding: 25;
        opacity: 0;
    }
    .content.visible {
        opacity: 1;
    }
    .form {
        background-color: #ffffff;
        border-top-width: 1;
        border-color: #e5e5e5;
        padding: 10 12.5;
    }
    .form .input {
        height: 40;
    }
    .form .button {
        background: #7ea818;
        border-color: #7ea818;
        margin: 0 0 0 6.25;
        padding: 0 20;
        height: 40;
        border-radius: 20;
    }
    .form .button Label {
        font-family: Font Awesome 5 Free, fa-regular-400;
        font-size: 18;
        color: #fff;
    }
    .no-internet {
        opacity: 0.6;
        font-size: 12;
    }
</style>