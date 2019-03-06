<template>
    <Page :class="pageClass" actionBarHidden="true">
        <Label text="Select country"></Label>
        <RadAutoCompleteTextView ref="autocomplete"
                                 hint="Mijn camping"
                                 suggestMode="Suggest"
                                 displayMode="Plain"
                                 :items="campings"
                                 @didAutoComplete="onSelect">
            <SuggestionView ~suggestionView suggestionViewHeight="300">
                <StackLayout v-suggestionItemTemplate orientation="vertical" padding="10">
                    <v-template scope="item">
                        <Label :text="item.text" />
                    </v-template>
                </StackLayout>
            </SuggestionView>
        </RadAutoCompleteTextView>
    </Page>
</template>

<script>
    import * as http from 'tns-core-modules/http';
    import Responsive from '../mixins/Responsive'
    import Connection from '../mixins/Connection'
    import LocalStorage from '../mixins/LocalStorage'
    import App from './App'
    import { ObservableArray } from 'data/observable-array';
    import { TokenModel } from 'nativescript-ui-autocomplete';

    export default {
        mixins: [
            Responsive,
            Connection,
            LocalStorage
        ],
        data() {
            return {
                campings: new ObservableArray(),
            }
        },
        components: {
            App: App
        },
        mounted() {

            const jsonUrl = 'https://www.campingcomfort.app/api/campings';

            this.$refs.autocomplete.setLoadSuggestionsAsync((text) => {
                const promise = new Promise((resolve, reject) => {
                    http.getJSON(jsonUrl).then((r) => {
                        const collection = r.campings;
                        const items = new Array();
                        for (let i = 0; i < collection.length; i++) {
                            items.push(new TokenModel(collection[i].name+' ('+collection[i].locality+', '+collection[i].country+')', null));
                        }
                        resolve(items);
                    }).catch((err) => {
                        const message = `Error fetching remote data from ${jsonUrl}: ${err.message}`;
                        console.log(message);
                        alert(message);
                        reject();
                    });
                });

                return promise;
            });
        },
        methods: {
            onSelect({ text }) {
                this.storeNumber('campingId', 9665);
                this.$navigateTo(App);
            }
        }
    }
</script>

<style scoped>
    Page {
        background: #454f63;
    }
</style>