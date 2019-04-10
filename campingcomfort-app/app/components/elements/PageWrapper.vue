<template>
    <Page :class="pageClass" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <GridLayout rows="*" columns="*">
            <GridLayout row="0" col="0" rows="auto,*" class="background">
                <GridLayout row="0" rows="75,1" columns="*,auto,*">
                    <StackLayout row="0" col="0" class="btn-container">
                        <StackLayout class="button back-btn" @tap="$navigateBack">
                            <Label class="button-icon fas">{{ 'fa-arrow-left' | fonticon }}</Label>
                        </StackLayout>
                    </StackLayout>
                    <Label :text="pageTitle" row="0" col="1" class="page-title"></Label>
                    <StackLayout row="1" col="0" colSpan="3" class="hr"></StackLayout>
                </GridLayout>
                <StackLayout row="1">
                    <ScrollView>
                        <slot name="content"></slot>
                    </ScrollView>
                </StackLayout>
            </GridLayout>
            <menu row="0" col="0"></menu>
            <hamburger row="0" col="0"></hamburger>
        </GridLayout>
    </Page>
</template>

<script>
    import StatusBar from '../mixins/StatusBar'
    import Responsive from '../mixins/Responsive'

    export default {
        mixins: [
            Responsive,
            StatusBar
        ],
        props: {
            pageTitle: ''
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
        horizontal-align: left;
        padding: 15 0 15 5;
        orientation: horizontal;
    }
    .btn-container .button.back-btn {
        border-color: #f5f5f8;
        padding-left: 20;
    }

    /* Page title */
    .page-title {
        font-size: 18;
    }

    /* HR */
    .hr {
        height: 1;
        background: #d2d4da;
        margin: 0 25;
    }

    /* Content */
    ScrollView {
        height: 100%;
    }
</style>