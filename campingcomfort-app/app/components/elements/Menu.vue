<template>
    <StackLayout row="0" col="0" class="menu" :class="[{ 'visible': menuVisible === true }, { 'hidden': menuVisible === false }]">
        <GridLayout rows="*" columns="*">
            <Label row="0" col="0" text="Naar Evenementen" @tap="$navigateTo(Events)" horizontalAlignment="center"></Label>
        </GridLayout>
    </StackLayout>
</template>

<script>
    import EventBus from '../helpers/EventBus.js'
    import Events from '../pages/Events'

    export default {
        data: function(){
            return {
                menuVisible: null,

                // Pages
                Events: Events
            }
        },
        created: function(){
            console.log('created');
            this.menuVisible = null;
        },
        mounted: function(){
            console.log('mounted');
            this.menuVisible = null;
            let self = this;
            EventBus.$on('toggle_menu', function(){
                self.toggleMenu();
            });
        },
        methods: {
            toggleMenu: function(){
                if(this.menuVisible === true){
                    this.menuVisible = false;
                }
                else {
                    this.menuVisible = true;
                }
            }
        }
    }
</script>

<style scoped>

    /* Menu */
    .menu {
        width: 100%;
        height: 100%;
        background-color: #454f63;
        opacity: 0;
        color: #fff;
    }
    .menu.visible {
        animation-name: fadeIn;
        animation-duration: 0.25;
        animation-fill-mode: forwards;
        animation-timing-function: ease-out;
    }
    .menu.hidden {
        animation-name: fadeOut;
        animation-duration: 0.25;
        animation-fill-mode: forwards;
        animation-timing-function: ease-out;
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
</style>