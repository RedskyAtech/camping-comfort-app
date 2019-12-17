<script>
    export default {
        methods: {
            humanizeDate(date, showTime=true) {

                // Set the locale
                let moment = this.$moment(date);
                let lang = this.getStringFromStore('language');
                moment.locale(lang);

                let str = '';

                // Get the current day and day number
                let now = this.$moment().hour(0).minute(0).second(0).millisecond(0);
                let currentDayNumber = parseInt(now.format('d')); // Sunday = 0

                // Calculate the difference in days compared to today
                let diffDays = moment.diff(now, 'days'); // Today = 0, yesterday = -1

                // Yesterday
                if(diffDays === -1) {
                    str = this.$t('detail.yesterday');
                    if(showTime) {
                        str += ' '+this.$t('dates.at')+' '+moment.format(this.$t('formatting.time'));
                    }
                }

                // Today
                else if(diffDays === 0) {
                    str = this.$t('detail.today');
                    if(showTime) {
                        str += ' '+this.$t('dates.at')+' '+moment.format(this.$t('formatting.time'));
                    }
                }

                // Tomorrow
                else if(diffDays === 1) {
                    str = this.$t('detail.tomorrow');
                    if(showTime) {
                        str += ' '+this.$t('dates.at')+' '+moment.format(this.$t('formatting.time'));
                    }
                }

                // Until last week
                else if((currentDayNumber + diffDays) <= 0) {
                    str = moment.format(this.$t('formatting.humanizedDate'));
                    if(showTime) {
                        str += ' '+this.$t('dates.at')+' '+moment.format(this.$t('formatting.time'));
                    }
                }

                // This week
                else if((currentDayNumber + diffDays) > 0 && (currentDayNumber + diffDays) <= 7) {
                    str = moment.format('dddd');
                    if(showTime) {
                        str += ' '+this.$t('dates.at')+' '+moment.format(this.$t('formatting.time'));
                    }
                }

                // From next week
                else if((currentDayNumber + diffDays) > 6) {
                    str = moment.format(this.$t('formatting.humanizedDate'));
                    if(showTime) {
                        str += ' '+this.$t('dates.at')+' '+moment.format(this.$t('formatting.time'));
                    }
                }

                // Return the formatted string
                return str;
            }
        }
    }
</script>