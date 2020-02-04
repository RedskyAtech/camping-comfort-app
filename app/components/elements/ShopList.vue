<template>
    <RadListView for="item in listItems" @itemLoading="onItemLoading">
        <v-template if="$index === 0">
            <StackLayout>
                <StackLayout class="intro">
                    <Label class="title" textWrap="true" text="Nog heel even geduld..."></Label>
                    <Label textWrap="true" text="De functie om broodjes te bestellen zal binnenkort beschikbaar zijn."></Label>
                </StackLayout>
                <ShopListItem :index="$index" :item="item" v-on:amount-updated="updateOrder"></ShopListItem>
            </StackLayout>
        </v-template>
        <v-template else>
            <StackLayout>
                <ShopListItem :index="$index" :item="item" v-on:amount-updated="updateOrder"></ShopListItem>
            </StackLayout>
        </v-template>
    </RadListView>
</template>

<script>
    import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http"
    import EventBus from '../helpers/EventBus'
    import Connection from '../mixins/Connection'
    import LocalStorage from '../mixins/LocalStorage'
    import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert"
    import ShopListItem from './ShopListItem'

    export default {
        data() {
            return {
                order: {},
                listItems: [
                    {
                        id: 0,
                        title: 'Kaiserbroodje',
                        subTitle: '',
                        price: 0.50
                    },
                    {
                        id: 1,
                        title: 'Pistolet Wit',
                        subTitle: '',
                        price: 0.60
                    },
                    {
                        id: 2,
                        title: 'Pistolet Bruin',
                        subTitle: '',
                        price: 0.70
                    },
                    {
                        id: 3,
                        title: 'Ruitbroodje Volkoren',
                        subTitle: '',
                        price: 0.90
                    },
                    {
                        id: 4,
                        title: 'Croissant Roomboter',
                        subTitle: '',
                        price: 0.90
                    },
                    {
                        id: 5,
                        title: 'Baguette',
                        subTitle: 'Frans stokbrood',
                        price: 1.40
                    },
                    {
                        id: 6,
                        title: 'Pain au Chocolat',
                        subTitle: 'Chocoladebroodje',
                        price: 1.00
                    }
                ]
            }
        },
        mixins: [
            Connection,
            LocalStorage
        ],
        components: {
            ShopListItem
        },
        created: function(){
            this.loadListData();
        },
        methods: {

            updateOrder: function(data) {

                // Get the id
                let id = this.listItems[data.index].id;

                // Update the item amount
                if(data.amount === 0) {
                    delete this.order[id];
                } else {
                    this.order[id] = {
                        title: this.listItems[data.index].title,
                        price: this.listItems[data.index].price,
                        amount: data.amount
                    };
                }

                // Emit the order
                this.$emit('order-updated', this.order);
            },

            // Get the list data
            loadListData: function(){
                let self = this;
                let campingId = this.getNumberFromStore('campingId');
                let lang = this.getStringFromStore('language');

                /*if(this.hasInternetConnection()) {

                    // Show the cached version first to prevent flickering
                    if(self.keyExistsInStore('campingFacilities')) {
                        self.listItems = self.getObjectFromStore('campingFacilities');
                    }

                    // Get the live data
                    let loadingId = Date.now();
                    EventBus.$emit('startLoading', loadingId);
                    getJSON(self.$apiBaseUrl + "/" + campingId + "/camping-facilities/" + lang + "?v=" + self.$apiVersion).then((r) => {
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
                }*/
            },

            // Remove the grey highlight on tapping a ListView item
            onItemLoading: function(args) {
                const cell = args.ios;
                if (cell) {
                    cell.selectionStyle = UITableViewCellSelectionStyle.UITableViewCellSelectionStyleNone;
                }
            },
        }
    }
</script>

<style scoped>

    /* List view */
    ListView {
        background-color: #ffffff;
        separator-color: #e5e5e5;
    }

    /* Intro */
    .intro {
        margin: 25 25 15 25;
        padding: 12.5 18.75;
        border-width: 1;
        border-color: rgba(0,112,218,0.25);
        border-radius: 3;
        background-color: rgba(0,112,218,0.1);
        font-size: 14;
    }
    .intro .title {
        font-size: 16;
        font-weight: 700;
        padding-bottom: 5;
    }
</style>