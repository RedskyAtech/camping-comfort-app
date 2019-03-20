<script>
    import * as appSettings from 'tns-core-modules/application-settings';
    import {exit} from 'nativescript-exit';

    export default {
        methods: {

            // Set a boolean value
            storeBoolean: function(key, value){
                appSettings.setBoolean(key, value);
            },

            // Get a boolean value, optionally provide a default value
            // Returns undefined if the value does not exist
            getBooleanFromStore: function(key, defaultValue){
                let value;
                if(defaultValue !== undefined){
                    value = appSettings.getBoolean(key, defaultValue);
                }
                else {
                    value = appSettings.getBoolean(key);
                }
                return value;
            },

            // Get a string value
            storeString: function(key, value){
                appSettings.setString(key, value);
            },

            // Get a string value, optionally provide a default value
            // Returns undefined if the value does not exist
            getStringFromStore: function(key, defaultValue){
                let value;
                if(defaultValue !== undefined) {
                    value = appSettings.getString(key, defaultValue);
                }
                else {
                    value = appSettings.getString(key);
                }
                return value;
            },

            // Get a number value
            storeNumber: function(key, value){
                appSettings.setNumber(key, value);
            },

            // Get a number value, optionally provide a default value
            // Returns undefined if the value does not exist
            getNumberFromStore: function(key, defaultValue){
                let value;
                if(defaultValue !== undefined) {
                    value = appSettings.getNumber(key, defaultValue);
                }
                else {
                    value = appSettings.getNumber(key);
                }
                return value;
            },

            /**
             * Check if a key exists
             *
             * @param key
             * @returns {boolean}
             */
            keyExistsInStore: function(key){
                return appSettings.hasKey(key);
            },

            // Check if the passed keys exist in the storage
            keysExistInStore: function(keys){
                let keysExist = true;
                let self = this;

                keys.forEach(function(value, index, array) {
                    if(self.keyExistsInStore(value) === false){
                        keysExist = false;
                    }
                });

                return keysExist;
            },

            /**
             * Remove a key
             *
             * @param key
             */
            removeKeyFromStore: function(key){
                appSettings.remove(key);
            },

            /**
             * Remove all keys
             */
            removeAllKeysFromStore: function(){
                appSettings.clear();
            }
        }
    }
</script>