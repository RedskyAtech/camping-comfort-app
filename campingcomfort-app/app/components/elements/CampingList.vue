<template>
    <ListView for="item in listItems" @itemLoading="onItemLoading">
        <v-template>
            <CardView class="cardStyle" :class="[{ 'first': $index === 0 }]" radius="10">
                <GridLayout rows="75" columns="75,*">
                    <Image col="0" :src="item.image"></Image>
                    <StackLayout col="1" orientation="horizontal">
                        <StackLayout class="event-label" verticalAlignment="center">
                            <Label class="event-title" :text="item.title"></Label>
                        </StackLayout>
                    </StackLayout>
                </GridLayout>
            </CardView>
        </v-template>
    </ListView>
</template>

<script>
    export default {
        data() {
            return {
                listItems: [
                    {
                        image: '~/assets/images/demo/pool-2.jpg',
                        title: 'Zwembad'
                    },
                    {
                        image: '~/assets/images/demo/beachclub.jpg',
                        title: 'Strandterras'
                    },
                    {
                        image: '~/assets/images/demo/restaurant.jpg',
                        title: 'Restaurant'
                    },
                    {
                        image: '~/assets/images/demo/bakery.jpg',
                        title: 'Bakkerij'
                    },
                    {
                        image: '~/assets/images/demo/sanitary.jpg',
                        title: 'Sanitaire voorzieningen'
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
    .event-label {
        padding: 0 12.5;
    }
</style>