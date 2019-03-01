<template>
    <Page :class="pageClass" actionBarHidden="true">
        <GridLayout rows="*, auto" columns="*">
            <StackLayout row="0" col="0">
                <Frame id="mainContent">
                    <Home/>
                </Frame>
            </StackLayout>
            <StackLayout row="1" col="0" class="tabbar">
                <GridLayout rows="*" columns="*,*,*,*">
                    <StackLayout verticalAlignment="middle" row="0" col="0" class="tab" :class="[{'active': activeTab === 1}]" @tap="navigate(1, 'home', true)">
                        <Label class="tab-icon fas">{{ 'fa-home' | fonticon }}</Label>
                        <Label class="tab-label" text="Voorpagina"></Label>
                    </StackLayout>
                    <StackLayout verticalAlignment="middle" row="0" col="1" class="tab" :class="[{'active': activeTab === 2}]" @tap="navigate(2, 'camping', true)">
                        <Label class="tab-icon fas">{{ 'fa-campground' | fonticon }}</Label>
                        <Label class="tab-label" text="Camping"></Label>
                    </StackLayout>
                    <StackLayout verticalAlignment="middle" row="0" col="2" class="tab" :class="[{'active': activeTab === 3}]" @tap="navigate(3, 'nearby', true)">
                        <Label class="tab-icon fas">{{ 'fa-map-marker-alt' | fonticon }}</Label>
                        <Label class="tab-label" text="Omgeving"></Label>
                    </StackLayout>
                    <StackLayout verticalAlignment="middle" row="0" col="3" class="tab" :class="[{'active': activeTab === 4}]" @tap="navigate(4, 'events', true)">
                        <Label class="tab-icon fas">{{ 'fa-calendar-alt' | fonticon }}</Label>
                        <Label class="tab-label" text="Agenda"></Label>
                    </StackLayout>
                </GridLayout>
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
    import Responsive from '../mixins/Responsive'
    import EventBus from '../helpers/EventBus'
    import Home from '../pages/Home'
    import Camping from '../pages/Camping'
    import Nearby from '../pages/Nearby'
    import Events from '../pages/Events'
    import Detail from '../pages/Detail'

    export default {
        data() {
            return {
                activeTab: 1
            }
        },
        mixins: [
            Responsive
        ],
        mounted: function(){
            let self = this;

            // Listen to navigation requests
            EventBus.$on('navigate', function(data){
                self.navigate(data.tab, data.page);
            });

            // Listen to go back navigation requests
            EventBus.$on('back', function(){
                self.back();
            });
        },
        components: {

            // Pages
            Home: Home,
            Camping: Camping,
            Nearby: Nearby,
            Events: Events,
            Detail: Detail
        },
        methods: {
            navigate: function(tab, page, switchTab=false){

                // Set the right tab
                this.activeTab = tab;

                // Navigate to the page
                let Component;
                if(page === 'home'){
                    Component = Home;
                }
                if(page === 'camping'){
                    Component = Camping;
                }
                if(page === 'nearby'){
                    Component = Nearby;
                }
                if(page === 'events'){
                    Component = Events;
                }
                if(page === 'detail'){
                    Component = Detail;
                }
                if(switchTab === true){
                    this.$navigateTo(Component, {
                        frame: 'mainContent',
                        clearHistory: true,
                        animated: false
                    });
                }
                else {
                    this.$navigateTo(Component, {
                        frame: 'mainContent'
                    });
                }
            },
            back: function(){
                this.$navigateBack({
                    frame: 'mainContent'
                });
            }
        }
    }
</script>

<style scoped>

    /* Tabbar */
    .tabbar {
        background-color: #f8f8f8;
        border-top-width: 1;
        border-color: #e5e5e5;
        color: #8f99ac;
        padding: 10 12.5;
    }
    .tab {
        text-align: center;
    }
    .tab.active {
        color: #0a7cf7
    }
    .tab-icon {
        font-size: 16;
    }
    .tab-label {
        font-size: 12;
        padding-top: 3;
    }
</style>