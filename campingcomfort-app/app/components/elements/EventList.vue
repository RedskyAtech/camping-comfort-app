<template>
    <ListView for="item in listItems" @itemLoading="onItemLoading">
        <v-template>
            <CardView class="cardStyle" :class="[{ 'first': $index === 0 }]" radius="10" @tap="navigate">
                <GridLayout rows="75" columns="75,*">
                    <Image col="0" :src="item.image"></Image>
                    <StackLayout col="1" orientation="horizontal">
                        <StackLayout class="event-label" verticalAlignment="center">
                            <StackLayout class="event-time" orientation="horizontal">
                                <Label class="clock far">{{ 'fa-clock' | fonticon }}</Label>
                                <Label :text="item.startTime+' - '+item.endTime"></Label>
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
    import EventBus from '../helpers/EventBus'

    export default {
        data() {
            return {
                listItems: [
                    {
                        image: '~/assets/images/demo/football.jpg',
                        startTime: '10:00',
                        endTime: '11:00',
                        title: 'Voetbalwedstrijd'
                    },
                    {
                        image: '~/assets/images/demo/aqua-zumba.jpg',
                        startTime: '11:15',
                        endTime: '11:30',
                        title: 'Aqua Zumba'
                    },
                    {
                        image: '~/assets/images/demo/dance.jpg',
                        startTime: '12:30',
                        endTime: '13:00',
                        title: 'Dansvoorstelling'
                    },
                    {
                        image: '~/assets/images/demo/scavenger-hunt.jpg',
                        startTime: '14:00',
                        endTime: '15:00',
                        title: 'Spoorzoeker'
                    },
                    {
                        image: '~/assets/images/demo/pool.jpg',
                        startTime: '16:00',
                        endTime: '17:00',
                        title: 'Zwembadspelen'
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
                    tab: 4,
                    page: 'detail'
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