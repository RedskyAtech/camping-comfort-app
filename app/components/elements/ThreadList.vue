<template>
    <GridLayout rows="*">
        <RadListView row="0" for="thread in threads" @itemLoading="onItemLoading" class="list-view">
            <v-template>
                <StackLayout>
                    <StackLayout class="row" :class="[{ 'first': $index === 0, 'unread': thread.amountUnread > 0 }]" @tap="toDetail(thread.id)">
                        <GridLayout rows="65" columns="*,*">
                            <StackLayout col="0" orientation="horizontal" class="label">
                                <StackLayout verticalAlignment="center">
                                    <Label class="title" :text="keyExistsInStore('userId') ? thread.name + ' ('+thread.location+')' : thread.userGroup ? thread.userGroup : getStringFromStore('campingName')" textWrap="false"></Label>
                                    <FlexboxLayout>
                                        <Label class="subtitle" :text="thread.lastMessage.message" textWrap="false"></Label>
                                    </FlexboxLayout>
                                </StackLayout>
                            </StackLayout>
                            <StackLayout col="1" orientation="horizontal" class="time-container">
                                <StackLayout verticalAlignment="center" width="100%">
                                    <Label class="time" :text="humanizeDate(thread.lastMessage.created_at)" horizontalAlignment="right"></Label>
                                    <FlexboxLayout horizontalAlignment="right">
                                        <Label v-if="thread.amountUnread > 0" class="badge" :text="thread.amountUnread+' '+$t('threads.new')"></Label>
                                        <Label v-else class="subtitle" text=" "></Label>
                                    </FlexboxLayout>
                                </StackLayout>
                            </StackLayout>
                        </GridLayout>
                    </StackLayout>
                </StackLayout>
            </v-template>
        </RadListView>
        <ResultPlaceHolder v-if="threads.length === 0" row="0" icon-label-class="far" icon-class="fa-comments" :title="$t('threads.emptyTitle')" :text="keyExistsInStore('userId') ? $t('threads.emptyText_camping') : $t('threads.emptyText_guest')"></ResultPlaceHolder>
    </GridLayout>
</template>

<script>
    import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http"
    import EventBus from '../helpers/EventBus'
    import Connection from '../mixins/Connection'
    import LocalStorage from '../mixins/LocalStorage'
    import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert"
    import Dates from '../mixins/Dates'
    import ResultPlaceHolder from '../elements/ResultPlaceHolder'

    export default {
        components: {
            ResultPlaceHolder
        },
        props: {
            threads: {
                type: Array,
                default: []
            }
        },
        mixins: [
            Connection,
            LocalStorage,
            Dates
        ],
        methods: {

            // Remove the grey highlight on tapping a ListView item
            onItemLoading: function(args) {
                const cell = args.ios;
                if (cell) {
                    cell.selectionStyle = UITableViewCellSelectionStyle.UITableViewCellSelectionStyleNone;
                }
            },
            toDetail: function(id){
                EventBus.$emit('openModal', {
                    page: 'thread',
                    props: {
                        id: id
                    }
                });
            }
        }
    }
</script>

<style scoped>

    /* List view */
    .row {
        margin: 0;
        padding: 0 12.5;
        border-bottom-width: 1;
        border-color: #e5e5e5;
    }
    ListView {
        height: 100%;
        background-color: #fff;
        separator-color: transparent;
    }

    /* Label */
    .label {
        font-weight: 400;
        padding: 0 12.5;
    }
    .row.unread .label {
        font-weight: 700;
    }
    .subtitle {
        font-size: 12;
        opacity: 0.6;
    }
    .row.unread .subtitle {
        opacity: 1;
    }
    .time-container {
        padding: 0 12.5;
    }
    .time {
        font-size: 12;
        opacity: 0.6;
    }
    .row.unread .time {
        opacity: 1;
    }
    .badge {
        font-size: 12;
        border-radius: 100%;
        background: #7ea818;
        color: #fff;
        margin: 5 0 0 0;
        padding: 2.5 5;
    }
</style>