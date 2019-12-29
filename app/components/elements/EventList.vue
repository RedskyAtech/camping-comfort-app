<template>
    <GridLayout rows="*,auto">
        <ListView row="0" for="item in listItems" @itemLoading="onItemLoading" :key="listViewKey">
            <v-template>
                <StackLayout>
                    <StackLayout v-if="filters[item.type] === true" class="row" @tap="toDetail(item.id)">
                        <GridLayout :height="pageClass === 'lg' || pageClass === 'xl' ? 97 : 65" :rows="pageClass === 'lg' || pageClass === 'xl' ? 97 : 65" :columns="pageClass === 'lg' || pageClass === 'xl' ? '130,*,auto' : '87,*,auto'">
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
                                    <Label class="event-title" :text="item.title" textWrap="false"></Label>
                                </StackLayout>
                            </StackLayout>
                            <StackLayout col="2" verticalAlignment="center">
                                <Label v-if="item.type === 'camping'" class="type-icon camping fas">{{ 'fa-circle' | fonticon }}</Label>
                                <Label v-if="item.type === 'nearby'" class="type-icon nearby fas">{{ 'fa-circle' | fonticon }}</Label>
                            </StackLayout>
                        </GridLayout>
                    </StackLayout>
                </StackLayout>
            </v-template>
        </ListView>
        <ResultPlaceHolder v-if="listItems.length === 0" row="0" icon-label-class="fas" icon-class="fa-calendar-alt" :title="$t('activities.emptyTitle')" :text="$t('activities.emptyText')"></ResultPlaceHolder>
        <StackLayout row="1" orientation="horizontal" horizontalAlignment="center">
            <Label class="tag camping" :class="filters.camping ? 'active' : ''" :text="$t('activities.onTheCampsite')" @tap="toggleFilter('camping')"></Label>
            <Label class="tag nearby" :class="filters.nearby ? 'active' : ''" :text="$t('activities.nearby')" @tap="toggleFilter('nearby')"></Label>
        </StackLayout>
    </GridLayout>
</template>

<script>
    import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http";
    import EventBus from '../helpers/EventBus'
    import Connection from '../mixins/Connection'
    import LocalStorage from '../mixins/LocalStorage'
    import ResultPlaceHolder from '../elements/ResultPlaceHolder'
    import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert";
    import Responsive from '../mixins/Responsive'

    export default {
        components: {
            ResultPlaceHolder
        },
        data() {
            return {
                listItems: [],
                listViewKey: 0,
                filters: {
                    camping: true,
                    nearby: true
                }
            }
        },
        props: {
            date: '',
            updateKey: null
        },
        mixins: [
            Connection,
            LocalStorage,
            Responsive
        ],
        created: function(){
            let self = this;
            self.loadData(this.date);
        },
        watch: {
            updateKey: function() {
                this.loadData(this.date);
            },
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
            },

            // Toggle the tag filter
            toggleFilter: function(type) {
                if(type === 'camping') {
                    if(this.filters.camping === true) {
                        this.filters.camping = true;
                        this.filters.nearby = false;
                    }
                    else {
                        this.filters.camping = true;
                    }
                }
                if(type === 'nearby') {
                    if(this.filters.nearby === true) {
                        this.filters.nearby = true;
                        this.filters.camping = false;
                    }
                    else {
                        this.filters.nearby = true;
                    }
                }

                // Force re-rendering the list
                this.listViewKey++;
            }
        }
    }
</script>

<style scoped>

    /* List view */
    .row {
        margin: 12.5 12.5 0 12.5;
    }
    ListView {
        background-color: #ffffff;
        separator-color: transparent;
        margin-bottom: 12.5;
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

    /* Type icon */
    .type-icon {
        font-size: 8;
    }
    .type-icon.camping {
        color: #004d9a;
    }
    .type-icon.nearby {
        color: #9ac331;
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
    .tag.camping.active {
        background-color: #004d9a;
        border-color: #004d9a;
    }
    .tag.nearby.active {
        background-color: #9ac331;
        border-color: #9ac331;
    }
</style>