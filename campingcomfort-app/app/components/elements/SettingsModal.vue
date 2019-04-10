<template>
    <Page :class="pageClass" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <SettingsForm v-on:saved="afterSave">
            <Fab slot="fav" row="1" col="0" bg="transparent"><Label @tap="closeModal" row="0" col="0" class="btn-icon fas" verticalAlignment="center">{{ 'fa-times' | fonticon }}</Label></Fab>
        </SettingsForm>
    </Page>
</template>

<script>
    import StatusBar from '../mixins/StatusBar'
    import EventBus from '../helpers/EventBus';
    import Responsive from '../mixins/Responsive';
    import Fab from './Fab';
    import SettingsForm from './SettingsForm';

    export default {
        mixins: [
            Responsive,
            StatusBar
        ],
        components: {
            Fab: Fab,
            SettingsForm: SettingsForm
        },
        created: function() {
            this.statusBar('hide');
        },
        methods: {
            afterSave() {
                EventBus.$emit('reInit');
                this.closeModal();
            },
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
</style>