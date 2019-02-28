<template>
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
            <EventList row="1"></EventList>
        </GridLayout>
    </StackLayout>
</template>

<script>
    import EventList from '../elements/EventList'

    export default {
        data() {
            return {
            }
        },
        components: {
            'EventList': EventList
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
        padding: 12.5 12.5 6.75 12.5;
    }
    .day {
        width: 35;
        height: 35;
        text-align: center;
    }
    .date {
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
</style>