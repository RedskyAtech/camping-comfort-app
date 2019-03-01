<template>
    <GridLayout rows="auto,*" columns="*">
        <StackLayout row="0" class="title-container">
            <Label text="Op de camping"></Label>
        </StackLayout>
        <CampingList row="1"></CampingList>
        <Fab row="1"></Fab>
    </GridLayout>
</template>

<script>
    import CampingList from '../elements/CampingList'
    import Fab from '../elements/Fab'

    export default {
        data() {
            return {
            }
        },
        components: {
            'CampingList': CampingList,
            'Fab': Fab
        }
    }
</script>

<style scoped>

    /* Title */
    .title-container {
        background-color: #f8f8f8;
        text-align: center;
        font-weight: 700;
        font-size: 16;
        padding: 12.5;
        border-bottom-width: 1;
        border-color: #e5e5e5;
    }
</style>