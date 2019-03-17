<template>
    <ListView for="item in listItems" @itemLoading="onItemLoading">
        <v-template>
            <CardView class="cardStyle" :class="[{ 'first': $index === 0 }]" radius="10" @tap="toDetail(item.id)">
                <GridLayout rows="75" columns="75,*">
                    <Image col="0" :src="item.image"></Image>
                    <StackLayout col="1" orientation="horizontal">
                        <StackLayout class="item-label" verticalAlignment="center">
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
                getJSON("https://www.campingcomfort.app/api/9665/nearby-activities/nl").then((r) => {
                    self.listItems = r.nearbyActivities;
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
                        detailType: 'nearby_activity',
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
    .item-label {
        padding: 0 12.5;
    }
    .item-subtitle {
        font-size: 12;
        opacity: 0.6;
    }
</style>