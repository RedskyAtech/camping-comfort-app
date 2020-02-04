<template>
    <GridLayout rows="auto,auto,*" columns="*">
        <StackLayout row="0" class="title-container">
            <Label :text="$t('nearby.title')"></Label>
        </StackLayout>
        <GridLayout row="1" columns="*">
            <StackLayout col="0" class="tabs-bottom-line" verticalAlignment="bottom"></StackLayout>
            <StackLayout col="0" class="tabs-container" orientation="horizontal">
                <StackLayout class="tab" @tap="activateTab(1)" :class="[{'active': activeTab === 1}]">
                    <Label class="tab-label" :text="$t('nearby.arts_entertainment')"></Label>
                </StackLayout>
                <StackLayout class="tab" @tap="activateTab(2)" :class="[{'active': activeTab === 2}]">
                    <Label class="tab-label" :text="$t('nearby.food_beverage')"></Label>
                </StackLayout>
                <StackLayout class="tab" @tap="activateTab(3)" :class="[{'active': activeTab === 3}]">
                    <Label class="tab-label" :text="$t('nearby.shopping_retail')"></Label>
                </StackLayout>
            </StackLayout>
        </GridLayout>
        <NearbyList row="2" class="tab-content" :class="[{'active': activeTab === 1}]" @if="activeTab === 1" type="arts_entertainment"></NearbyList>
        <NearbyList row="2" class="tab-content" :class="[{'active': activeTab === 2}]" @if="activeTab === 2" type="food_beverage"></NearbyList>
        <NearbyList row="2" class="tab-content" :class="[{'active': activeTab === 3}]" @if="activeTab === 3" type="shopping_retail"></NearbyList>
        <!--<StackLayout row="2" class="tab-content" :class="[{'active': activeTab === 2}]">
            <StackLayout class="temp-tab-content">
                <Label text="Binnenkort..."></Label>
            </StackLayout>
        </StackLayout>-->
    </GridLayout>
</template>

<script>
    import Responsive from '../mixins/Responsive'
    import NearbyList from '../elements/NearbyList'

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
            'NearbyList': NearbyList
        },
        methods: {
            activateTab: function(tab){
                this.activeTab = tab;
            }
        }
    }
</script>

<style scoped>

    /* Title */
    .title-container {
        background-color: #ffffff;
        text-align: center;
        font-weight: 700;
        padding: 12.5;

        /* Remove these if tabs are placed */
        border-bottom-width: 1;
        border-color: #e5e5e5;
    }

    /* Tabs */
    .tabs-container {
        font-size: 14;
    }
    .tabs-bottom-line {
        border-bottom-width: 1;
        border-color: #e5e5e5;
    }
    .tab {
        padding: 10 12.5;
        color: #8e8e8e;
    }
    .tab.active {
        color: #0a7cf7;
        border-bottom-width: 2;
        border-color: #0a7cf7;
    }
    .tab-content {
        visibility: collapsed;
    }
    .tab-content.active {
        visibility: visible;
    }
    .temp-tab-content {
        padding: 12.5;
    }
</style>