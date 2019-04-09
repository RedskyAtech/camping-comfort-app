<template>
    <GridLayout rows="*">
        <ListView row="0" for="item in listItems" @itemLoading="onItemLoading" rowHeight="75">
            <v-template>
                <CardView class="cardStyle" :class="[{ 'first': $index === 0 }]" radius="10" @tap="toDetail(item.id)">
                    <GridLayout rows="75" columns="75,*">
                        <WebImage col="0" :src="item.image"></WebImage>
                        <StackLayout col="1" orientation="horizontal" class="event-label">
                            <StackLayout verticalAlignment="center">
                                <StackLayout class="event-time" orientation="horizontal">
                                    <Label class="clock fa">{{ 'fa-clock' | fonticon }}</Label>
                                    <StackLayout orientation="horizontal">
                                        <Label :text="'2000-01-01 '+item.start_time | moment($t('formatting.time'))"></Label>
                                        <Label text=" - "></Label>
                                        <Label :text="'2000-01-01 '+item.end_time | moment($t('formatting.time'))"></Label>
                                    </StackLayout>
                                </StackLayout>
                                <Label class="event-title" :text="item.title"></Label>
                            </StackLayout>
                        </StackLayout>
                    </GridLayout>
                </CardView>
            </v-template>
        </ListView>
        <ResultPlaceHolder v-if="listItems.length === 0" row="0" iconLabelClass="fas" iconClass="fa-calendar-alt" :title="$t('activities.emptyTitle')" :text="$t('activities.emptyText')"></ResultPlaceHolder>
    </GridLayout>
</template>

<script>
    import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http";
    import EventBus from '../helpers/EventBus'
    import Connection from '../mixins/Connection'
    import LocalStorage from '../mixins/LocalStorage'
    import ResultPlaceHolder from '../elements/ResultPlaceHolder'

    export default {
        components: {
            ResultPlaceHolder
        },
        data() {
            return {
                listItems: []
            }
        },
        props: {
            date: ''
        },
        mixins: [
            Connection,
            LocalStorage
        ],
        created: function(){
            let self = this;
            self.loadData(this.date);
            EventBus.$on('reInit', function(){
                self.loadData(self.date);
            });
        },
        watch: {
            date: function(val) {
                this.loadData(val);
            }
        },
        methods: {

            // Get the data
            loadData: function(date){
                let self = this;
                let campingId = this.getNumberFromStore('campingId');
                let lang = this.getStringFromStore('language');
                let formattedDate = date.format('YYYY-MM-DD');

                if(self.hasInternetConnection()){

                    // Show the cached version first to prevent flickering
                    if(self.keyExistsInStore('campingActivities_'+formattedDate)) {
                        self.listItems = self.getObjectFromStore('campingActivities_'+formattedDate);
                    }

                    // Get the live data
                    let url = "https://www.campingcomfort.app/api/"+campingId+"/camping-activities/"+formattedDate+"/"+lang;
                    getJSON(url).then((r) => {
                        if(r.campingActivities){
                            self.listItems = r.campingActivities;
                            self.storeObject('campingActivities_'+formattedDate, self.listItems);
                        }
                        else {
                            self.listItems = [];
                            self.removeKeyFromStore('campingActivities_'+formattedDate);
                        }
                    }, (e) => {
                        self.listItems = [];
                        self.removeKeyFromStore('campingActivities_'+formattedDate);
                    });
                }
                else {
                    if(self.keyExistsInStore('campingActivities_'+formattedDate)){
                        self.listItems = self.getObjectFromStore('campingActivities_'+formattedDate);
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
            toDetail: function(id){
                let self = this;
                if(self.hasInternetConnection()){
                    navigate(id);
                }
                else {
                    if(self.keyExistsInStore('campingActivity_'+id)){
                        navigate(id);
                    }
                    else {
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

                /**
                 * Emit a navigate event
                 *
                 * @param id
                 */
                function navigate(id){
                    EventBus.$emit('navigate', {
                        tab: 4,
                        page: 'detail',
                        props: {
                            type: 'camping_activity',
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
        padding: 0 12.5;
    }
    .event-time {
        font-size: 12;
        opacity: 0.6;
    }
    .clock {
        padding-right: 5;
    }
    .event-title {
        padding-top: 5;
    }
</style>