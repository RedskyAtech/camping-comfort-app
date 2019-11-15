<template>
    <StackLayout class="row" :class="[{ 'first': index === 0 }]">
        <GridLayout rows="auto" columns="*,auto" width="100%">
            <StackLayout row="0" col="0">
                <!--<Label class="title" textWrap="true" :text="item.title"></Label>-->
                <!--<Label v-if="item.subTitle" class="text" textWrap="true" :text="item.subTitle"></Label>-->
                <!--<Label class="price" :text="localizeNumber(item.price, '0.00', true)"></Label>-->
            </StackLayout>
            <StackLayout row="0" col="1" verticalAlignment="center">
                <!--<StackLayout orientation="horizontal" verticalAlignment="center">-->
                    <!--<Label class="left-control fas" @tap="decreaseAmount" textAlignment="center" verticalAlignment="center">{{ 'fa-minus-circle' | fonticon }}</Label>-->
                    <!--<Label class="center-control" :text="amount"></Label>-->
                    <!--<Label class="right-control fas" @tap="increaseAmount" textAlignment="center" verticalAlignment="center">{{ 'fa-plus-circle' | fonticon }}</Label>-->
                <!--</StackLayout>-->
            </StackLayout>
        </GridLayout>
    </StackLayout>
</template>

<script>
    import Numbers from '../mixins/Numbers'
    import LocalStorage from '../mixins/LocalStorage'

    export default {
        props: {
            index: {
                type: Number,
                default: null
            },
            item: {}
        },
        data: function() {
            return {
                amount: 0
            }
        },
        mixins: [
            Numbers,
            LocalStorage
        ],
        methods: {
            increaseAmount: function() {
                this.amount = this.amount + 1;
                this.$emit('amount-updated', {
                    index: this.index,
                    amount: this.amount
                });
            },
            decreaseAmount: function() {
                if(this.amount > 0) {
                    this.amount = this.amount - 1;
                    this.$emit('amount-updated', {
                        index: this.index,
                        amount: this.amount
                    });
                }
            }
        }
    }
</script>

<style scoped>

    /* Row */
    .row.first {
        padding: 0 25 12.5 25;
    }
    .row {
        padding: 12.5 25;
    }
    .row .title {
        font-weight: 700;
        padding-bottom: 5;
    }
    .row .text {
        font-size: 12;
        opacity: 0.6;
    }
    .row .price {
        font-size: 18;
        font-weight: 700;
        padding-top: 5;
    }

    /* Controls */
    .left-control {
        font-size: 20;
        opacity: 0.4;
    }
    .center-control {
        padding: 0 10;
        height: 25;
        font-weight: 500;
        color: #191919;
        font-size: 14;
    }
    .right-control {
        font-size: 20;
        opacity: 0.4;
    }
</style>