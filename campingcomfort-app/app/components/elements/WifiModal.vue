<template>
    <Page :class="pageClass" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <GridLayout rows="*" columns="*" class="page">
            <Label text="Wifi" class="content" horizontalAlignment="center"></Label>
            <Fab verticalAlignment="bottom"><GridLayout rows="*" columns="*" @tap="closeModal"><Label row="0" col="0" class="btn-icon fas" verticalAlignment="center">{{ 'fa-times' | fonticon }}</Label></GridLayout></Fab>
        </GridLayout>
    </Page>
</template>

<script>
    import EventBus from '../helpers/EventBus'
    import Responsive from '../mixins/Responsive'
    import Fab from '../elements/Fab'

    export default {
        mixins: [
            Responsive
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
    Page, .page {
        background: #103029;
    }
    .content {
        color: #fff;
    }
</style>