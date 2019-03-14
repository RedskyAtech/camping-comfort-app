<template>
    <Page :class="pageClass" actionBarHidden="true">
        <GridLayout rows="*" columns="*">
            <WebView row="0" col="0" src="https://maps.google.com"></WebView>
            <Fab><Label @tap="closeModal" row="0" col="0" class="btn-icon fas" verticalAlignment="center">{{ 'fa-times' | fonticon }}</Label></Fab>
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
    Page {
        background: #fff;
    }
</style>