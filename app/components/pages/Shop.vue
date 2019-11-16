<template>
    <Page :class="pageClass" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <Header :hasHero="false" :title="$t('shop.title')" :showHeader="true" :showBackBtn="true" :inModal="true">
            <GridLayout rows="*,auto" height="100%">
                <ShopList row="0" v-on:order-updated="updateOrder"></ShopList>
                <StackLayout row="1" class="submit">
                    <GridLayout columns="*,auto">
                        <Label col="0" :text="$t('shop.order')"></Label>
                        <Label col="1" :text="totalFormatted"></Label>
                    </GridLayout>
                </StackLayout>
            </GridLayout>
        </Header>
    </Page>
</template>

<script>
    import * as platform from "tns-core-modules/platform";
    import * as http from 'http'
    import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http";
    import EventBus from '../helpers/EventBus'
    import Connection from '../mixins/Connection'
    import Responsive from '../mixins/Responsive'
    import LocalStorage from '../mixins/LocalStorage'
    import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert";
    import Header from '../elements/Header'
    import HeaderMixin from '../mixins/HeaderMixin'
    import Bubble from '../elements/Bubble'
    import * as application from "tns-core-modules/application";
    import { isAndroid, isIOS } from "tns-core-modules/platform";
    import ShopList from '../elements/ShopList'
    import Numbers from '../mixins/Numbers'

    export default {
        data() {
            return {
                order: {},
                total: 0
            }
        },
        computed: {
            totalFormatted: function() {
                return this.localizeNumber(this.total, '0.00', true);
            }
        },
        mixins: [
            Responsive,
            Connection,
            LocalStorage,
            HeaderMixin,
            Numbers
        ],
        components: {
            Header: Header,
            Bubble: Bubble,
            ShopList: ShopList
        },
        methods: {
            updateOrder: function(order) {
                this.order = order;

                this.total = 0;
                for (let id in this.order) {
                    this.total = this.total + (this.order[id].price * this.order[id].amount);
                }
            }
        }
    }
</script>

<style scoped>
    .submit {
        padding: 12.5 25;
        color: #fff;
        background: #45ac34;
        font-size: 18;
        font-weight: 700;
    }
</style>