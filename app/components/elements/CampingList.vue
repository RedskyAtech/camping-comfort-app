<template>
    <ListView for="item in listItems" @itemLoading="onItemLoading">
        <v-template if="$index === 0">
            <StackLayout>
                <StackLayout class="btn-container" horizontalAlignment="left">
                    <StackLayout class="btn wifi-btn" @tap="toWifi">
                        <Label class="btn-icon fas" verticalAlignment="center">{{ 'fa-wifi' | fonticon }}</Label>
                    </StackLayout>
                    <StackLayout class="btn shopping-btn" @tap="toShopping">
                        <Label class="btn-icon fas" verticalAlignment="center">{{ 'fa-shopping-basket' | fonticon }}</Label>
                    </StackLayout>
                    <StackLayout class="btn map-btn" @tap="toMap" v-if="plan">
                        <Label class="btn-icon far" verticalAlignment="center">{{ 'fa-map' | fonticon }}</Label>
                        <Label class="btn-text" :text="$t('home.map')" verticalAlignment="center"></Label>
                    </StackLayout>
                </StackLayout>
                <StackLayout class="row" :class="[{ 'first': $index === 0 }]" @tap="toDetail(item.id)">
                    <GridLayout rows="65" columns="87,*">
                        <Image col="0" :src="item.image"></Image>
                        <StackLayout col="1" orientation="horizontal" class="event-label">
                            <StackLayout verticalAlignment="center">
                                <Label class="event-title" :text="item.title"></Label>
                            </StackLayout>
                        </StackLayout>
                    </GridLayout>
                </StackLayout>
            </StackLayout>
        </v-template>
        <v-template else>
            <StackLayout>
                <StackLayout class="row" :class="[{ 'first': $index === 0 }]" @tap="toDetail(item.id)">
                    <GridLayout rows="65" columns="87,*">
                        <Image col="0" :src="item.image" stretch="aspectFill"></Image>
                        <StackLayout col="1" orientation="horizontal" class="event-label">
                            <StackLayout verticalAlignment="center">
                                <Label class="event-title" :text="item.title"></Label>
                            </StackLayout>
                        </StackLayout>
                    </GridLayout>
                </StackLayout>
            </StackLayout>
        </v-template>
    </ListView>
</template>

<script>
    import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http";
    import EventBus from '../helpers/EventBus'
    import Connection from '../mixins/Connection'
    import LocalStorage from '../mixins/LocalStorage'
    import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert";

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

                    // Show the cached version first to prevent flickering
                    if(self.keyExistsInStore('plan')) {
                        self.plan = self.getStringFromStore('plan');
                    }

                    // Get the live data
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
                        self.plan = '';
                        self.removeKeyFromStore('plan');
                    });
                }
                else {
                    if(self.keyExistsInStore('plan')){
                        self.plan = self.getStringFromStore('plan');
                    }
                    else {
                        self.plan = '';

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

            // Get the list data
            loadListData: function(){
                let self = this;
                let campingId = this.getNumberFromStore('campingId');
                let lang = this.getStringFromStore('language');

                if(this.hasInternetConnection()) {

                    // Show the cached version first to prevent flickering
                    if(self.keyExistsInStore('campingFacilities')) {
                        self.listItems = self.getObjectFromStore('campingFacilities');
                    }

                    // Get the live data
                    let loadingId = Date.now();
                    EventBus.$emit('startLoading', loadingId);
                    getJSON("https://www.campingcomfort.app/api/" + campingId + "/camping-facilities/" + lang).then((r) => {
                        if(r.campingFacilities){
                            self.listItems = r.campingFacilities;
                            self.storeObject('campingFacilities', self.listItems);
                        }
                        else {
                            self.listItems = [];
                            self.removeKeyFromStore('campingFacilities');
                        }

                        // Hide the loader
                        EventBus.$emit('stopLoading', loadingId);
                    }, (e) => {
                        self.listItems = [];
                        self.removeKeyFromStore('campingFacilities');

                        // Hide the loader
                        EventBus.$emit('stopLoading', loadingId);
                    });
                }
                else {
                    if(self.keyExistsInStore('campingFacilities')){
                        self.listItems = self.getObjectFromStore('campingFacilities');
                    }
                    else {
                        self.listItems = [];

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
            toShopping: function(){
                let self = this;
                TNSFancyAlert.showInfo(
                    self.$t('shopping.alert.title'),
                    self.$t('shopping.alert.message'),
                    self.$t('shopping.alert.buttonText')
                );
            },
            toMap: function(){
                let self = this;
                if(self.hasInternetConnection()) {
                    EventBus.$emit('openModal', {
                        page: 'map'
                    });
                }
                else {
                    TNSFancyAlert.showError(
                        self.$t('errors.offline.title'),
                        self.$t('errors.offline.message'),
                        self.$t('errors.offline.buttonText')
                    );
                }
            },
            toDetail: function(id){
                let self = this;
                if(self.hasInternetConnection()){
                    navigate(id);
                }
                else {
                    if(self.keyExistsInStore('campingFacility_'+id)){
                        navigate(id);
                    }
                    else {
                        TNSFancyAlert.showError(
                            self.$t('errors.offline.title'),
                            self.$t('errors.offline.message'),
                            self.$t('errors.offline.buttonText')
                        );
                    }
                }

                /**
                 * Emit a navigate event
                 *
                 * @param id
                 */
                function navigate(id){
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
    }
</script>

<style scoped>

    /* Buttons */
    .btn-container {
        orientation: horizontal;
        padding: 12.5 0 0 0;
    }
    .btn-container .btn {
        margin-bottom: 12.5;
    }
    .wifi-btn {
        margin-left: 12.5;
    }
    .shopping-btn {
        margin-left: 5;
    }
    .map-btn {
        margin-left: 5;
    }
    Page.xxs .map-btn .btn-text,
    Page.xs .map-btn .btn-text {
        visibility: collapsed;
    }

    /* List view */
    .row {
        margin: 0 12.5 12.5 12.5;
    }
    .row.first {
        margin-top: 12.5;
    }
    ListView {
        background-color: #ffffff;
        separator-color: transparent;
    }

    /* Image */
    .row Image {
        border-radius: 5;
        stretch: aspectFill;
    }

    /* Label */
    .event-label {
        padding: 0 12.5;
        font-weight: 400;
    }
</style>