<template>
    <Page :class="pageClass" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <GridLayout rows="*" columns="*" width="100%" height="100%">
            <WebView row="0" col="0" :src="map"></WebView>
            <Fab verticalAlignment="bottom" borderColor="#e5e5e5"><GridLayout rows="*" columns="*" @tap="closeModal"><StackLayout row="0" col="0" verticalAlignment="center"><Label class="btn-icon fas">{{ 'fa-times' | fonticon }}</Label></StackLayout></GridLayout></Fab>
        </GridLayout>
    </Page>
</template>

<script>
    import * as http from 'http'
    import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http";
    import EventBus from '../helpers/EventBus'
    import Responsive from '../mixins/Responsive'
    import Connection from '../mixins/Connection'
    import Fab from '../elements/Fab'
    import LocalStorage from '../mixins/LocalStorage'
    import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert";

    export default {
        mixins: [
            Responsive,
            Connection,
            LocalStorage
        ],
        components: {
            Fab: Fab
        },
        data: function(){
            return {
                'map':''
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
                    if(self.keyExistsInStore('map')) {
                        self.map = self.getStringFromStore('map');
                    }

                    // Get the live data
                    http.getJSON("https://www.campingcomfort.app/api/"+campingId+"/content/"+lang).then(result => {

                        // Assign the data
                        if(result.appContent.map){
                            self.map = result.appContent.map;
                            self.storeString('map', self.map);
                        }

                        // No data found, remove from storage
                        else {
                            self.map = '';
                            self.removeKeyFromStore('map');
                        }
                    }, error => {
                        self.map = '';
                        self.removeKeyFromStore('map');
                    });
                }
                else {

                    // Get the map from storage
                    if(self.keyExistsInStore('map')){
                        self.map = self.getStringFromStore('map');
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
    ImageSwipe {
        background: #fff;
    }
</style>