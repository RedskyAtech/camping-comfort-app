<template>
    <Page :class="pageClass" actionBarHidden="true">
        <GridLayout rows="auto,*" columns="*">
            <StackLayout row="0" class="title-container">
                <GridLayout>
                    <Label row="0" col="0" class="back-btn fas" horizontalAlignment="left" @tap="$modal.close()">{{ 'fa-arrow-left' | fonticon }}</Label>
                </GridLayout>
            </StackLayout>
            <ListView row="1" for="language in languages">
                <v-template>
                    <StackLayout class="result" @tap="select(language.code)">
                        <Label :text="language.name" class="name" />
                    </StackLayout>
                </v-template>
            </ListView>
        </GridLayout>
    </Page>
</template>

<script>
    import EventBus from '../helpers/EventBus'
    import Responsive from '../mixins/Responsive'
    import LocalStorage from '../mixins/LocalStorage'
    import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http";

    export default {
        data: function(){
            return {
                timeout: '',
                term: '',
                languages: [
                    {
                        'code': 'nl',
                        'name': 'Nederlands'
                    },
                    {
                        'code': 'en',
                        'name': 'English'
                    },
                    {
                        'code': 'de',
                        'name': 'Deutsch'
                    },
                    {
                        'code': 'fr',
                        'name': 'Français'
                    }
                ]
            }
        },
        mixins: [
            LocalStorage,
            Responsive
        ],
        methods: {
            select: function(code){
                this.storeString('language', code);
                EventBus.$emit('languageSelected');
                this.$modal.close();
            }
        }
    }
</script>

<style scoped>

    /* Title */
    .title-container {
        background-color: #103029;
        padding: 25;
        font-weight: 500;
    }
    Page.xs .title-container {
        padding: 25 12.5;
    }
    .back-btn {
        width: 60;
        text-align: center;
        background: #fff;
        border-radius: 5;
        padding: 12.5;
    }
    .result {
        padding: 10 25;
    }
    .name {
        font-weight: 700;
    }
</style>