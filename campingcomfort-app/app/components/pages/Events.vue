<template>
    <Page :class="pageClass" actionBarHidden="true">
        <GridLayout rows="auto,auto,*" columns="*">
            <StackLayout row="0" class="title-container">
                <Label text="Week 13"></Label>
            </StackLayout>
            <GridLayout row="1" rows="auto,auto" columns="*,*,*,*,*,*,*" class="week">
                <StackLayout row="0" col="0" @tap="activateDay(1)"><Label class="day" :class="[{'active': activeDay === 1}]" text="Do"></Label></StackLayout>
                <StackLayout row="1" col="0" @tap="activateDay(1)"><Label class="date" :class="[{'active': activeDay === 1}]" text="7"></Label></StackLayout>
                <StackLayout row="0" col="1" @tap="activateDay(2)"><Label class="day" :class="[{'active': activeDay === 2}]" text="Vr"></Label></StackLayout>
                <StackLayout row="1" col="1" @tap="activateDay(2)"><Label class="date" :class="[{'active': activeDay === 2}]" text="8"></Label></StackLayout>
                <StackLayout row="0" col="2" @tap="activateDay(3)"><Label class="day" :class="[{'active': activeDay === 3}]" text="Za"></Label></StackLayout>
                <StackLayout row="1" col="2" @tap="activateDay(3)"><Label class="date" :class="[{'active': activeDay === 3}]" text="9"></Label></StackLayout>
                <StackLayout row="0" col="3" @tap="activateDay(4)"><Label class="day" :class="[{'active': activeDay === 4}]" text="Zo"></Label></StackLayout>
                <StackLayout row="1" col="3" @tap="activateDay(4)"><Label class="date" :class="[{'active': activeDay === 4}]" text="10"></Label></StackLayout>
                <StackLayout row="0" col="4" @tap="activateDay(5)"><Label class="day" :class="[{'active': activeDay === 5}]" text="Ma"></Label></StackLayout>
                <StackLayout row="1" col="4" @tap="activateDay(5)"><Label class="date" :class="[{'active': activeDay === 5}]" text="11"></Label></StackLayout>
                <StackLayout row="0" col="5" @tap="activateDay(6)"><Label class="day" :class="[{'active': activeDay === 6}]" text="Di"></Label></StackLayout>
                <StackLayout row="1" col="5" @tap="activateDay(6)"><Label class="date" :class="[{'active': activeDay === 6}]" text="12"></Label></StackLayout>
                <StackLayout row="0" col="6" @tap="activateDay(7)"><Label class="day" :class="[{'active': activeDay === 7}]" text="Wo"></Label></StackLayout>
                <StackLayout row="1" col="6" @tap="activateDay(7)"><Label class="date" :class="[{'active': activeDay === 7}]" text="13"></Label></StackLayout>
            </GridLayout>
            <EventList row="2"></EventList>
        </GridLayout>
    </Page>
</template>

<script>
    import Responsive from '../mixins/Responsive'
    import EventList from '../elements/EventList'

    export default {
        data() {
            return {
                activeDay: 3
            }
        },
        mixins: [
            Responsive
        ],
        components: {
            'EventList': EventList
        },
        methods: {
            activateDay(day){
                this.activeDay = day;
            }
        }
    }
</script>

<style scoped>

    /* Title */
    .title-container {
        background-color: #454f63;
        color: #fff;
        text-align: center;
        font-weight: 700;
        font-size: 16;
        padding: 12.5 12.5 6.75 12.5;
    }

    /* Weekday selector */
    .week {
        background-color: #454f63;
        color: #fff;
        padding: 0 12.5 6.75 12.5;
        font-size: 14;
    }
    .day {
        width: 30;
        height: 30;
        text-align: center;
    }
    .date {
        width: 30;
        height: 30;
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
</style>