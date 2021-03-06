<template>
    <GridLayout rows="*">
        <RadListView row="0" for="item in filteredListItems" @itemLoading="onItemLoading">
            <v-template>
                <StackLayout>
                    <StackLayout class="row" :class="[{ 'first': $index === 0 }]" @tap="toDetail(item.id)">
                        <GridLayout :height="innerPageClass === 'lg' || innerPageClass === 'xl' ? 97 : 65" :rows="innerPageClass === 'lg' || innerPageClass === 'xl' ? 97 : 65" :columns="innerPageClass === 'lg' || innerPageClass === 'xl' ? '130,*' : '87,*'">
                            <Image col="0" :src="item.image"></Image>
                            <StackLayout col="1" orientation="horizontal" class="event-label">
                                <StackLayout verticalAlignment="center">
                                    <StackLayout class="event-time" orientation="horizontal">
                                        <Label class="clock far" v-if="$moment(item.start_date).format('YYYY-MM-DD') === $moment().format('YYYY-MM-DD')">{{ 'fa-clock' | fonticon }}</Label>
                                        <Label class="clock far" v-else>{{ 'fa-calendar-alt' | fonticon }}</Label>
                                        <StackLayout orientation="horizontal" v-if="item.is_all_day === false">
                                            <Label :text="startDateTime(item.start_date, item.start_time)"></Label>
                                            <Label text=" - "></Label>
                                            <Label :text="'2000-01-01 '+item.end_time | moment($t('formatting.time'))"></Label>
                                        </StackLayout>
                                        <StackLayout v-else>
                                            <Label :text="allDayEventDay(item)"></Label>
                                        </StackLayout>
                                    </StackLayout>
                                    <Label class="event-title" :text="item.title" textWrap="false"></Label>
                                </StackLayout>
                            </StackLayout>
                        </GridLayout>
                    </StackLayout>
                </StackLayout>
            </v-template>
        </RadListView>
        <ResultPlaceHolder row="0" v-if="filteredListItems.length === 0" icon-label-class="far" icon-class="fa-heart" :title="$t('myVacation.emptyTitle')" :text="$t('myVacation.emptyText')"></ResultPlaceHolder>
    </GridLayout>
</template>

<script>
    import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http";
    import EventBus from '../helpers/EventBus'
    import Connection from '../mixins/Connection'
    import LocalStorage from '../mixins/LocalStorage'
    import Likes from '../mixins/Likes'
    import Dates from '../mixins/Dates'
    import ResultPlaceHolder from '../elements/ResultPlaceHolder'
    import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert";

    export default {
        components: {
            ResultPlaceHolder
        },
        props: {
            innerPageClass: ''
        },
        data() {
            return {
                listItems: []
            }
        },
        computed: {

            /**
             * Filter the activities to only the liked activities
             */
            filteredListItems: function() {
                let likes = this.getLikes();
                let filteredListItems = [];
                this.listItems.forEach(function (listItem) {
                    if(likes[listItem.id]){
                        filteredListItems.push(listItem);
                    }
                });

                return filteredListItems;
            }
        },
        mixins: [
            Connection,
            LocalStorage,
            Likes,
            Dates
        ],
        beforeDestroy: function() {

            // Destroy any listeners in the event bus
            console.log('Listeners removed: MyVacationList');
            EventBus.$off('updateMyVacation');

        },
        created: function(){
            let self = this;
            self.loadData();

            // Update the My Vacation list
            EventBus.$on('updateMyVacation', function() {
                console.log('Listener fired: MyVacationList->updateMyVacation');
                self.loadData();
            });
        },
        methods: {

            /**
             * Humanize the day string of an all day event
             *
             * @param item
             * @returns {string}
             */
            allDayEventDay(item) {
                let startDate = this.$moment(item.start_date);
                startDate.set('hour', 0);
                startDate.set('minute', 0);
                startDate.set('second', 0);
                startDate.set('millisecond', 0);

                let today = this.$moment();
                today.set('hour', 0);
                today.set('minute', 0);
                today.set('second', 0);
                today.set('millisecond', 0);

                let str = '';
                if(startDate <= today) {
                    str += this.humanizeDate(today.format('YYYY-MM-DD'), false);
                }
                else {
                    str += this.humanizeDate(startDate.format('YYYY-MM-DD'), false);
                }
                str += ' - '+this.$t('general.allDay');

                return str;
            },

            /**
             * Humanize the starting date
             *
             * @param startDate
             * @param startTime
             * @returns {string}
             */
            startDateTime: function(startDate, startTime) {
                return this.humanizeDate(startDate+' '+startTime);
            },

            // Get the data
            loadData: function(){
                let self = this;
                let campingId = this.getNumberFromStore('campingId');
                let lang = this.getStringFromStore('language');

                if(self.hasInternetConnection()){

                    // Show the cached version first to prevent flickering
                    if(self.keyExistsInStore('campingActivities')) {
                        self.listItems = self.getObjectFromStore('campingActivities');
                    }

                    // Get the likes
                    let likes = this.getLikes();
                    let likeIds = [];
                    for (let [id, value] of Object.entries(likes)) {
                        likeIds.push(parseInt(id));
                    }

                    // Get the data
                    let data = JSON.stringify({
                        likes: likeIds,
                        v: self.$apiVersion
                    });
                    let loadingId = Date.now();
                    EventBus.$emit('startLoading', loadingId);
                    let url = self.$apiBaseUrl + "/" + campingId + "/camping-activities/1111-11-11/" + lang;
                    request({
                        url: url,
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        content: data
                    }).then((response) => {

                        // Convert the response to JSON
                        let r = response.content.toJSON();

                        // Handle the response
                        if(r.campingActivities){
                            self.listItems = r.campingActivities;
                            self.storeObject('campingActivities', self.listItems);
                        }
                        else {
                            self.listItems = [];
                            self.removeKeyFromStore('campingActivities');
                        }
                        EventBus.$emit('stopLoading', loadingId);
                    }, (e) => {
                        self.listItems = [];
                        self.removeKeyFromStore('campingActivities');
                        EventBus.$emit('stopLoading', loadingId);
                    });
                }
                else {
                    if(self.keyExistsInStore('campingActivities')){
                        self.listItems = self.getObjectFromStore('campingActivities');
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
                    EventBus.$emit('openModal', {
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
        border-radius: 6;
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

    /* Tag */
    .tag {
        border-width: 1;
        border-radius: 100%;
        background-color: #8f99ac;
        border-color: #8f99ac;
        margin: 0 4 15 0;
        padding: 4 8;
        font-weight: 500;
        color: #ffffff;
        font-size: 11;
    }
</style>