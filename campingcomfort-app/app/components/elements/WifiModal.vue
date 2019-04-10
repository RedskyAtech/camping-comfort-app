<template>
    <Page :class="pageClass" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <GridLayout rows="*" columns="*">
            <Label text="Wifi" class="content" horizontalAlignment="center"></Label>
            <Fab><GridLayout rows="*" columns="*" @tap="closeModal"><Label row="0" col="0" class="btn-icon fas" verticalAlignment="center">{{ 'fa-times' | fonticon }}</Label></GridLayout></Fab>
        </GridLayout>
    </Page>
</template>

<script>
    import StatusBar from '../mixins/StatusBar'
    import EventBus from '../helpers/EventBus'
    import Responsive from '../mixins/Responsive'
    import Fab from '../elements/Fab'

    export default {
        mixins: [
            Responsive,
            StatusBar
        ],
        components: {
            Fab: Fab
        },
        methods: {
            closeModal: function(){
                this.$modal.close();
            }
        }
    }
</script>

<style scoped>
    Page {
        background: #103029;
    }
    .content {
        color: #fff;
    }
</style>