<template>
    <Page :class="pageClass" actionBarHidden="true">
        <GridLayout rows="*,auto" columns="*">
            <StackLayout row="0" col="0" verticalAlignment="center" class="fields-container">
                <GridLayout rows="auto,auto,auto,auto">

                    <StackLayout row="0" class="intro">
                        <Label class="intro-title" textWrap="true" text="Je bent bijna klaar!"></Label>
                        <Label class="intro-text" textWrap="true" text="Selecteer jouw camping om door te gaan."></Label>
                    </StackLayout>

                    <Label row="1" class="field" text="Selecteer jouw camping" @tap="openCampingsModal" />
                    <Label row="1" class="dropdown-icon fas" horizontalAlignment="right" verticalAlignment="center" @tap="openCampingsModal">{{ 'fa-caret-down' | fonticon }}</Label>

                    <Label row="2" class="field" text="Nederlands" @tap="openCampingsModal" />
                    <Label row="2" class="dropdown-icon fas" horizontalAlignment="right" verticalAlignment="center" @tap="openCampingsModal">{{ 'fa-caret-down' | fonticon }}</Label>

                    <StackLayout row="3">
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
        </GridLayout>
    </Page>
</template>

<script>
    import * as http from 'tns-core-modules/http';
    import Responsive from '../mixins/Responsive'
    import Connection from '../mixins/Connection'
    import LocalStorage from '../mixins/LocalStorage'
    import App from './App'
    import {exit} from 'nativescript-exit';
    import CampingsModal from '../elements/CampingsModal';

    export default {
        mixins: [
            Responsive,
            Connection,
            LocalStorage
        ],
        components: {
            'App': App,
            'CampingsModal': CampingsModal
        },
        mounted() {
            if(this.hasInternetConnection()) {

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
            select() {
//                this.storeNumber('campingId', 9665);
                this.$navigateTo(App, {
                    clearHistory: true,
                    transition: {
                        name: 'fade',
                    }
                });
            }
        }
    }
</script>

<style scoped>
    Page {
        background: #454f63;
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