<template>
    <GridLayout rows="*">
        <ListView row="0" for="item in listItems" @itemLoading="onItemLoading">
            <v-template>
                <CardView class="cardStyle" :class="[{ 'first': $index === 0 }]" radius="10" @tap="toDetail(item.id)">
                    <GridLayout rows="auto" columns="75,*">
                        <WebImage col="0" :src="item.image"></WebImage>
                        <StackLayout col="1" orientation="horizontal" class="event-label">
                            <StackLayout verticalAlignment="center">
                                <Label class="event-title" :text="item.title" textWrap="true"></Label>
                                <StackLayout class="event-time" orientation="horizontal">
                                    <Label class="clock far">{{ 'fa-calendar-alt' | fonticon }}</Label>
                                    <StackLayout orientation="horizontal">
                                        <Label :text="humanizeDate(item.date, $t('formatting.date'))"></Label>
                                    </StackLayout>
                                </StackLayout>
                            </StackLayout>
                        </StackLayout>
                    </GridLayout>
                </CardView>
            </v-template>
        </ListView>
        <ResultPlaceHolder row="0" v-if="listItems.length === 0" iconLabelClass="far" iconClass="fa-newspaper" :title="$t('news.emptyTitle')"></ResultPlaceHolder>
    </GridLayout>
</template>

<script>
    import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http";
    import EventBus from '../helpers/EventBus'
    import Connection from '../mixins/Connection'
    import LocalStorage from '../mixins/LocalStorage'
    import Dates from '../mixins/Dates'
    import ResultPlaceHolder from '../elements/ResultPlaceHolder'
    import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert";

    export default {
        components: {
            ResultPlaceHolder
        },
        data() {
            return {
                listItems: []
            }
        },
        mixins: [
            Connection,
            LocalStorage,
            Dates
        ],
        created: function(){
            let self = this;
            self.loadData();

            // Update the News list
            EventBus.$on('updateNews', function() {
                self.loadData();
            });
        },
        methods: {

            // Get the data
            loadData: function(){
                let self = this;
                let campingId = this.getNumberFromStore('campingId');
                let lang = this.getStringFromStore('language');

                if(self.hasInternetConnection()){

                    // Show the cached version first to prevent flickering
                    if(self.keyExistsInStore('newsItems')) {
                        self.listItems = self.getObjectFromStore('newsItems');
                    }

                    // Get the live data
                    let loadingId = Date.now();
                    EventBus.$emit('startLoading', loadingId);
                    getJSON("https://www.campingcomfort.app/api/"+campingId+"/news-items/"+lang).then((r) => {
                        if(r.newsItems){
                            self.listItems = r.newsItems;
                            self.storeObject('newsItems', self.listItems);
                        }
                        else {
                            self.listItems = [];
                            self.removeKeyFromStore('newsItems');
                        }
                        EventBus.$emit('stopLoading', loadingId);
                    }, (e) => {
                        self.listItems = [];
                        self.removeKeyFromStore('newsItems');
                        EventBus.$emit('stopLoading', loadingId);
                    });
                }
                else {
                    if(self.keyExistsInStore('newsItems')){
                        self.listItems = self.getObjectFromStore('newsItems');
                    }
                    else {
                        self.listItems = [];

                        /*setTimeout(function(){
                            TNSFancyAlert.showError(
                                self.$t('errors.offline.title'),
                                self.$t('errors.offline.message'),
                                self.$t('errors.offline.buttonText')
                            );
                        }, 500);*/
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
                    if(self.keyExistsInStore('newsItem_'+id)){
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
                        tab: 1,
                        page: 'detail',
                        props: {
                            type: 'news_item',
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
    .event-label {
        padding: 15 12.5;
    }
    .event-time {
        font-size: 12;
        opacity: 0.6;
    }
    .clock {
        padding-right: 5;
    }
    .event-title {
        padding-bottom: 5;
    }
</style>