<script>
    export default {
        methods: {
            humanizeDate(date, returnFormat) {
                let today = this.$moment();
                today.hour(0);
                today.minute(0);
                today.second(0);
                today.millisecond(0);
                let dateMoment = this.$moment(date);
                let diffDays = dateMoment.diff(today, 'days');
                if(diffDays === 0){
                    return this.$t('detail.today');
                }
                else if(diffDays === 1){
                    return this.$t('detail.tomorrow');
                }
                else if(diffDays === -1){
                    return this.$t('detail.yesterday');
                }
                else {

                    // Set the locale
                    let lang = this.getStringFromStore('language');
                    dateMoment.locale(lang);
                    return dateMoment.format(returnFormat);
                }
            }
        }
    }
</script>