<template>
    <Page :class="pageClass" actionBarHidden="true">
        <GridLayout rows="*,*" columns="*">
            <Image row="0" col="0" src="~/assets/images/demo/campground.jpg" class="hero-image"></Image>
            <StackLayout row="0" col="0" class="hero-overlay"></StackLayout>
        </GridLayout>
    </Page>
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
        ]
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
</style>