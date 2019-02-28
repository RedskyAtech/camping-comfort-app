<template>
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
    </GridLayout>
</template>

<script>
    import Responsive from '../mixins/Responsive'

    export default {
        data() {
            return {
            }
        },
        mixins: [
            Responsive
        ],
        methods: {
        }
    }
</script>

<style scoped>
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
        padding: 0 25;
    }
    .hero-title {
        color: #fff;
        font-size: 25;
        font-weight: 700;
    }

    /* Buttons */
    .btn-container {
        padding: 12.5 0 0 25;
        orientation: horizontal;
    }
    .btn {
        orientation: horizontal;
        background-color: transparent;
        border-width: 1;
        border-radius: 100%;
        border-color: #fff;
        padding: 10 20;
        font-weight: 500;
        color: #fff;
        font-size: 14;
    }
    .btn-icon {
        fonts-size: 16;
    }
    .btn-text {
        padding-left: 10;
    }
    .contact-btn {
        margin-top: 10;
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
</style>