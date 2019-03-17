<template>
    <ListView for="item in listItems" @itemLoading="onItemLoading">
        <v-template if="$index === 0">
            <StackLayout>
                <StackLayout class="btn-container">
                    <StackLayout class="btn wifi-btn" v-if="connectionType !== 'wifi'" @tap="toWifi">
                        <Label class="btn-icon fas" verticalAlignment="center">{{ 'fa-wifi' | fonticon }}</Label>
                    </StackLayout>
                    <StackLayout class="btn contact-btn" @tap="toMap">
                        <Label class="btn-icon fa" verticalAlignment="center">{{ 'fa-map' | fonticon }}</Label>
                        <Label class="btn-text" text="Plattegrond" verticalAlignment="center"></Label>
                    </StackLayout>
                </StackLayout>
                <CardView class="cardStyle" radius="10" @tap="navigate">
                    <GridLayout rows="75" columns="75,*">
                        <Image col="0" :src="item.image"></Image>
                        <StackLayout col="1" orientation="horizontal">
                            <StackLayout class="event-label" verticalAlignment="center">
                                <Label class="event-title" :text="item.title"></Label>
                            </StackLayout>
                        </StackLayout>
                    </GridLayout>
                </CardView>
            </StackLayout>
        </v-template>
        <v-template else>
            <CardView class="cardStyle" radius="10" @tap="navigate">
                <GridLayout rows="75" columns="75,*">
                    <Image col="0" :src="item.image"></Image>
                    <StackLayout col="1" orientation="horizontal">
                        <StackLayout class="event-label" verticalAlignment="center">
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
    import Connection from '../mixins/Connection'

    export default {
        data() {
            return {
                listItems: []
            }
        },
        mixins: [
            Connection
        ],
        created: function(){
            this.loadData();
        },
        methods: {

            // Get the data
            loadData: function(){
                let self = this;
                getJSON("https://www.campingcomfort.app/api/9665/camping-facilities/nl").then((r) => {
                    self.listItems = r.campingFacilities;

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
            navigate: function(){
                EventBus.$emit('navigate', {
                    tab: 2,
                    page: 'detail'
                });
            },
            toWifi: function(){
                EventBus.$emit('openModal', {
                    page: 'wifi'
                });
            },
            toMap: function(){
                EventBus.$emit('openModal', {
                    page: 'map'
                });
            },
        }
    }
</script>

<style scoped>

    /* Buttons */
    .btn-container {
        orientation: horizontal;
        padding: 12.5;
    }
    .contact-btn {
        margin-left: 5;
    }

    /* List view */
    .cardStyle {
        background-color: #fff;
        margin: 0 12.5 12.5 12.5;
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
</style>