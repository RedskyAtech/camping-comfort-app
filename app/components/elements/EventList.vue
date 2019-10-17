<template>
    <GridLayout rows="*">
        <ListView row="0" for="item in listItems" @itemLoading="onItemLoading">
            <v-template>
                <StackLayout>
                    <StackLayout class="row" :class="[{ 'first': $index === 0 }]" @tap="toDetail(item.id)">
                        <GridLayout rows="65" columns="87,*">
                            <Image col="0" :src="item.image"></Image>
                            <StackLayout col="1" orientation="horizontal" class="event-label">
                                <StackLayout verticalAlignment="center">
                                    <StackLayout class="event-time" orientation="horizontal">
                                        <Label class="clock far">{{ 'fa-clock' | fonticon }}</Label>
                                        <StackLayout orientation="horizontal" v-if="item.is_all_day === false">
                                            <Label :text="'2000-01-01 '+item.start_time | moment($t('formatting.time'))"></Label>
                                            <Label text=" - "></Label>
                                            <Label :text="'2000-01-01 '+item.end_time | moment($t('formatting.time'))"></Label>
                                        </StackLayout>
                                        <StackLayout v-else>
                                            <Label :text="$t('general.allDay')"></Label>
                                        </StackLayout>
                                    </StackLayout>
                                    <Label class="event-title" :text="item.title"></Label>
                                </StackLayout>
                            </StackLayout>
                        </GridLayout>
                    </StackLayout>
                </StackLayout>
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
                    let loadingId = Date.now();
                    EventBus.$emit('startLoading', loadingId);
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

                        EventBus.$emit('stopLoading', loadingId);
                    }, (e) => {
                        self.listItems = [];
                        self.removeKeyFromStore('campingActivities_'+formattedDate);

                        EventBus.$emit('stopLoading', loadingId);
                    });
                }
                else {
                    if(self.keyExistsInStore('campingActivities_'+formattedDate)){
                        self.listItems = self.getObjectFromStore('campingActivities_'+formattedDate);
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
                    if(self.keyExistsInStore('campingActivity_'+id)){
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