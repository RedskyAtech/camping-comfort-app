<template>
    <GridLayout rows="auto, *" columns="auto, *">
        <ScrollView :row="hasHero ? 0 : 1" col="0" :rowSpan="hasHero ? 2 : 1" colSpan="2" @scroll="scrolling">
            <slot></slot>
        </ScrollView>
        <StackLayout v-if="showHeader" orientation="horizontal" row="0" col="0" class="header-container" :class="headerContainerClass" ref="backBtnContainer">
            <GridLayout columns="70,*,70">
                <Label row="0" v-if="showBackBtn" class="btn-icon fas back-btn" verticalAlignment="center" @tap="goBack">{{ (inModal ? 'fa-times' : 'fa-arrow-left') | fonticon }}</Label>
                <Label col="1" :text="title" class="title"></Label>
            </GridLayout>
        </StackLayout>
        <StackLayout v-else row="0" col="0" height="48"></StackLayout>
    </GridLayout>
</template>

<script>
    import EventBus from '../helpers/EventBus'
    import Responsive from '../mixins/Responsive'

    export default {
        props: {

            // The title in the header
            title: {
                type: String,
                default: ''
            },

            // Indicated if the page has a hero image
            hasHero: {
                type: Boolean
            },

            // Indicates if the page is ready to show the header
            showHeader: {
                type: Boolean,
                default: false
            },

            // Show the back button
            showBackBtn: {
                type: Boolean,
                default: false
            },

            // Emit a back event instead of triggering the usual back or close modal event
            // Useful when something custom needs to happen when tapping the back button
            emitBack: {
                type: Boolean,
                default: false
            },

            // Set to true if this page is opened in a modal
            inModal: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                heroHeight: 0,
                headerContainerClass: ''
            }
        },
        watch: {
            showHeader: function(val) {
                if(val === true) {
                    this.showHeaderFunc();
                }
            }
        },
        mixins: [
            Responsive
        ],
        created: function() {

            // If showHeader is passed as true directly in the props
            if(this.showHeader) {
                this.showHeaderFunc();
            }
        },
        methods: {
            showHeaderFunc: function() {
                if(this.hasHero === false) {
                    this.headerContainerClass = 'opaque';
                }
                else {

                    // Set the hero height based on the screen size
                    if(this.pageClass === 'xxs') {
                        this.heroHeight = 232;
                    }
                    if(this.pageClass === 'xs') {
                        this.heroHeight = 232;
                    }
                    if(this.pageClass === 'sm') {
                        this.heroHeight = 232;
                    }
                    if(this.pageClass === 'md') {
                        this.heroHeight = 270;
                    }
                    if(this.pageClass === 'lg') {
                        this.heroHeight = 432;
                    }
                    if(this.pageClass === 'xl') {
                        this.heroHeight = 576;
                    }
                }
            },
            scrolling: function(data) {
                if(this.hasHero) {

                    // Define the back button container
                    let backBtnContainerEl = this.$refs.backBtnContainer;
                    if(backBtnContainerEl !== undefined) {
                        let backBtnContainerNV = backBtnContainerEl.nativeView;

                        // Change the back button container appearance
                        if(data.scrollY >= (this.heroHeight - backBtnContainerNV.getActualSize().height)) {
                            this.headerContainerClass = 'opaque';
                        }
                        else {
                            this.headerContainerClass = '';
                        }
                    }
                }
            },
            goBack: function(){
                if(this.emitBack) {
                    this.$emit('back');
                }
                else {
                    if(this.inModal) {
                        this.$modal.close();
                    }
                    else {
                        EventBus.$emit('back');
                    }
                }
            }
        }
    }
</script>

<style scoped>

    /* Back button */
    .header-container {
        width: auto;
    }
    .back-btn {
        padding: 15 25;
        color: #fff;
    }
    .header-container .title {
        visibility: collapsed;
    }
    .header-container.opaque {
        width: 100%;
        background: #fff;
        border-bottom-width: 1;
        border-color: #e5e5e5;
        animation-name: showMenu;
        animation-duration: 250ms;
        animation-fill-mode: forwards;
    }
    .header-container .title {
        visibility: collapsed;
    }
    .header-container .title {
        color: #fff;
        text-align: center;
        font-weight: 700;
        padding: 12.5;
    }
    .header-container.opaque .back-btn {
        color: #191919;
    }
    .header-container.opaque .title {
        visibility: visible;
        color: #191919;
    }
    @keyframes showMenu {
        from {opacity: 0;}
        to {opacity: 1;}
    }
</style>