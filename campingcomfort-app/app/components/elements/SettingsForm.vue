<template>
    <GridLayout rows="*,auto" columns="*">
        <StackLayout row="0" col="0" verticalAlignment="center" class="fields-container">
            <GridLayout rows="auto,auto,auto,auto">

                <StackLayout row="0" class="intro">
                    <Label class="intro-title" textWrap="true" :text="$t('settings.title')"></Label>
                    <Label class="intro-text" textWrap="true" :text="$t('settings.subtitle')"></Label>
                </StackLayout>

                <Label row="1" class="field" :text="campingName" @tap="openCampingsModal" />
                <Label row="1" class="dropdown-icon fas" horizontalAlignment="right" verticalAlignment="center" @tap="openCampingsModal">{{ 'fa-caret-down' | fonticon }}</Label>

                <Label row="2" class="field" :text="languageString" @tap="openLanguagesModal" />
                <Label row="2" class="dropdown-icon fas" horizontalAlignment="right" verticalAlignment="center" @tap="openLanguagesModal">{{ 'fa-caret-down' | fonticon }}</Label>

                <StackLayout row="3" v-if="campingId">
                    <GridLayout columns="auto" horizontalAlignment="center">
                        <StackLayout col="0" class="btn" @tap="save">
                            <Label class="btn-text" :text="$t('settings.buttonText')" verticalAlignment="center"></Label>
                            <Label class="btn-icon fas" verticalAlignment="center">{{ 'fa-arrow-right' | fonticon }}</Label>
                        </StackLayout>
                    </GridLayout>
                </StackLayout>
            </GridLayout>
        </StackLayout>
        <Label row="1" col="0" horizontalAlignment="center" class="copyright" text="© 2019 CampingComfort"></Label>
        <slot name="fav"></slot>
    </GridLayout>
</template>

<script>
    import EventBus from '../helpers/EventBus'
    import CampingsModal from '../elements/CampingsModal';
    import LanguagesModal from '../elements/LanguagesModal';
    import Connection from '../mixins/Connection'
    import LocalStorage from '../mixins/LocalStorage'

    export default {
        components: {
            CampingsModal: CampingsModal,
            LanguagesModal: LanguagesModal
        },
        mixins: [
            Connection,
            LocalStorage,
        ],
        data: function() {
            return {
                campingId: 0,
                campingName: this.$t('settings.campingPlaceholder'),
                language: ''
            }
        },
        computed: {
            languageString: function(){
                return this.language ? this.$t('languages.'+this.language) : '';
            }
        },
        mounted() {
            let self = this;

            // Set the initial values
            if(this.keyExistsInStore('campingId')){
                this.campingId = this.getStringFromStore('campingId');
                this.campingName = this.getStringFromStore('campingName');
            }
            if(this.keyExistsInStore('language')){
                this.language = this.getStringFromStore('language');
            }

            // Listen to a camping selection
            EventBus.$on('campingSelected', function(data){
                self.setCamping(data);
            });

            // Listen to a language selection
            EventBus.$on('languageSelected', function(data){
                self.setLanguage(data);
            });
        },
        methods: {

            // Open the camping selection modal
            openCampingsModal(){
                if(this.hasInternetConnection()) {
                    this.$showModal(CampingsModal, {
                        fullscreen: true
                    });
                }
                else {
                    alert({
                        title: this.$t('errors.offline.title'),
                        message: this.$t('errors.offline.message'),
                        okButtonText: this.$t('errors.offline.buttonText')
                    }).then(() => {
                    });
                }
            },
            openLanguagesModal(){
                this.$showModal(LanguagesModal, {
                    fullscreen: true
                });
            },
            save(){

                // Empty all storage data
                this.removeAllKeysFromStore();

                // Store the selected camping
                this.storeNumber('campingId', parseInt(this.campingId));
                this.storeString('campingName', this.campingName);

                // Store the selected language
                this.storeString('language', this.language);

                // Change the vue.js locale
                this.$i18n.locale = this.language;

                this.$emit('saved');
            },

            // Set the camping from an emitted event
            setCamping(data){
                this.campingId = data.id;
                this.campingName = data.name;
            },

            // Set the language from an emitted event
            setLanguage(data){
                this.language = data.code;
            }
        }
    }
</script>

<style scoped>
    .intro {
        color: #fff;
        text-align: center;
        padding-top: 25;
        padding-bottom: 25;
    }
    .intro-title {
        font-size: 24;
        font-weight: 700;
    }
    .intro-text {
    }
    .fields-container {
        padding: 25;
        font-weight: 500;
    }
    Page.xs .fields-container {
        padding: 12.5;
    }
    .field {
        background: #fff;
        border-radius: 5;
        padding: 12.5;
        margin: 12.5 0 0 0;
    }
    .dropdown-icon {
        padding-right: 12.5;
        margin: 12.5 0 0 0;
    }
    .btn {
        border-color: #fff;
        color: #fff;
        margin: 12.5 0 0 0;
        font-size: 16;
    }
    .btn-text {
        padding-left: 0;
        padding-right: 10;
    }
    .copyright {
        color: #fff;
        opacity: 0.5;
        font-size: 12;
        padding: 12.5;
    }
</style>