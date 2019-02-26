<template>
    <Page :class="pageClass" actionBarHidden="true">
        <GridLayout rows="*" columns="*">
            <GridLayout row="0" col="0" rows="auto,auto,*" class="background">
                <GridLayout row="0" rows="75,1" columns="*,auto">
                    <StackLayout row="0" col="0" class="btn-container">
                        <StackLayout class="button contact-btn">
                            <Label class="button-icon fas">{{ 'fa-phone' | fonticon }}</Label>
                            <Label text="Contact" class="button-text"></Label>
                        </StackLayout>
                        <StackLayout class="button wifi-btn">
                            <Label class="button-icon fas">{{ 'fa-wifi' | fonticon }}</Label>
                            <Label text="WiFi" class="button-text"></Label>
                        </StackLayout>
                    </StackLayout>
                    <StackLayout row="0" col="1" class="quick-links-container">
                        <Label class="quick-link fa">{{ 'fa-comment' | fonticon }}</Label>
                        <Label class="quick-link fas">{{ 'fa-cog' | fonticon }}</Label>
                    </StackLayout>
                    <StackLayout row="0" col="1">
                        <AbsoluteLayout>
                            <Label class="badge badge-calendar"></Label>
                        </AbsoluteLayout>
                    </StackLayout>
                    <StackLayout row="1" col="0" colSpan="2" class="hr"></StackLayout>
                </GridLayout>
                <StackLayout row="1" class="weather-forecasts">
                    <StackLayout class="weather left">
                        <Label class="day" text="Vandaag"></Label>
                        <StackLayout class="weather-inner">
                            <StackLayout class="weather-icon-wrapper">
                                <WebView @loadFinished="weatherIconLoaded" class="weather-icon" :class="{'visible': showWeatherIcons}" src="<!DOCTYPE html><html><head><title></title><meta charset='utf-8' /><style>html,body {margin: 0;padding: 0;overflow: hidden;background: #f5f5f8;}img {border: 0;}</style></head><body><img src='https://www.campingcomfort.app/img/app/weather/rainy-1.svg' width='50' height='50'/></body></html>" />
                            </StackLayout>
                            <StackLayout>
                                <Label class="temp" text="27°C"></Label>
                            </StackLayout>
                        </StackLayout>
                    </StackLayout>
                    <StackLayout class="weather right">
                        <Label class="day" text="Morgen"></Label>
                        <StackLayout class="weather-inner">
                            <StackLayout class="weather-icon-wrapper">
                                <WebView @loadFinished="weatherIconLoaded" class="weather-icon" :class="{'visible': showWeatherIcons}" src="<!DOCTYPE html><html><head><title></title><meta charset='utf-8' /><style>html,body {margin: 0;padding: 0;overflow: hidden;background: #f5f5f8;}img {border: 0;}</style></head><body><img src='https://www.campingcomfort.app/img/app/weather/day.svg' width='50' height='50'/></body></html>" />
                            </StackLayout>
                            <StackLayout>
                                <Label class="temp" text="25°C"></Label>
                            </StackLayout>
                        </StackLayout>
                    </StackLayout>
                </StackLayout>
                <CardView row="2" class="cardStyle" radius="10">
                    <GridLayout rows="*,125">
                        <GridLayout row="0">
                            <Image row="0" class="logo" src="~/assets/images/camping-logo.png"></Image>
                        </GridLayout>
                    </GridLayout>
                </CardView>
            </GridLayout>
            <menu row="0" col="0"></menu>
            <hamburger row="0" col="0"></hamburger>
        </GridLayout>
    </Page>
</template>

<script>
    import Responsive from '../mixins/Responsive'

    export default {
        data() {
            return {
                weatherIconsLoaded: [],
                showWeatherIcons: false
            }
        },
        mixins: [
            Responsive
        ],
        methods: {

            // Register a loaded weather icon
            weatherIconLoaded() {
                this.weatherIconsLoaded.push('');

                // Show the weather icons if all icons are loaded
                if(this.weatherIconsLoaded.length === 2){
                    this.showWeatherIcons = true;
                }
            }
        }
    }
</script>

<style scoped>

    /* Background */
    .background {
        background-color: #f5f5f8;
    }

    /* Buttons */
    .btn-container {
        padding: 15 0 15 25;
        orientation: horizontal;
    }
    .wifi-btn {
        margin-left: 10;
    }
    Page.small-phone .btn-container .button .button-text {
        visibility: collapsed;
    }

    /* Quick links */
    .quick-links-container {
        padding: 15 10 15 0;
        orientation: horizontal;
    }
    .quick-link {
        padding: 10 12;
        font-size: 20;
    }
    .tablet .quick-link {
        padding: 10 17;
    }
    .badge {
        background: red;
        border-radius: 100%;
        width: 6;
        height: 6;
    }
    .badge-calendar {
        top: 52;
        left: 18;
    }
    .tablet .badge-calendar {
        left: 22;
    }

    /* HR */
    .hr {
        height: 1;
        background: #d2d4da;
        margin: 0 25;
    }

    /* Weather forecast */
    .weather-forecasts {
        padding: 15 25;
        orientation: horizontal;
    }
    .weather.left {
        padding-right: 20;
    }
    .weather.right {
        padding-left: 18;
        border-left-width: 1;
        border-left-color: #d2d4da;
    }
    .weather-inner {
        orientation: horizontal;
    }
    .weather-icon-wrapper {
        width: 50;
        height: 50;
    }
    .weather-icon {
        width: 50;
        height: 50;
        opacity: 0;
    }
    .weather-icon.visible {
        animation-name: fadeIn;
        animation-duration: 1s;
        animation-fill-mode: forwards;
    }
    .weather .day {
        font-size: 14;
    }
    .weather .temp {
        font-weight: 100;
        font-size: 30;
        padding-top: 10;
    }
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    /* Card */
    .cardStyle {
        background-color: #fff;
        margin: 10 12.5 -10 12.5;
    }

    /* Logo */
    .logo {
        margin: 50;
    }
    .tablet .logo {
        margin: 150;
    }
</style>