<template>
    <StackLayout horizontalAlignment="center" verticalAlignment="center">
        <StackLayout class="placeholder">
            <Label :class="'icon '+iconLabelClass">{{ iconClass | fonticon }}</Label>
            <Label class="title" :text="title" textWrap="true"></Label>
            <Label class="text" :text="text" textWrap="true"></Label>
        </StackLayout>
    </StackLayout>
</template>

<script>
    export default {
        props: {
            iconLabelClass: String,
            iconClass: String,
            title: String,
            text: String
        }
    }
</script>

<style scoped>
    .placeholder {
        text-align: center;
        color: #8e8e8e;
        padding: 0 37.5;
    }
    .placeholder .icon {
        width: 60;
        height: 60;
        border-radius: 30;
        border-width:2;
        border-color: #8e8e8e;
        font-size: 20;
    }
    .placeholder .title {
        font-size: 18;
        font-weight: 700;
        padding-top: 12.5;
        padding-bottom: 5;
    }
</style>