<template>
    <ListView for="item in listItems" @itemLoading="onItemLoading">
        <v-template>
            <CardView class="cardStyle" :class="[{ 'first': $index === 0 }]" radius="10" @tap="toDetail(item.id)">
                <GridLayout rows="75" columns="75,*">
                    <Image col="0" :src="item.image"></Image>
                    <StackLayout col="1" orientation="horizontal">
                        <StackLayout class="event-label" verticalAlignment="center">
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
</template>

<script>
    import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http";
    import EventBus from '../helpers/EventBus'

    export default {
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
                getJSON("https://www.campingcomfort.app/api/9665/camping-activities/nl").then((r) => {
                    self.listItems = r.campingActivities;
                }, (e) => {
                });
            },

            // Remove the grey highlight on tapping a ListView item
            onItemLoading: function(args) {
                const cell = args.ios;
                if (cell) {
                    cell.selectionStyle = UITableViewCellSelectionStyle.UITableViewCellSelectionStyleNone;
                }
            },
            toDetail: function(id){
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
    .cardStyle Image {
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