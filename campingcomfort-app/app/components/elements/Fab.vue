<template>
    <StackLayout v-if="bg === 'transparent'" horizontalAlignment="right" verticalAlignment="center" class="fab transparent">
        <slot></slot>
    </StackLayout>
    <CardView v-else horizontalAlignment="right" verticalAlignment="center" class="fab cardStyle" :radius="fabRadius">
        <slot></slot>
    </CardView>
</template>

<style scoped>
    .fab {
        width: 60;
        height: 60;
        margin-right: 18.75;
        margin-bottom: 18.75;
        text-align: center;
    }
    .fab.cardStyle {
        background: #fff;
    }
    .fab.transparent {
        color: #fff;
        border-radius: 120;
        border-color: #fff;
        border-width: 1;
    }
</style>

<script>
    export default {
        props: {
            bg: {
                type: String,
                default: 'default'
            }
        },
        computed: {
            fabRadius: function() {
                if(this.$isAndroid) {
                    return 120;
                }
                else {
                    return 30;
                }
            }
        }
    }
</script>