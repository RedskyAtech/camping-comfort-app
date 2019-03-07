<template>
    <Page :class="pageClass" actionBarHidden="true">
        <GridLayout rows="auto,auto,*" columns="*">
            <StackLayout row="0" class="title-container">
                <Label text="Week 13"></Label>
            </StackLayout>
            <GridLayout row="1" rows="auto,auto" columns="*,*,*,*,*,*,*" class="week">
                <GridLayout row="0" col="0" rows="30" columns="*" @tap="activateDay(1)" class="day" :class="[{'active': activeDay === 1}]"><Label text="Do" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="1" col="0" rows="30" columns="*" @tap="activateDay(1)" class="date" :class="[{'active': activeDay === 1}]"><Label text="7" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="0" col="1" rows="30" columns="*" @tap="activateDay(2)" class="day" :class="[{'active': activeDay === 2}]"><Label text="Vr" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="1" col="1" rows="30" columns="*" @tap="activateDay(2)" class="date" :class="[{'active': activeDay === 2}]"><Label text="8" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="0" col="2" rows="30" columns="*" @tap="activateDay(3)" class="day" :class="[{'active': activeDay === 3}]"><Label text="Za" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="1" col="2" rows="30" columns="*" @tap="activateDay(3)" class="date" :class="[{'active': activeDay === 3}]"><Label text="9" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="0" col="3" rows="30" columns="*" @tap="activateDay(4)" class="day" :class="[{'active': activeDay === 4}]"><Label text="Zo" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="1" col="3" rows="30" columns="*" @tap="activateDay(4)" class="date" :class="[{'active': activeDay === 4}]"><Label text="10" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="0" col="4" rows="30" columns="*" @tap="activateDay(5)" class="day" :class="[{'active': activeDay === 5}]"><Label text="Ma" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="1" col="4" rows="30" columns="*" @tap="activateDay(5)" class="date" :class="[{'active': activeDay === 5}]"><Label text="11" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="0" col="5" rows="30" columns="*" @tap="activateDay(6)" class="day" :class="[{'active': activeDay === 6}]"><Label text="Di" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="1" col="5" rows="30" columns="*" @tap="activateDay(6)" class="date" :class="[{'active': activeDay === 6}]"><Label text="12" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="0" col="6" rows="30" columns="*" @tap="activateDay(7)" class="day" :class="[{'active': activeDay === 7}]"><Label text="Wo" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="1" col="6" rows="30" columns="*" @tap="activateDay(7)" class="date" :class="[{'active': activeDay === 7}]"><Label text="13" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
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
        font-weight: 700;
    }
    .day.active {
        background-color: #fff;
        color: #454f63;
        border-radius: 100%;
    }
    .date {
        width: 30;
        height: 30;
    }
    .date {
        opacity: 0.5;
    }
    .day Label,
    .date Label {

    }
</style>