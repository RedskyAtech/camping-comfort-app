<template>
    <Page :class="pageClass" actionBarHidden="true">
        <GridLayout rows="auto,*" columns="*">
            <StackLayout row="0" class="title-container">
                <GridLayout>
                    <TextField row="0" col="0" ref="textField" @loaded="textFieldLoaded" v-model="term" hint="Naam van jouw camping"></TextField>
                    <Label row="0" col="0" class="back-btn fas" horizontalAlignment="left" @tap="$modal.close()">{{ 'fa-arrow-left' | fonticon }}</Label>
                </GridLayout>
            </StackLayout>
            <ListView row="1" for="camping in campings">
                <v-template>
                    <StackLayout class="result" @tap="select(camping.id, camping.name)" :class="[{'active': camping.active === 1 }]">
                        <Label :text="camping.name" class="name" />
                        <Label :text="camping.locality + ', ' + camping.country" class="place"></Label>
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

    // Minimal delay between search requests
    const delay = 500;

    export default {
        data: function(){
            return {
                timeout: '',
                term: '',
                campings: []
            }
        },
        mixins: [
            LocalStorage,
            Responsive
        ],
        watch: {
            term: function(val){
                let self = this;
                clearTimeout(self.timeout);
                this.timeout = setTimeout(function(){
                    self.search(val);
                }, delay);
            }
        },
        mounted: function(){
            this.search('a');
        },
        methods: {
            textFieldLoaded(){
                this.$refs.textField.nativeView.focus();
            },
            search: function(val){
                let self = this;
                getJSON("https://www.campingcomfort.app/api/campings/"+encodeURI(val)).then((r) => {
                    self.campings = r.campings;
                }, (e) => {
                });
            },
            select: function(id, name){
                EventBus.$emit('campingSelected', {
                    'id': id,
                    'name': name
                });
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
    TextField {
        background: #fff;
        border-radius: 5;
        padding: 12.5 12.5 12.5 60;
    }
    .back-btn {
        width: 60;
        text-align: center;
    }
    .result {
        padding: 10 25;
    }
    .name {
        opacity: 0.5;
        font-weight: 700;
    }
    .result.active .name {
        opacity: 1;
    }
    .place {
        font-size: 14;
        opacity: 0.5;
    }
</style>