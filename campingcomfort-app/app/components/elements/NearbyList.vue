<template>
    <ListView for="item in listItems" @itemLoading="onItemLoading">
        <v-template>
            <CardView class="cardStyle" :class="[{ 'first': $index === 0 }]" radius="10" @tap="toDetail(item.id)">
                <GridLayout rows="75" columns="75,*">
                    <WebImage col="0" :src="item.image"></WebImage>
                    <StackLayout col="1" orientation="horizontal" class="item-label">
                        <StackLayout verticalAlignment="center">
                            <Label class="item-title" :text="item.title"></Label>
                            <Label class="item-subtitle" :text="item.subtitle"></Label>
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
    import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert";

    export default {
        mixins: [
            Connection,
            LocalStorage
        ],
        data() {
            return {
                listItems: []
            }
        },
        created: function(){
            this.loadData();
        },
        methods: {

            // Get the data
            loadData: function(){
                let self = this;
                let campingId = this.getNumberFromStore('campingId');
                let lang = this.getStringFromStore('language');

                if(self.hasInternetConnection()) {

                    // Show the cached version first to prevent flickering
                    if(self.keyExistsInStore('nearbyActivities')) {
                        self.listItems = self.getObjectFromStore('nearbyActivities');
                    }

                    // Get the live data
                    getJSON("https://www.campingcomfort.app/api/" + campingId + "/nearby-activities/" + lang).then((r) => {
                        if(r.nearbyActivities){
                            self.listItems = r.nearbyActivities;
                            self.storeObject('nearbyActivities', self.listItems);
                        }
                        else {
                            self.listItems = [];
                            self.removeKeyFromStore('nearbyActivities');
                        }
                    }, (e) => {
                        self.listItems = [];
                        self.removeKeyFromStore('nearbyActivities');
                    });
                }
                else {
                    if(self.keyExistsInStore('nearbyActivities')){
                        self.listItems = self.getObjectFromStore('nearbyActivities');
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
            toDetail: function(id){
                let self = this;
                if(self.hasInternetConnection()){
                    navigate(id);
                }
                else {
                    if(self.keyExistsInStore('nearbyActivity_'+id)){
                        navigate(id);
                    }
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

                /**
                 * Emit a navigate event
                 *
                 * @param id
                 */
                function navigate(id){
                    EventBus.$emit('navigate', {
                        tab: 3,
                        page: 'detail',
                        props: {
                            type: 'nearby_activity',
                            id: id
                        }
                    });
                }
            }
        }
    }
</script>

<style scoped>

    /* List view */
    .cardStyle {
        background-color: #fff;
        margin: 0 12.5 12.5 12.5;
    }
    .cardStyle.first {
        margin-top: 12.5;
    }
    ListView {
        background-color: #f5f5f8;
        separator-color: transparent;
    }

    /* Image */
    .cardStyle WebImage {
        border-top-left-radius: 10;
        border-bottom-left-radius: 10;
        stretch: aspectFill;
    }

    /* Label */
    .item-label {
        padding: 0 12.5;
    }
    .item-subtitle {
        font-size: 12;
        opacity: 0.6;
    }
</style>