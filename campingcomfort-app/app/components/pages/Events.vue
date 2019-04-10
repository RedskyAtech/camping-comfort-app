<template>
    <Page :class="pageClass" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <GridLayout rows="auto,auto,*" columns="*">
            <StackLayout row="0" class="title-container">
                <Label :text="title"></Label>
            </StackLayout>
            <GridLayout row="1" rows="auto,auto" columns="*,*,*,*,*,*,*" class="week">
                <GridLayout row="0" col="0" rows="30" columns="*" @tap="activateDay(1)" class="day" :class="[{'active': activeDay === 1}]"><Label :text="day1.format('dd')" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="1" col="0" rows="30" columns="*" @tap="activateDay(1)" class="date" :class="[{'active': activeDay === 1}]"><Label :text="day1.format('D')" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="0" col="1" rows="30" columns="*" @tap="activateDay(2)" class="day" :class="[{'active': activeDay === 2}]"><Label :text="day2.format('dd')" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="1" col="1" rows="30" columns="*" @tap="activateDay(2)" class="date" :class="[{'active': activeDay === 2}]"><Label :text="day2.format('D')" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="0" col="2" rows="30" columns="*" @tap="activateDay(3)" class="day" :class="[{'active': activeDay === 3}]"><Label :text="day3.format('dd')" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="1" col="2" rows="30" columns="*" @tap="activateDay(3)" class="date" :class="[{'active': activeDay === 3}]"><Label :text="day3.format('D')" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="0" col="3" rows="30" columns="*" @tap="activateDay(4)" class="day" :class="[{'active': activeDay === 4}]"><Label :text="day4.format('dd')" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="1" col="3" rows="30" columns="*" @tap="activateDay(4)" class="date" :class="[{'active': activeDay === 4}]"><Label :text="day4.format('D')" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="0" col="4" rows="30" columns="*" @tap="activateDay(5)" class="day" :class="[{'active': activeDay === 5}]"><Label :text="day5.format('dd')" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="1" col="4" rows="30" columns="*" @tap="activateDay(5)" class="date" :class="[{'active': activeDay === 5}]"><Label :text="day5.format('D')" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="0" col="5" rows="30" columns="*" @tap="activateDay(6)" class="day" :class="[{'active': activeDay === 6}]"><Label :text="day6.format('dd')" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="1" col="5" rows="30" columns="*" @tap="activateDay(6)" class="date" :class="[{'active': activeDay === 6}]"><Label :text="day6.format('D')" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="0" col="6" rows="30" columns="*" @tap="activateDay(7)" class="day" :class="[{'active': activeDay === 7}]"><Label :text="day7.format('dd')" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
                <GridLayout row="1" col="6" rows="30" columns="*" @tap="activateDay(7)" class="date" :class="[{'active': activeDay === 7}]"><Label :text="day7.format('D')" horizontalAlignment="center" verticalAlignment="center"></Label></GridLayout>
            </GridLayout>
            <EventList row="2" :date="activeDate"></EventList>
        </GridLayout>
    </Page>
</template>

<script>
    import StatusBar from '../mixins/StatusBar'
    import Responsive from '../mixins/Responsive'
    import EventList from '../elements/EventList'
    import LocalStorage from '../mixins/LocalStorage'

    export default {
        data() {
            return {
                activeDay: 1,
                activeDate: '',
                day1: '',
                day2: '',
                day3: '',
                day4: '',
                day5: '',
                day6: '',
                day7: ''
            }
        },
        computed: {
            title: function() {
                return this.$t('activities.week')+' '+this.day1.isoWeek()
            }
        },
        watch: {
            activeDay: function() {
                this.activeDate = this['day'+this.activeDay];
            }
        },
        mixins: [
            Responsive,
            LocalStorage,
            StatusBar
        ],
        components: {
            'EventList': EventList
        },
        created: function() {

            // Hide the status bar
            this.statusBar('hide');

            this.day1 = this.$moment();
            this.day2 = this.$moment().add(1, 'days');
            this.day3 = this.$moment().add(2, 'days');
            this.day4 = this.$moment().add(3, 'days');
            this.day5 = this.$moment().add(4, 'days');
            this.day6 = this.$moment().add(5, 'days');
            this.day7 = this.$moment().add(6, 'days');

            // Set the locale
            let lang = this.getStringFromStore('language');
            this.day1.locale(lang);
            this.day2.locale(lang);
            this.day3.locale(lang);
            this.day4.locale(lang);
            this.day5.locale(lang);
            this.day6.locale(lang);
            this.day7.locale(lang);

            // Set the active date
            this.activeDate = this['day'+this.activeDay];
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
        background-color: #103029;
        color: #fff;
        text-align: center;
        font-weight: 700;
        padding: 12.5 12.5 6.75 12.5;
    }

    /* Weekday selector */
    .week {
        background-color: #103029;
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
        color: #103029;
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