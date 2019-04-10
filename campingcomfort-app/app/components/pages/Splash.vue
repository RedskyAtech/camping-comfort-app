<template>
    <Page :class="pageClass" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <SettingsForm v-on:saved="afterSave"></SettingsForm>
    </Page>
</template>

<script>
    import StatusBar from '../mixins/StatusBar'
    import EventBus from '../helpers/EventBus';
    import Responsive from '../mixins/Responsive';
    import SettingsForm from '../elements/SettingsForm';
    import App from './App';

    export default {
        mixins: [
            Responsive,
            StatusBar
        ],
        components: {
            SettingsForm: SettingsForm,
            App: App
        },
        methods: {
            afterSave() {
                this.$navigateTo(App, {
                    clearHistory: true,
                    transition: {
                        name: 'fade',
                    }
                });
            }
        }
    }
</script>

<style scoped>
    Page {
        background: #103029;
    }
</style>