<template>
    <Page :class="pageClass" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <GridLayout rows="*" columns="*">
            <ImageSwipe row="0" col="0" :items="items" imageUrlProperty="url" pageNumber="1"></ImageSwipe>
            <Fab verticalAlignment="bottom"><GridLayout rows="*" columns="*" @tap="closeModal"><Label row="0" col="0" class="btn-icon fas" verticalAlignment="center">{{ 'fa-times' | fonticon }}</Label></GridLayout></Fab>
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
                items: []
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
                    if(self.keyExistsInStore('plan')) {
                        self.items = [{url: self.getStringFromStore('plan')}];
                    }

                    // Get the live data
                    http.getJSON("https://www.campingcomfort.app/api/"+campingId+"/content/"+lang).then(result => {

                        // Assign the data
                        if(result.appContent.plan){
                            self.items = [{url: result.appContent.plan}];
                            self.storeString('plan', self.plan);
                        }

                        // No data found, remove from storage
                        else {
                            self.items = [];
                            self.removeKeyFromStore('plan');
                        }

                    }, error => {
                        self.items = [];
                            self.removeKeyFromStore('plan');
                    });
                }
                else {

                    // Get the map from storage
                    if(self.keyExistsInStore('plan')){
                        self.items = [{url: self.getStringFromStore('plan')}];
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