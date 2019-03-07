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
            },

            loadData: function(keys){
                let self = this;
                if(this.hasInternetConnection()){

                    // Fetch new content from the API
                    keys.forEach(function (obj) {
                        if(obj.vueKey === 'heroImage'){
                            self[obj.vueKey] = '~/assets/images/demo/campground.jpg';
                            self.storeString(obj.storageKey, '~/assets/images/demo/campground.jpg');
                        }
                        if(obj.vueKey === 'heroTitle'){
                            self[obj.vueKey] = 'Camping International';
                            self.storeString(obj.storageKey, 'Camping International');
                        }
                    });
                    /*http.getJSON("https://www.campingcomfort.app/api/home").then(result => {
                        this.heroImage = result.heroImage;
                        this.heroTitle = result.heroTitle;
                    }, error => {
                        console.log(error);
                    });*/

                    return true;
                }
                else {

                    // Create an array of the required keys
                    let requiredKeys = [];
                    keys.forEach(function (obj) {
                        if(obj.required === true){
                            requiredKeys.push(obj.storageKey);
                        }
                    });

                    // Check if all required keys exist in the storage
                    if(this.keysExistInStore(requiredKeys)){

                        // Assign all values from the storage to the local Vue.js keys
                        keys.forEach(function (obj) {
                            if(obj.type === 'string'){
                                self[obj.vueKey] = self.getStringFromStore(obj.storageKey);
                            }
                            if(obj.type === 'number'){
                                self[obj.vueKey] = self.getNumberFromStore(obj.storageKey);
                            }
                            if(obj.type === 'boolean'){
                                self[obj.vueKey] = self.getBooleanFromStore(obj.storageKey);
                            }
                        });
                        return true;
                    }

                    // Show a message that an active internet connection is required to fetch all required data
                    else {
                        setTimeout(function(){
                            alert({
                                title: "No internet connection detected",
                                message: "An internet connection is required to display the latest content. Please activate your internet connection.",
                                okButtonText: "OK"
                            }).then(() => {
                                exit();
                            });
                        }, 1500);

                        return false;
                    }
                }
            }
        }
    }
</script>