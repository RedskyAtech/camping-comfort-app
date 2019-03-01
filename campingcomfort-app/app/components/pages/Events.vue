<template>
    <Page :class="pageClass" actionBarHidden="true">
        <GridLayout rows="auto,auto,*" columns="*">
            <StackLayout row="0" class="title-container">
                <Label text="Week 13"></Label>
            </StackLayout>
            <GridLayout row="1" rows="auto,auto" columns="*,*,*,*,*,*,*" class="week">
                <StackLayout row="0" col="0"><Label class="day" text="Do"></Label></StackLayout>
                <StackLayout row="1" col="0"><Label class="date" text="7"></Label></StackLayout>
                <StackLayout row="0" col="1"><Label class="day active" text="Vr"></Label></StackLayout>
                <StackLayout row="1" col="1"><Label class="date" text="8"></Label></StackLayout>
                <StackLayout row="0" col="2"><Label class="day" text="Za"></Label></StackLayout>
                <StackLayout row="1" col="2"><Label class="date" text="9"></Label></StackLayout>
                <StackLayout row="0" col="3"><Label class="day" text="Zo"></Label></StackLayout>
                <StackLayout row="1" col="3"><Label class="date" text="10"></Label></StackLayout>
                <StackLayout row="0" col="4"><Label class="day" text="Ma"></Label></StackLayout>
                <StackLayout row="1" col="4"><Label class="date" text="11"></Label></StackLayout>
                <StackLayout row="0" col="5"><Label class="day" text="Di"></Label></StackLayout>
                <StackLayout row="1" col="5"><Label class="date" text="12"></Label></StackLayout>
                <StackLayout row="0" col="6"><Label class="day" text="Wo"></Label></StackLayout>
                <StackLayout row="1" col="6"><Label class="date" text="13"></Label></StackLayout>
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
            }
        },
        mixins: [
            Responsive
        ],
        components: {
            'EventList': EventList
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