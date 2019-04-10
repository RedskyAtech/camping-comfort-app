<template>
    <StackLayout v-if="bg === 'transparent'" horizontalAlignment="right" verticalAlignment="bottom" class="fab transparent">
        <slot></slot>
    </StackLayout>
    <CardView v-else horizontalAlignment="right" verticalAlignment="bottom" class="fab cardStyle" radius="30">
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
        border-radius: 30;
        border-color: #fff;
        border-width: 1;
    }
    .btn-icon {
    }
</style>

<script>
    export default {
        props: {
            bg: {
                type: String,
                default: 'default'
            }
        }
    }
</script>