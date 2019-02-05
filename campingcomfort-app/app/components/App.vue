<template>
    <Page>
        <GridLayout rows="auto,auto" class="background">
            <GridLayout row="0" rows="auto,1" columns="*,auto" class="background-grid">
                <StackLayout row="0" col="0" class="contact-btn-container">
                    <StackLayout class="button">
                        <Label class="button-icon fas">{{ 'fa-phone' | fonticon }}</Label>
                        <Label text="Contact"></Label>
                    </StackLayout>
                </StackLayout>
                <StackLayout row="0" col="1" class="icons-container">
                    <Label class="background-grid-icon fa">{{ 'fa-calendar-alt' | fonticon }}</Label>
                    <Label class="background-grid-icon fas">{{ 'fa-inbox' | fonticon }}</Label>
                    <Label class="background-grid-icon fas">{{ 'fa-cog' | fonticon }}</Label>
                </StackLayout>
                <StackLayout row="0" col="1">
                    <AbsoluteLayout>
                        <Label class="badge badge-calendar"></Label>
                        <Label class="badge badge-inbox"></Label>
                    </AbsoluteLayout>
                </StackLayout>
                <StackLayout row="1" col="0" colSpan="2" class="hr"></StackLayout>
            </GridLayout>
            <GridLayout row="1" class="forecasts">
                <StackLayout>
                    <Label class="day" text="Today"></Label>
                    <Label class="temp" text="27"></Label>
                </StackLayout>
            </GridLayout>
        </GridLayout>
    </Page>
</template>

<style scoped>
    .background {
        background-color: #f5f5f8;
    }
    .background-grid {
        width: 100%;
    }
    .contact-btn-container {
        horizontal-align: left;
        padding: 15 0 15 25;
    }
    .icons-container {
        padding: 15 10 15 0;
        orientation: horizontal;
    }
    .background-grid-icon {
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
    .hr {
        height: 1;
        background: #d2d4da;
        margin: 0 25;
    }
    .forecasts {
        orientation: horizontal;
        padding: 15 25;
    }
    .day {

    }
    .temp {
        font-weight: 100;
        font-size: 30;
    }
</style>