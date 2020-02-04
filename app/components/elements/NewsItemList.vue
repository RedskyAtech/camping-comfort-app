<template>
    <GridLayout rows="*">
        <RadListView row="0" for="item in listItems" @itemLoading="onItemLoading">
            <v-template>
                <StackLayout>
                    <StackLayout class="row" :class="[{ 'first': $index === 0 }]" @tap="toDetail(item.id)">
                        <GridLayout :height="pageClass === 'lg' || pageClass === 'xl' ? 97 : 65" :rows="pageClass === 'lg' || pageClass === 'xl' ? 97 : 65" :columns="pageClass === 'lg' || pageClass === 'xl' ? '130,*' : '87,*'">
                            <Image row="0" :src="item.image" borderRadius="5"></Image>
                            <StackLayout col="1" orientation="horizontal" class="event-label">
                                <StackLayout verticalAlignment="center">
                                    <Label class="event-title" :text="item.title" textWrap="false"></Label>
                                    <StackLayout class="event-time" orientation="horizontal">
                                        <Label class="clock far">{{ 'fa-calendar-alt' | fonticon }}</Label>
                                        <StackLayout orientation="horizontal">
                                            <Label :text="humanizeDate(item.date, false)"></Label>
                                        </StackLayout>
                                    </StackLayout>
                                </StackLayout>
                            </StackLayout>
                        </GridLayout>
                    </StackLayout>
                </StackLayout>
            </v-template>
        </RadListView>
        <ResultPlaceHolder row="0" v-if="listItems.length === 0" icon-label-class="far" icon-class="fa-newspaper" :title="$t('news.emptyTitle')"></ResultPlaceHolder>
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
    import Responsive from '../mixins/Responsive'

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
            Dates,
            Responsive
        ],
        beforeDestroy: function() {

            // Destroy any listeners in the event bus
            console.log('Listeners removed: NewsItemList');
            EventBus.$off('updateNews');
        },
        created: function(){
            let self = this;
            self.loadData();

            // Update the News list
            EventBus.$on('updateNews', function() {
                console.log('Listener fired: NewsItemList->updateNews');
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
                    getJSON(self.$apiBaseUrl + "/" + campingId + "/news-items/" + lang + "?v=" + self.$apiVersion).then((r) => {
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
                    EventBus.$emit('openModal', {
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
    .row {
        padding: 0 12.5 12.5 12.5;
    }
    .row.first {
        padding-top: 12.5;
    }
    ListView {
        background-color: #ffffff;
        separator-color: transparent;
    }

    /* Image */
    .row Image {
        stretch: aspectFill;
        border-radius: 5;
    }

    /* Label */
    .event-label {
        padding: 0 12.5;
        font-weight: 400;
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