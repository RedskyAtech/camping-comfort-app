<template>
    <Page :class="pageClass" actionBarHidden="true">
        <GridLayout rows="*,*" columns="*">
            <Image row="0" col="0" src="~/assets/images/demo/campground.jpg" class="hero-image"></Image>
            <StackLayout row="0" col="0" class="hero-overlay"></StackLayout>
            <GridLayout row="0" col="0" rows="auto,*" columns="*,auto">
                <StackLayout row="0" col="0">
                    <StackLayout class="btn-container">
                        <StackLayout class="btn wifi-btn">
                            <Label class="btn-icon fas">{{ 'fa-wifi' | fonticon }}</Label>
                            <Label class="btn-text" text="WiFi"></Label>
                        </StackLayout>
                    </StackLayout>
                </StackLayout>
                <StackLayout row="0" col="1">
                    <StackLayout class="quick-links-container">
                        <GridLayout columns="auto,auto">
                            <Label class="quick-link fa" col="0">{{ 'fa-comment' | fonticon }}</Label>
                            <Label class="badge-inbox" text="1" col="0"></Label>
                            <Label class="quick-link fas" col="1">{{ 'fa-cog' | fonticon }}</Label>
                        </GridLayout>
                    </StackLayout>
                </StackLayout>
                <StackLayout row="1" col="0" colSpan="2" class="hero-title-container" horizontalAlignment="center" verticalAlignment="center">
                    <Label text="Camping International" class="hero-title" textWrap="true"></Label>
                    <GridLayout columns="auto" rows="auto" horizontalAlignment="center">
                        <StackLayout col="0" row="0" class="btn contact-btn">
                            <Label class="btn-icon fas">{{ 'fa-info' | fonticon }}</Label>
                            <Label class="btn-text" text="Receptie"></Label>
                        </StackLayout>
                    </GridLayout>
                </StackLayout>
            </GridLayout>
            <StackLayout row="1" col="0">
                <GridLayout rows="auto,*">
                    <GridLayout row="0" columns="*">
                        <StackLayout col="0" class="tabs-bottom-line" verticalAlignment="bottom"></StackLayout>
                        <StackLayout col="0" class="tabs-container" orientation="horizontal">
                            <StackLayout class="tab" @tap="activateTab(1)" :class="[{'active': activeTab === 1}]">
                                <Label class="tab-label" text="Binnenkort"></Label>
                            </StackLayout>
                            <StackLayout class="tab" @tap="activateTab(2)" :class="[{'active': activeTab === 2}]">
                                <Label class="tab-label" text="Mijn vakantie"></Label>
                            </StackLayout>
                        </StackLayout>
                    </GridLayout>
                    <ScrollView row="1">
                        <GridLayout rows="*" columns="*" height="100%">
                            <EventList row="0" col="0" class="tab-content" :class="[{'active': activeTab === 1}]"></EventList>
                            <StackLayout row="0" col="0" class="tab-content" :class="[{'active': activeTab === 2}]">
                                <Label text="Tab 2"></Label>
                            </StackLayout>
                        </GridLayout>
                    </ScrollView>
                </GridLayout>
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
    import Responsive from '../mixins/Responsive'
    import EventList from '../elements/EventList'

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
            'EventList': EventList
        },
        methods: {
            activateTab: function(tab){
                this.activeTab = tab;
            }
        }
    }
</script>

<style scoped>

    /* Hero */
    .hero-image {
        stretch: aspectFill;
        margin-top: -40;
    }
    .hero-overlay {
        background-color: #000;
        opacity: 0.35;
    }
    .hero-title-container {
        text-align: center;
        padding: 0 12.5;
    }
    .hero-title {
        color: #fff;
        font-size: 25;
        font-weight: 700;
    }

    /* Buttons */
    .btn-container {
        padding: 12.5 0 0 12.5;
        orientation: horizontal;
    }
    .wifi-btn {
        color: #fff;
        border-color: #fff;
    }
    .contact-btn {
        margin-top: 10;
        color: #fff;
        border-color: #fff;
    }

    /* Quick links */
    .quick-links-container {
        padding: 12.5 12.5 0 0;
        orientation: horizontal;
        color: #fff;
    }
    .quick-link {
        padding: 10 12.5 10 12.5;
        font-size: 20;
    }
    .badge-inbox {
        background-color: red;
        width: 20;
        height: 20;
        font-size: 12;
        text-align: center;
        font-weight: 700;
        border-radius: 10;
        margin-top: -25;
        margin-right: -25;
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
</style>