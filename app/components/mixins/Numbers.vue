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
             * @param isPrice
             * @returns {*}
             */
            localizeNumber(number, returnFormat, isPrice) {

                // Default returnFormat
                if(returnFormat === undefined) {
                    returnFormat = '0.0';
                }

                // Default isPrice
                if(isPrice === undefined) {
                    isPrice = false;
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

                // Create the localized number
                let returnVal = numeral(parseFloat(number)).format(returnFormat);

                // Add an optional currency symbol
                if(isPrice) {
                    if(lang === 'nl') {
                        returnVal = '€ '+returnVal;
                    }
                    if(lang === 'de') {
                        returnVal = '€ '+returnVal;
                    }
                    if(lang === 'it') {
                        returnVal = '€ '+returnVal;
                    }
                    if(lang === 'fr') {
                        returnVal = returnVal+' €';
                    }
                }

                // Return
                return returnVal;
            }
        }
    }
</script>