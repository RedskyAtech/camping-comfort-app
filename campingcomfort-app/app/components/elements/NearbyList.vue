<template>
    <ListView for="item in listItems" @itemLoading="onItemLoading">
        <v-template>
            <CardView class="cardStyle" :class="[{ 'first': $index === 0 }]" radius="10" @tap="navigate">
                <GridLayout rows="75" columns="75,*">
                    <Image col="0" :src="item.image"></Image>
                    <StackLayout col="1" orientation="horizontal">
                        <StackLayout class="item-label" verticalAlignment="center">
                            <Label class="item-title" :text="item.title"></Label>
                            <Label class="item-subtitle" :text="item.subtitle"></Label>
                        </StackLayout>
                    </StackLayout>
                </GridLayout>
            </CardView>
        </v-template>
    </ListView>
</template>

<script>
    import EventBus from '../helpers/EventBus'

    export default {
        data() {
            return {
                listItems: [
                    {
                        image: '~/assets/images/demo/kids-playground.png',
                        title: 'De Spelerij',
                        subtitle: 'Oegstgeest, 2km'
                    },
                    {
                        image: '~/assets/images/demo/aqua-land.png',
                        title: 'Aqua Land',
                        subtitle: 'Leiden, 4km'
                    },
                    {
                        image: '~/assets/images/demo/zoo.png',
                        title: 'Dierentuin de Nijl',
                        subtitle: 'Den Haag, 12km'
                    },
                    {
                        image: '~/assets/images/demo/beach.png',
                        title: 'Strand',
                        subtitle: 'Katwijk, 13km'
                    },
                    {
                        image: '~/assets/images/demo/museum.png',
                        title: 'Dinoland',
                        subtitle: 'Zoetermeer, 16km'
                    }
                ]
            }
        },
        methods: {

            // Remove the grey highlight on tapping a ListView item
            onItemLoading: function(args) {
                const cell = args.ios;
                if (cell) {
                    cell.selectionStyle = UITableViewCellSelectionStyle.UITableViewCellSelectionStyleNone;
                }
            },
            navigate: function(){
                EventBus.$emit('navigate', {
                    tab: 3,
                    page: 'detail'
                });
            }
        }
    }
</script>

<style scoped>

    /* List view */
    .cardStyle {
        background-color: #fff;
        margin: 0 12.5 12.5 12.5;
    }
    .cardStyle.first {
        margin-top: 12.5;
    }
    ListView {
        background-color: #f5f5f8;
        separator-color: transparent;
    }

    /* Image */
    .cardStyle Image {
        border-top-left-radius: 10;
        border-bottom-left-radius: 10;
        stretch: aspectFill;
    }

    /* Label */
    .item-label {
        padding: 0 12.5;
    }
    .item-subtitle {
        font-size: 12;
        opacity: 0.6;
    }
</style>