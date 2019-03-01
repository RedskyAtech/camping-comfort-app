<template>
    <CardView horizontalAlignment="right" verticalAlignment="bottom" class="cardStyle fab" radius="30">
        <GridLayout rows="*" columns="*">
            <Label row="0" col="0" class="btn-icon fa">{{ 'fa-map' | fonticon }}</Label>
        </GridLayout>
    </CardView>
</template>

<style scoped>
    .fab {
        width: 60;
        height: 60;
        background: #fff;
        color: #454f63;
        margin-right: 18.75;
        margin-bottom: 18.75;
        text-align: center;
    }
    .btn-icon {
        font-size: 20;
    }
</style>