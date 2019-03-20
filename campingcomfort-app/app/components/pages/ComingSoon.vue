<template>
    <Page :class="pageClass" actionBarHidden="true">
        <GridLayout rows="auto,*" columns="*">
            <StackLayout row="0" class="title-container">
                <Label :text="title"></Label>
            </StackLayout>
            <ScrollView row="1">
                <Label :text="$t('comingSoon.comingSoon')" horizontalAlignment="center" verticalAlignment="center"></Label>
            </ScrollView>
            <Fab v-if="showBackBtn" row="1"><Label @tap="goBack" row="0" col="0" class="btn-icon fas" verticalAlignment="center">{{ 'fa-arrow-left' | fonticon }}</Label></Fab>
        </GridLayout>
    </Page>
</template>

<script>
    import EventBus from '../helpers/EventBus'
    import Responsive from '../mixins/Responsive'
    import Fab from '../elements/Fab'

    export default {
        data() {
            return {}
        },
        props: {
            title: {
                type: String,
                default: ''
            },
            showBackBtn: {
                type: Boolean,
                default: false
            }
        },
        mixins: [
            Responsive
        ],
        components: {
            Fab: Fab
        },
        methods: {
            goBack: function(){
                EventBus.$emit('back');
            }
        }
    }
</script>

<style scoped>

    /* Title */
    .title-container {
        background-color: #f8f8f8;
        text-align: center;
        font-weight: 700;
        padding: 12.5;
        border-bottom-width: 1;
        border-color: #e5e5e5;
    }
</style>