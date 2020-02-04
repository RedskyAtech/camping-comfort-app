<template>
    <GridLayout rows="auto,*" columns="*">
        <StackLayout row="0" class="title-container">
            <Label :text="$t('tabs.camping_'+type)"></Label>
        </StackLayout>
        <CampingList row="1"></CampingList>
    </GridLayout>
</template>

<script>
    import Responsive from '../mixins/Responsive'
    import LocalStorage from '../mixins/LocalStorage'
    import CampingList from '../elements/CampingList'

    export default {
        data() {
            return {
            }
        },
        mixins: [
            Responsive,
            LocalStorage
        ],
        components: {
            'CampingList': CampingList
        },
        computed: {

            // Get the type from the storage
            type: function() {
                let self = this;
                if(self.keyExistsInStore('settings')) {
                    let settings = self.getObjectFromStore('settings');
                    return settings.type;
                }
                else {
                    return '';
                }
            }
        }
    }
</script>

<style scoped>

    /* Title */
    .title-container {
        background-color: #ffffff;
        text-align: center;
        font-weight: 700;
        padding: 12.5;
        border-bottom-width: 1;
        border-color: #e5e5e5;
    }
</style>