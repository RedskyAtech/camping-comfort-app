<template>
    <StackLayout row="0" col="0" class="hamburger" horizontalAlignment="right" verticalAlignment="bottom">
        <CardView class="cardStyle" radius="40" @tap="toggleMenu">
            <Label class="fas" v-if="!menuVisible">{{ 'fa-bars' | fonticon }}</Label>
            <Label class="fas" v-else>{{ 'fa-times' | fonticon }}</Label>
        </CardView>
    </StackLayout>
</template>

<script>
    import EventBus from '../helpers/EventBus.js'

    export default {
        data: function(){
            return {
                menuVisible: false
            }
        },
        methods: {
            toggleMenu: function(){
                EventBus.$emit('toggle_menu');

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
    .hamburger {
        width: 80;
        height: 80;
        margin: 0 25 25 0;
    }
    .cardStyle {
        background-color: #fff;
        width: 80;
        height: 80;
        text-align: center;
    }
    .cardStyle Label {
        font-size: 22;
    }
</style>