<template>
    <Page :class="pageClass" actionBarHidden="true">
        <GridLayout rows="*,auto" columns="*">
            <StackLayout row="0" col="0" verticalAlignment="center" class="fields-container">
                <GridLayout rows="auto,auto,auto,auto">

                    <StackLayout row="0" class="intro">
                        <Label class="intro-title" textWrap="true" text="Instellingen"></Label>
                        <Label class="intro-text" textWrap="true" text="Selecteer jouw camping om door te gaan."></Label>
                    </StackLayout>

                    <Label row="1" class="field" :text="campingNameComputed" @tap="openCampingsModal" />
                    <Label row="1" class="dropdown-icon fas" horizontalAlignment="right" verticalAlignment="center" @tap="openCampingsModal">{{ 'fa-caret-down' | fonticon }}</Label>

                    <Label row="2" class="field" text="Nederlands" @tap="openLanguagesModal" />
                    <Label row="2" class="dropdown-icon fas" horizontalAlignment="right" verticalAlignment="center" @tap="openLanguagesModal">{{ 'fa-caret-down' | fonticon }}</Label>

                    <StackLayout row="3" v-if="campingName">
                        <GridLayout columns="auto" horizontalAlignment="center">
                            <StackLayout col="0" class="btn" @tap="select">
                                <Label class="btn-text" text="Opslaan" verticalAlignment="center"></Label>
                                <Label class="btn-icon fas" verticalAlignment="center">{{ 'fa-arrow-right' | fonticon }}</Label>
                            </StackLayout>
                        </GridLayout>
                    </StackLayout>
                </GridLayout>
            </StackLayout>
            <Label row="1" col="0" horizontalAlignment="center" class="copyright" text="© 2019 CampingComfort"></Label>
            <Fab row="1" col="0" bg="transparent"><Label @tap="closeModal" row="0" col="0" class="btn-icon fas" verticalAlignment="center">{{ 'fa-arrow-down' | fonticon }}</Label></Fab>
        </GridLayout>
    </Page>
</template>

<script>
    import EventBus from '../helpers/EventBus'
    import Responsive from '../mixins/Responsive'
    import Connection from '../mixins/Connection'
    import LocalStorage from '../mixins/LocalStorage'
    import {exit} from 'nativescript-exit';
    import CampingsModal from '../elements/CampingsModal';
    import LanguagesModal from '../elements/LanguagesModal';
    import Fab from '../elements/Fab'

    export default {
        mixins: [
            Responsive,
            Connection,
            LocalStorage
        ],
        components: {
            CampingsModal: CampingsModal,
            LanguagesModal: LanguagesModal,
            Fab: Fab
        },
        data: function(){
            return {
                campingName: undefined,
                language: undefined
            }
        },
        computed: {

            // Return the camping name or placeholder if not set
            campingNameComputed: function(){
                if(this.campingName){
                    return this.campingName;
                }
                else {
                    return 'Selecteer jouw camping'
                }
            }
        },
        mounted() {
            let self = this;
            if(this.hasInternetConnection()) {

                // Set the selected camping name
                self.campingName = self.getStringFromStore('campingName');

                // Set the camping name on selection
                EventBus.$on('campingSelected', function(){
                    self.campingName = self.getStringFromStore('campingName');
                });
            }
            else {
                setTimeout(function(){
                    alert({
                        title: "The internet connection appears to be offline",
                        message: "An internet connection is required to display the latest content. Please activate your internet connection.",
                        okButtonText: "OK"
                    }).then(() => {
                        exit();
                    });
                }, 1500);
            }
        },
        methods: {
            openCampingsModal(){
                this.$showModal(CampingsModal, {
                    fullscreen: true
                });
            },
            openLanguagesModal(){
                this.$showModal(LanguagesModal, {
                    fullscreen: true
                });
            },
            select() {
                EventBus.$emit('changedSettings');
                this.$modal.close();
            },
            closeModal: function(){
                this.$modal.close();
            }
        }
    }
</script>

<style scoped>
    Page {
        background: #103029;
    }
    .intro {
        color: #fff;
        text-align: center;
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