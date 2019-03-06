<template>
    <ListView for="item in listItems" @itemLoading="onItemLoading">
        <v-template if="$index === 0">
            <StackLayout row="0" class="btn-container">
                <StackLayout class="btn wifi-btn" v-if="connectionType !== 'wifi'" @tap="toWifi">
                    <Label class="btn-icon fas">{{ 'fa-wifi' | fonticon }}</Label>
                </StackLayout>
                <StackLayout class="btn contact-btn" @tap="toMap">
                    <Label class="btn-icon fa">{{ 'fa-map' | fonticon }}</Label>
                    <Label class="btn-text" text="Plattegrond"></Label>
                </StackLayout>
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
    import EventBus from '../helpers/EventBus'

    export default {
        data() {
            return {
                listItems: [
                    {
                        image: '~/assets/images/demo/pool-2.jpg',
                        title: 'Zwembad'
                    },
                    {
                        image: '~/assets/images/demo/beachclub.jpg',
                        title: 'Strandterras'
                    },
                    {
                        image: '~/assets/images/demo/restaurant.jpg',
                        title: 'Restaurant'
                    },
                    {
                        image: '~/assets/images/demo/bakery.jpg',
                        title: 'Bakkerij'
                    },
                    {
                        image: '~/assets/images/demo/sanitary.jpg',
                        title: 'Sanitaire voorzieningen'
                    }
                ]
            }
        },
        methods: {

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
                EventBus.$emit('navigate', {
                    tab: 2,
                    page: 'coming-soon',
                    props: {
                        title: 'WiFi',
                        showBackBtn: true
                    }
                });
            },
            toMap: function(){
                EventBus.$emit('navigate', {
                    tab: 2,
                    page: 'coming-soon',
                    props: {
                        title: 'Plattegrond',
                        showBackBtn: true
                    }
                });
            },
        }
    }
</script>

<style scoped>

    /* Buttons */
    .btn-container {
        orientation: horizontal;
        margin: 12.5;
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