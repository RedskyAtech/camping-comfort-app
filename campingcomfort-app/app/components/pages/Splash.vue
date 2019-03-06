<template>
    <Page :class="pageClass" actionBarHidden="true">
        <GridLayout rows="*,auto" class="form-container">
            <GridLayout row="0">
                <Label horizontalAlignment="center" text="Tap to continue" @tap="onSelect"/>
            </GridLayout>
            <Label row="1" horizontalAlignment="center" class="copyright" text="© 2019 CampingComfort"></Label>
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

    export default {
        mixins: [
            Responsive,
            Connection,
            LocalStorage
        ],
        components: {
            App: App
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
            onSelect() {
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
    .form-container {
        padding: 12.5;
    }
    Label {
        color: #fff;
    }
    .copyright {
        opacity: 0.5;
        font-size: 12;
    }
</style>