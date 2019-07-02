<script>
    import numeral from 'numeral'
    import 'numeral/locales/en-gb'
    import 'numeral/locales/nl-nl'
    import 'numeral/locales/fr'
    import 'numeral/locales/it'
    import 'numeral/locales/de'

    export default {
        methods: {

            /**
             * Localize a number
             *
             * @param number
             * @param returnFormat
             * @returns {*}
             */
            localizeNumber(number, returnFormat) {

                // Default format
                if(returnFormat === undefined) {
                    returnFormat = '0.0';
                }

                // Get the current language
                let lang = this.getStringFromStore('language');

                // Define the numeral locale based on the current language
                let langLocale = 'en-gb';
                if(lang === 'nl') {
                    langLocale = 'nl-nl';
                }
                if(lang === 'de') {
                    langLocale = 'de';
                }
                if(lang === 'it') {
                    langLocale = 'it';
                }
                if(lang === 'fr') {
                    langLocale = 'fr';
                }

                // Switch the numeral locale
                numeral.locale(langLocale);

                // Return the localized number
                return numeral(parseFloat(number)).format(returnFormat);
            }
        }
    }
</script>