<template>
    <page-wrapper pageTitle="Week 13">
        <StackLayout slot="content" class="page-container">
            <GridLayout rows="auto,*" columns="*" class="events-container">
                <GridLayout row="0" rows="auto,auto" columns="*,*,*,*,*,*,*" class="week">
                    <StackLayout row="0" col="0"><Label class="day active" text="Do"></Label></StackLayout>
                    <StackLayout row="1" col="0"><Label class="date" text="10"></Label></StackLayout>
                    <StackLayout row="0" col="1"><Label class="day" text="Vr"></Label></StackLayout>
                    <StackLayout row="1" col="1"><Label class="date" text="11"></Label></StackLayout>
                    <StackLayout row="0" col="2"><Label class="day" text="Za"></Label></StackLayout>
                    <StackLayout row="1" col="2"><Label class="date" text="12"></Label></StackLayout>
                    <StackLayout row="0" col="3"><Label class="day" text="Zo"></Label></StackLayout>
                    <StackLayout row="1" col="3"><Label class="date" text="13"></Label></StackLayout>
                    <StackLayout row="0" col="4"><Label class="day" text="Ma"></Label></StackLayout>
                    <StackLayout row="1" col="4"><Label class="date" text="14"></Label></StackLayout>
                    <StackLayout row="0" col="5"><Label class="day" text="Di"></Label></StackLayout>
                    <StackLayout row="1" col="5"><Label class="date" text="15"></Label></StackLayout>
                    <StackLayout row="0" col="6"><Label class="day" text="Wo"></Label></StackLayout>
                    <StackLayout row="1" col="6"><Label class="date" text="16"></Label></StackLayout>
                </GridLayout>
                <ListView row="1" for="item in listItems" class="events" @itemLoading="onItemLoading">
                    <v-template>
                        <CardView class="cardStyle" :class="[{ 'first': $index === 0 }]" radius="10">
                            <GridLayout rows="125" columns="125,*">
                                <Image col="0" :src="item.image"></Image>
                                <StackLayout col="1" orientation="horizontal">
                                    <StackLayout class="event-label" verticalAlignment="center">
                                        <StackLayout class="event-time" orientation="horizontal">
                                            <Label class="clock fa">{{ 'fa-clock' | fonticon }}</Label>
                                            <Label :text="item.startTime+' - '+item.endTime"></Label>
                                        </StackLayout>
                                        <Label class="event-title" :text="item.title"></Label>
                                    </StackLayout>
                                </StackLayout>
                            </GridLayout>
                        </CardView>
                    </v-template>
                </ListView>
            </GridLayout>
        </StackLayout>
    </page-wrapper>
</template>

<script>
    import PageWrapper from '../elements/PageWrapper'

    export default {
        data() {
            return {
                weatherIconsLoaded: [],
                showWeatherIcons: false,
                listItems: [
                    {
                        image: '~/assets/images/demo/football.jpg',
                        startTime: '10:00',
                        endTime: '11:00',
                        title: 'Football championship'
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
                        title: 'Kids dance'
                    },
                    {
                        image: '~/assets/images/demo/scavenger-hunt.jpg',
                        startTime: '14:00',
                        endTime: '15:00',
                        title: 'Scavenger hunt'
                    },
                    {
                        image: '~/assets/images/demo/pool.jpg',
                        startTime: '16:00',
                        endTime: '17:00',
                        title: 'Pool party'
                    }
                ]
            }
        },
        components: {
            'page-wrapper': PageWrapper
        },
        methods: {

            // Register a loaded weather icon
            weatherIconLoaded() {
                this.weatherIconsLoaded.push('');

                // Show the weather icons if all icons are loaded
                if(this.weatherIconsLoaded.length === 2){
                    this.showWeatherIcons = true;
                }
            },

            // Remove the grey highlight on tapping a ListView item
            onItemLoading: function(args) {
                const cell = args.ios;
                if (cell) {
                    cell.selectionStyle = UITableViewCellSelectionStyle.UITableViewCellSelectionStyleNone;
                }
            }
        }
    }
</script>

<style scoped>
    .page-container {
        width: 100%;
        height: 100%;
    }
    .events-container {
        height: 100%;
    }

    /* Weekday selector */
    .week {
        background-color: #454f63;
        color: #fff;
        padding: 10 25;
    }
    .day, .date {
        width: 35;
        height: 35;
        text-align: center;
    }
    .day {
        font-weight: 700;
    }
    .day.active {
        background-color: #fff;
        color: #454f63;
        border-radius: 100%;
    }
    .date {
        opacity: 0.5;
    }

    /* List view */
    .cardStyle {
        background-color: #fff;
        margin: 0 25 15 25;
    }
    .cardStyle.first {
        margin-top: 25;
    }
    .events {
        height: 100%;
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
        padding: 0 25;
    }
    .event-time {
        font-size: 14;
        opacity: 0.6;
    }
    .clock {
        padding-right: 5;
        font-size: 18;
    }
    .event-title {
        padding-top: 5;
    }
</style>