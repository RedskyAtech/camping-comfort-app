<template>
    <Page>
        <GridLayout rows="auto,auto,*" class="background">
            <GridLayout row="0" rows="auto,1" columns="*,auto">
                <StackLayout row="0" col="0" class="contact-btn-container">
                    <StackLayout class="button">
                        <Label class="button-icon fas">{{ 'fa-phone' | fonticon }}</Label>
                        <Label text="Contact"></Label>
                    </StackLayout>
                </StackLayout>
                <StackLayout row="0" col="1" class="quick-links-container">
                    <Label class="quick-link fa">{{ 'fa-calendar-alt' | fonticon }}</Label>
                    <Label class="quick-link fas">{{ 'fa-inbox' | fonticon }}</Label>
                    <Label class="quick-link fas">{{ 'fa-cog' | fonticon }}</Label>
                </StackLayout>
                <StackLayout row="0" col="1">
                    <AbsoluteLayout>
                        <Label class="badge badge-calendar"></Label>
                        <Label class="badge badge-inbox"></Label>
                    </AbsoluteLayout>
                </StackLayout>
                <StackLayout row="1" col="0" colSpan="2" class="hr"></StackLayout>
            </GridLayout>
            <StackLayout row="1" class="weather-forecasts">
                <StackLayout class="weather left">
                    <Label class="day" text="Today"></Label>
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
                    <Label class="day" text="Tomorrow"></Label>
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
                <GridLayout rows="*,100">
                    <GridLayout row="0" rows="*" cols="*">
                        <Image row="0" col="0" class="logo" src="~/assets/images/camping-logo.png"></Image>
                    </GridLayout>
                    <StackLayout row="1" style="background-color: green;">

                    </StackLayout>
                </GridLayout>
            </CardView>
        </GridLayout>
    </Page>
</template>

<script>
    export default {
        data() {
            return {
                weatherIconsLoaded: [],
                showWeatherIcons: false
            }
        },
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

    /* Contact button */
    .contact-btn-container {
        horizontal-align: left;
        padding: 15 0 15 25;
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
    .badge-inbox {
        top: 52;
        left: 62;
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
</style>