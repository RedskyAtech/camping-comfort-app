<template>
    <Page :class="pageClass" actionBarHidden="true">
        <GridLayout rows="*" columns="*">
            <WebView row="0" col="0" src="https://www.campingcomfort.app/img/app/map.png"></WebView>
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
                map: ''
            }
        },
        methods: {
            init: function(){
                let self = this;

                // The camping name is stored when a camping is selected
                this.map = this.getStringFromStore('map');

                // Get the data from the api (internet) or local storage (offline)
                if(this.hasInternetConnection()){
                    http.getJSON("https://www.campingcomfort.app/api/9665/content/nl").then(result => {

                        // Assign the data
                        if(result.appContent.map){
                            self.map = result.appContent.map;
                        }
                        else {
                            self.map = '~/assets/images/placeholder.jpg';
                        }

                        // Store the data
                        self.storeString('map', self.map);
                    }, error => {
                        console.log(error);
                    });
                }
                else {
                    if(self.keyExistsInStore('map')){
                        self.map = self.getStringFromStore('map');
                    }

                    // Offline with no cached data
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