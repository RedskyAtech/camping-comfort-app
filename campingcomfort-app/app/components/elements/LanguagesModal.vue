<template>
    <Page :class="pageClass" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
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
                term: ''
            }
        },
        computed: {
            languages: function(){
                let l = [
                    {
                        'code': 'nl',
                        'name': this.$t('languages.nl')
                    },
                    {
                        'code': 'en',
                        'name': this.$t('languages.en')
                    },
                    {
                        'code': 'de',
                        'name': this.$t('languages.de')
                    },
                    {
                        'code': 'fr',
                        'name': this.$t('languages.fr')
                    },
                    {
                        'code': 'it',
                        'name': this.$t('languages.it')
                    }
                ];

                // Sort by name
                return l.sort(function(a, b){
                    if(a.name < b.name) return -1;
                    if(a.name > b.name) return 1;
                    return 0;
                });
            }
        },
        mixins: [
            LocalStorage,
            Responsive
        ],
        methods: {
            select: function(code){

                // Emit a language selected event
                EventBus.$emit('languageSelected', {
                    code: code
                });

                // Close the modal
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
    Page.xxs .title-container,
    Page.xs .title-container{
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