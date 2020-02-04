<template>
    <Header :hasHero="false" :title="keyExistsInStore('userId') ? $t('threads.title_camping') : $t('threads.title_guest')" :showHeader="true" :showBackBtn="false">
        <GridLayout rows="*" height="100%">
            <ThreadList row="0" :threads="threads"></ThreadList>
            <Fab v-if="!keyExistsInStore('userId')" row="0" backgroundColor="#7ea818" borderColor="#7ea818" color="#fff" verticalAlignment="bottom"><GridLayout rows="*" columns="*" @tap="toConversation()"><StackLayout row="0" col="0" verticalAlignment="center"><Label row="0" col="0" class="btn-icon far" verticalAlignment="center">{{ 'fa-comment' | fonticon }}</Label></StackLayout></GridLayout></Fab>
        </GridLayout>
    </Header>
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
    import ThreadList from '../elements/ThreadList'
    import Fab from '../elements/Fab'
    import Header from '../elements/Header'
    import HeaderMixin from '../mixins/HeaderMixin'

    export default {
        components: {
            'ThreadList': ThreadList,
            Fab: Fab,
            Header: Header
        },
        data() {
            return {
                threads: []
            }
        },
        mixins: [
            Responsive,
            Connection,
            LocalStorage,
            HeaderMixin
        ],
        beforeDestroy: function() {

            // Destroy any listeners in the event bus
            console.log('Listeners removed: Threads');
            EventBus.$off('threadChanged');
        },
        mounted: function() {
            let self = this;

            // Update the thread list when a thread changed
            EventBus.$on('threadChanged', function() {
                self.init();
            });

            self.init();
        },
        methods: {
            init: function(){
                let self = this;

                // Get the data from the api (internet) or local storage (offline)
                let campingId = this.getNumberFromStore('campingId');
                if(this.hasInternetConnection()){

                    // Show the cached version first to prevent flickering
                    if(self.keyExistsInStore('threads')) {
                        self.threads = self.getObjectFromStore('threads');
                    }

                    // Get the live data
                    let loadingId = Date.now();
                    EventBus.$emit('startLoading', loadingId);

                    // Define the URL for camping users or for guests
                    let url;
                    if(self.keyExistsInStore('userId')) {
                        url = self.$apiBaseUrl + "/" + campingId+"/threads?v=" + self.$apiVersion;
                    }
                    else {
                        url = self.$apiBaseUrl + "/" + campingId+"/threads/"+platform.device.uuid + "?v=" + self.$apiVersion
                    }

                    http.getJSON(url).then(result => {

                        // Assign the data
                        if(result.threads){
                            self.threads = result.threads;
                            self.storeObject('threads', self.threads);
                            console.log('threads updated');

                            // Stop the loader
                            EventBus.$emit('stopLoading', loadingId);
                        }

                        // No data found, remove from storage
                        else {
                            self.threads = [];
                            self.removeKeyFromStore('threads');

                            // Stop the loader
                            EventBus.$emit('stopLoading', loadingId);
                        }

                    }, error => {
                        self.threads = [];
                        self.removeKeyFromStore('threads');

                        // Stop the loader
                        EventBus.$emit('stopLoading', loadingId);
                    });
                }
                else {

                    // Get the settings from storage
                    if(self.keyExistsInStore('threads')){
                        self.threads = self.getObjectFromStore('threads');
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
            toConversation: function(id=null) {
                let self = this;

                // Check if this is a guest and the camping has user groups
                if(!self.keyExistsInStore('userId') && self.keyExistsInStore('userGroups')) {

                    // Create a local object for reference
                    // This one has the name as the key
                    let storedUserGroups = self.getObjectFromStore('userGroups');
                    let options = {};
                    storedUserGroups.forEach(function (item, key) {
                        options[item.name] = item.id;
                    });
                    let userGroups = options;

                    // Create an action list
                    options = [];
                    storedUserGroups.forEach(function (item, key) {
                        options.push(item.name);
                    });

                    // Show the action list
                    action(self.$t('threads.userGroupTitle'), self.$t('splash.cancel'), options)
                    .then(selection => {
                        if(selection !== self.$t('splash.cancel')) {

                            // Check if the guest name is set
                            /*if(!self.keyExistsInStore('guestName')) {

                                // Open the WhoAmI modal
                                EventBus.$emit('openModal', {
                                    page: 'whoAmI'
                                });
                            }
                            else {*/

                                // Open the thread modal
                                EventBus.$emit('openModal', {
                                    page: 'thread',
                                    props: {
                                        id: id,
                                        userGroupId: userGroups[selection]
                                    }
                                });
//                            }
                        }
                    });
                }
                else {
                    console.log('no groups');
                    EventBus.$emit('openModal', {
                        page: 'thread',
                        props: {
                            id: id
                        }
                    });
                }
            }
        }
    }
</script>

<style scoped>

</style>