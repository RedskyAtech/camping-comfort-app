<template>
    <GridLayout row="0" col="0" rows="*" columns="*" class="loader" :class="[{ 'fade-in': loading.length > 0, 'fade-out': loading.length === 0 }]">
        <StackLayout row="0" col="0" width="30" height="30" verticalAlignment="center">
            <ActivityIndicator busy="true" />
        </StackLayout>
    </GridLayout>
</template>

<script>
    import EventBus from '../helpers/EventBus'

    export default {
        data: function() {
            return {
                loading: []
            };
        },
        created: function() {
            let self = this;

            // Listen to loading states
            EventBus.$on('startLoading', function(loadingId){
                self.loading.push(loadingId);
            });
            EventBus.$on('stopLoading', function(loadingId){
                for( let i = 0; i < self.loading.length; i++){
                    if ( self.loading[i] === loadingId) {
                        self.loading.splice(i, 1);
                    }
                }
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