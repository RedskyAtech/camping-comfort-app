<template>
    <Page :class="pageClass" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <GridLayout cols="*" rows="*" class="page">
            <SettingsForm v-on:saved="afterSave">
                <Fab slot="fav" row="1" col="0" bg="transparent"><GridLayout row="0" col="0" rows="*" columns="*" @tap="closeModal"><Label row="0" col="0" class="btn-icon fas" verticalAlignment="center">{{ 'fa-times' | fonticon }}</Label></GridLayout></Fab>
            </SettingsForm>
        </GridLayout>
    </Page>
</template>

<script>
    import EventBus from '../helpers/EventBus';
    import Responsive from '../mixins/Responsive';
    import Fab from './Fab';
    import SettingsForm from './SettingsForm';

    export default {
        mixins: [
            Responsive
        ],
        components: {
            Fab: Fab,
            SettingsForm: SettingsForm
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
    Page, .page {
        background: #103029;
    }
</style>