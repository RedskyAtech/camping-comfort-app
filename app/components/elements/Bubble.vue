<template>
    <GridLayout class="bubble me" rows="auto" columns="*,12" v-if="type === 'me'">
        <StackLayout col="0" class="bubble-inner">
            <GridLayout columns="*,auto">
                <StackLayout col="0">
                    <slot></slot>
                </StackLayout>
                <Label col="1" class="time" :text="time" horizontalAlignment="right"></Label>
            </GridLayout>
        </StackLayout>
        <StackLayout col="1" class="arrow">
            <Image src="~/assets/images/bubble-me.png" width="12" height="12"></Image>
        </StackLayout>
    </GridLayout>
    <GridLayout class="bubble he" rows="auto" columns="12,*" v-else>
        <StackLayout col="0" class="arrow">
            <Image src="~/assets/images/bubble-he.png" width="12" height="12"></Image>
        </StackLayout>
        <StackLayout col="1" class="bubble-inner">
            <GridLayout rows="auto,auto" columns="*,auto">
                <Label row="0" col="0" class="name" :text="name"></Label>
                <Label row="0" col="1" class="time" :text="time" horizontalAlignment="right"></Label>
                <StackLayout row="1" col="0">
                    <slot></slot>
                </StackLayout>
            </GridLayout>
        </StackLayout>
    </GridLayout>
</template>

<script>
    import LocalStorage from '../mixins/LocalStorage'

    export default {
        props: {
            name: {
                type: String
            },
            type: {
                type: String
            },
            time: {
                type: String
            }
        },
        mixins: [
            LocalStorage
        ],
    }
</script>

<style scoped>
    .bubble {
        margin: 0 0 12.5 0;
    }
    .bubble.me .bubble-inner {
        background: #dfe9c5;
        margin-left: 35;
        padding: 12.5;
        border-radius: 10 0 10 10;
    }
    .bubble.he .bubble-inner {
        background: #e5e5e5;
        margin-right: 35;
        padding: 12.5;
        border-radius: 0 10 10 10;
    }
    .name,.time {
        opacity: 0.6;
        font-size: 12;
    }
</style>