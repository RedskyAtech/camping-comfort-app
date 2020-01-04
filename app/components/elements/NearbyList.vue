<template>
    <ListView for="item in listItems" @itemLoading="onItemLoading">
        <v-template>
            <StackLayout>
                <StackLayout class="row" :class="[{ 'first': $index === 0 }]" @tap="toDetail(item.id)">
                    <GridLayout :height="pageClass === 'lg' || pageClass === 'xl' ? 97 : 65" :rows="pageClass === 'lg' || pageClass === 'xl' ? 97 : 65" :columns="pageClass === 'lg' || pageClass === 'xl' ? '130,*' : '87,*'">
                        <Image col="0" :src="item.image || '~/assets/images/placeholder.gif'"></Image>
                        <StackLayout col="1" orientation="horizontal" class="item-label">
                            <StackLayout verticalAlignment="center">
                                <Label class="item-title" :text="item.title" textWrap="false"></Label>
                                <FlexboxLayout>
                                    <Label class="item-subtitle" :text="localizeNumber(item.distance) + ' km'"></Label>
                                    <!--<StackLayout class="rating-container" verticalAlignment="center">
                                        <StarRating size="25" fillColor="#0a7cf7" outlineColor="#0a7cf7" emptyColor="#d2d2d2" :value="roundRating(item.rating)" />
                                    </StackLayout>-->
                                </FlexboxLayout>
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
    import Numbers from '../mixins/Numbers'
    import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert";
    import Responsive from '../mixins/Responsive'

    export default {
        mixins: [
            Connection,
            LocalStorage,
            Numbers,
            Responsive
        ],
        data() {
            return {
                listItems: []
            }
        },
        props: {
            type: String
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
                    let loadingId = Date.now();
                    EventBus.$emit('startLoading', loadingId);
                    let url = "https://test.campingcomfort.app/api/" + campingId + "/nearby-activities/" + lang + "/" + self.type;
                    getJSON(url).then((r) => {
                        if(r.nearbyActivities){
                            self.listItems = r.nearbyActivities;
                            self.storeObject('nearbyActivities', self.listItems);
                        }
                        else {
                            self.listItems = [];
                            self.removeKeyFromStore('nearbyActivities');
                        }

                        EventBus.$emit('stopLoading', loadingId);
                    }, (e) => {
                        self.listItems = [];
                        self.removeKeyFromStore('nearbyActivities');

                        EventBus.$emit('stopLoading', loadingId);
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
                        tab: 3,
                        page: 'detail',
                        props: {
                            type: 'nearby_activity',
                            id: id
                        }
                    });
                }
            },
            roundRating(rating) {
                let rounded = Math.round(parseFloat(rating));
                return rounded;
            }
        }
    }
</script>

<style scoped>

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
    .item-label {
        font-weight: 400;
        padding: 0 12.5;
    }
    .item-subtitle {
        font-size: 12;
        opacity: 0.6;
    }

    /* Rating */
    .rating-container {
        padding-left: 15;
    }
</style>