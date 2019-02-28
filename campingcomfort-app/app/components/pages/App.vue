<template>
    <Page :class="pageClass" actionBarHidden="true">
        <GridLayout rows="*, auto">
            <StackLayout row="0">
                <Home class="page" :class="[{'active': activeTab === 1}]"></Home>
                <Camping class="page" :class="[{'active': activeTab === 2}]"></Camping>
            </StackLayout>
            <StackLayout row="1" class="tabbar">
                <GridLayout rows="*" columns="*,*,*,*">
                    <StackLayout verticalAlignment="middle" row="0" col="0" class="tab" :class="[{'active': activeTab === 1}]" @tap="activateTab(1)">
                        <Label class="tab-icon fas">{{ 'fa-home' | fonticon }}</Label>
                        <Label class="tab-label" text="Voorpagina"></Label>
                    </StackLayout>
                    <StackLayout verticalAlignment="middle" row="0" col="1" class="tab" :class="[{'active': activeTab === 2}]" @tap="activateTab(2)">
                        <Label class="tab-icon fas">{{ 'fa-campground' | fonticon }}</Label>
                        <Label class="tab-label" text="Camping"></Label>
                    </StackLayout>
                    <StackLayout verticalAlignment="middle" row="0" col="2" class="tab" :class="[{'active': activeTab === 3}]" @tap="activateTab(3)">
                        <Label class="tab-icon fas">{{ 'fa-map-marker-alt' | fonticon }}</Label>
                        <Label class="tab-label" text="Omgeving"></Label>
                    </StackLayout>
                    <StackLayout verticalAlignment="middle" row="0" col="3" class="tab" :class="[{'active': activeTab === 4}]" @tap="activateTab(4)">
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
    import Home from '../pages/Home'
    import Camping from '../pages/Camping'

    export default {
        data() {
            return {
                activeTab: 1
            }
        },
        mixins: [
            Responsive
        ],
        components: {
            'Home': Home,
            'Camping': Camping
        },
        mounted: function(){
            this.activateTab(1);
        },
        methods: {
            activateTab: function(tab){
                this.activeTab = tab;
            }
        }
    }
</script>

<style scoped>

    /* Background */
    Page {
    }

    /* Tabbar */
    .tabbar {
        background-color: #f8f8f8;
        border-top-width: 1;
        border-color: #e5e5e5;
        color: #8e8e8e;
        padding: 10;
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

    /* Pages */
    .page {
        visibility: collapsed;
    }
    .page.active {
        visibility: visible;
    }
</style>