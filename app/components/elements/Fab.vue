<template>
    <StackLayout :backgroundColor="backgroundColor" :color="color" :borderColor="borderColor" horizontalAlignment="right" verticalAlignment="center" class="fab" :class="{ 'android': $isAndroid, 'ios': !$isAndroid}" @tap="$emit('tapped')">
        <slot></slot>
    </StackLayout>
</template>

<style scoped>
    .fab {
        width: 60;
        height: 60;
        text-align: center;
        margin-right: 18.75;
        margin-bottom: 18.75;
        border-width: 1;
    }
    .fab.ios {
        border-radius: 30;
    }
    .fab.android {
        border-radius: 120;
    }
</style>

<script>
    export default {
        props: {
            backgroundColor: {
                type: String,
                default: '#fff'
            },
            color: {
                type: String,
                default: '#191919'
            },
            borderColor: {
                type: String,
                default: '#191919'
            }
        }
    }
</script>