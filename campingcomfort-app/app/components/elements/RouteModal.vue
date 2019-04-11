<template>
    <Page :class="pageClass" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <GridLayout rows="*" columns="*">
            <WebView row="0" col="0" :src="url"></WebView>
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
        props: {
            url: ''
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