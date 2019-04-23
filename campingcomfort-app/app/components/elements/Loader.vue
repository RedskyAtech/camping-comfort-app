<template>
    <GridLayout row="0" col="0" rows="*" columns="*" class="loader" :class="[{ 'fade-in': loading === true, 'fade-out': loading === false }]">
        <StackLayout row="0" col="0" width="30" height="30">
            <ActivityIndicator busy="true" />
        </StackLayout>
    </GridLayout>
</template>

<script>
    import EventBus from '../helpers/EventBus'

    export default {
        data: function() {
            return {
                loading: ''
            };
        },
        created: function() {
            let self = this;

            // Listen to loading states
            EventBus.$on('startLoading', function(){
                self.loading = true;
            });
            EventBus.$on('stopLoading', function(){
                self.loading = false;
            });
        }
    }
</script>

<style scoped>
    .loader.fade-in {
        opacity: 1;
    }
    .loader.fade-out {
        animation-name: fadeOut;
        animation-duration: 500ms;
        animation-fill-mode: forwards;
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
</style>