<template>
    <ListView for="item in listItems" @itemLoading="onItemLoading">
        <v-template if="$index === 0">
            <StackLayout>
                <StackLayout class="btn-container">
                    <StackLayout class="btn wifi-btn" v-if="connectionType !== 'wifi'" @tap="toWifi">
                        <Label class="btn-icon fas" verticalAlignment="center">{{ 'fa-wifi' | fonticon }}</Label>
                    </StackLayout>
                    <StackLayout class="btn contact-btn" @tap="toMap" v-if="plan">
                        <Label class="btn-icon fa" verticalAlignment="center">{{ 'fa-map' | fonticon }}</Label>
                        <Label class="btn-text" :text="$t('home.map')" verticalAlignment="center"></Label>
                    </StackLayout>
                </StackLayout>

                <CardView class="cardStyle" radius="10" @tap="toDetail(item.id)">
                    <GridLayout rows="75" columns="75,*">
                        <Image col="0" :src="item.image"></Image>
                        <StackLayout col="1" orientation="horizontal">
                            <StackLayout class="event-label" verticalAlignment="center">
                                <Label class="event-title" :text="item.title"></Label>
                            </StackLayout>
                        </StackLayout>
                    </GridLayout>
                </CardView>
            </StackLayout>
        </v-template>
        <v-template else>
            <CardView class="cardStyle" radius="10" @tap="toDetail(item.id)">
                <GridLayout rows="75" columns="75,*">
                    <Image col="0" :src="item.image"></Image>
                    <StackLayout col="1" orientation="horizontal">
                        <StackLayout class="event-label" verticalAlignment="center">
                            <Label class="event-title" :text="item.title"></Label>
                        </StackLayout>
                    </StackLayout>
                </GridLayout>
            </CardView>
        </v-template>
    </ListView>
</template>

<script>
    import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http";
    import EventBus from '../helpers/EventBus'
    import Connection from '../mixins/Connection'
    import LocalStorage from '../mixins/LocalStorage'

    export default {
        data() {
            return {
                plan: '',
                listItems: []
            }
        },
        mixins: [
            Connection,
            LocalStorage
        ],
        created: function(){
            this.loadMapData();
            this.loadListData();
        },
        methods: {

            // Load the map
            loadMapData(){
                let self = this;

                // Get the data from the api (internet) or local storage (offline)
                let campingId = this.getNumberFromStore('campingId');
                let lang = this.getStringFromStore('language');
                if(this.hasInternetConnection()){
                    getJSON("https://www.campingcomfort.app/api/"+campingId+"/content/"+lang).then(result => {

                        // Assign and store the map
                        if(result.appContent.plan){
                            self.plan = result.appContent.plan;
                            self.storeString('plan', self.plan);
                        }
                        else {
                            self.plan = '';
                            self.removeKeyFromStore('plan');
                        }
                    }, error => {
                        console.log(error);
                    });
                }
                else {
                    if(self.keyExistsInStore('plan')){
                        self.plan = self.getStringFromStore('plan');
                    }
                    else {
                        self.plan = '';

                        setTimeout(function(){
                            alert({
                                title: self.$t('errors.offline.title'),
                                message: self.$t('errors.offline.message'),
                                okButtonText: self.$t('errors.offline.buttonText')
                            }).then(() => {
                            });
                        }, 500);
                    }
                }
            },

            // Get the list data
            loadListData: function(){
                let self = this;
                let campingId = this.getNumberFromStore('campingId');
                let lang = this.getStringFromStore('language');

                if(this.hasInternetConnection()) {
                    getJSON("https://www.campingcomfort.app/api/" + campingId + "/camping-facilities/" + lang).then((r) => {
                        if(r.campingFacilities){
                            self.listItems = r.campingFacilities;
                            self.storeObject('campingFacilities', self.listItems);
                        }
                        else {
                            self.listItems = [];
                            self.removeKeyFromStore('campingFacilities');
                        }
                    }, (e) => {
                    });
                }
                else {
                    if(self.keyExistsInStore('campingFacilities')){
                        self.listItems = self.getObjectFromStore('campingFacilities');
                    }
                    else {
                        self.listItems = [];

                        setTimeout(function(){
                            alert({
                                title: self.$t('errors.offline.title'),
                                message: self.$t('errors.offline.message'),
                                okButtonText: self.$t('errors.offline.buttonText')
                            }).then(() => {
                            });
                        }, 500);
                    }
                }
            },

            // Remove the grey highlight on tapping a ListView item
            onItemLoading: function(args) {
                const cell = args.ios;
                if (cell) {
                    cell.selectionStyle = UITableViewCellSelectionStyle.UITableViewCellSelectionStyleNone;
                }
            },
            toWifi: function(){
                EventBus.$emit('openModal', {
                    page: 'wifi'
                });
            },
            toMap: function(){
                EventBus.$emit('openModal', {
                    page: 'map'
                });
            },
            toDetail: function(id){
                EventBus.$emit('navigate', {
                    tab: 2,
                    page: 'detail',
                    props: {
                        type: 'camping_facility',
                        id: id
                    }
                });
            }
        }
    }
</script>

<style scoped>

    /* Buttons */
    .btn-container {
        orientation: horizontal;
        padding: 12.5 12.5 0 12.5;
    }
    .btn-container .btn {
        margin-bottom: 12.5;
    }
    .contact-btn {
        margin-left: 5;
    }

    /* List view */
    .cardStyle {
        background-color: #fff;
        margin: 0 12.5 12.5 12.5;
    }
    ListView {
        background-color: #f5f5f8;
        separator-color: transparent;
    }

    /* Image */
    .cardStyle Image {
        border-top-left-radius: 10;
        border-bottom-left-radius: 10;
        stretch: aspectFill;
    }

    /* Label */
    .event-label {
        padding: 0 12.5;
    }
</style>