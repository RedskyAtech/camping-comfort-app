<template>
    <Page :class="pageClass" actionBarHidden="true">
        <GridLayout rows="*" columns="*">
            <WebView row="0" col="0" :src="plan"></WebView>
            <Fab><Label @tap="closeModal" row="0" col="0" class="btn-icon fas" verticalAlignment="center">{{ 'fa-times' | fonticon }}</Label></Fab>
        </GridLayout>
    </Page>
</template>

<script>
    import EventBus from '../helpers/EventBus'
    import Responsive from '../mixins/Responsive'
    import Connection from '../mixins/Connection'
    import Fab from '../elements/Fab'

    export default {
        mixins: [
            Responsive,
            Connection
        ],
        components: {
            Fab: Fab
        },
        data: function(){
            return {
                plan: ''
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
                    http.getJSON("https://www.campingcomfort.app/api/"+campingId+"/content/"+lang).then(result => {

                        // Assign the data
                        if(result.appContent.plan){
                            self.plan = result.appContent.plan;

                            // Store the data
                            self.storeString('plan', self.plan);
                        }

                        // No data found, remove from storage
                        else {
                            self.plan = '';
                            self.removeKeyFromStore('plan');
                        }

                    }, error => {
                        console.log(error);
                    });
                }
                else {

                    // Get the map from storage
                    if(self.keyExistsInStore('plan')){
                        self.plan = self.getStringFromStore('plan');
                    }

                    // Offline with no storage data
                    else {
                        setTimeout(function(){
                            alert({
                                title: "The internet connection appears to be offline",
                                message: "An internet connection is required to display the latest content. Please activate your internet connection.",
                                okButtonText: "OK"
                            }).then(() => {
                                exit();
                            });
                        }, 1500);
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
</style>