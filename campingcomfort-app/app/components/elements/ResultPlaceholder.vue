<template>
    <StackLayout horizontalAlignment="center" verticalAlignment="center">
        <StackLayout class="placeholder">
            <GridLayout rows="60" columns="60" horizontalAlignment="center" class="icon">
                <Label row="0" col="0" :class="iconLabelClass" verticalAlignment="center">{{ iconClass | fonticon }}</Label>
            </GridLayout>
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
        border-radius: 100%;
        border-width:2;
        border-color: #8e8e8e;
        font-size: 20;
    }
    .placeholder .icon Label {

    }
    Page.xxs .placeholder .icon {
        visibility: collapsed;
    }
    .placeholder .title {
        font-size: 18;
        font-weight: 700;
        padding-top: 12.5;
        padding-bottom: 5;
    }
    Page.xxs .placeholder .title {
        padding-top: 5;
    }
</style>