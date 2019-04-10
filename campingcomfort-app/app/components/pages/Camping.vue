<template>
    <Page :class="pageClass" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <GridLayout rows="auto,*" columns="*">
            <StackLayout row="0" class="title-container">
                <Label :text="$t('camping.title')"></Label>
            </StackLayout>
            <CampingList row="1"></CampingList>
        </GridLayout>
    </Page>
</template>

<script>
    import StatusBar from '../mixins/StatusBar'
    import Responsive from '../mixins/Responsive'
    import CampingList from '../elements/CampingList'

    export default {
        data() {
            return {
            }
        },
        mixins: [
            Responsive,
            StatusBar
        ],
        components: {
            'CampingList': CampingList
        },
        created: function() {
            this.statusBar('hide');
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