<template>
    <Page :class="pageClass" actionBarHidden="true">
        <GridLayout rows="*" columns="*">
            <ScrollView row="0" col="0">
                <GridLayout rows="auto,auto">
                    <GridLayout row="0" class="hero-grid">
                        <Image row="0" src="~/assets/images/demo/aqua-land.png" class="hero-image"></Image>
                        <GridLayout row="0" horizontalAlignment="right" verticalAlignment="bottom">
                            <CardView class="cardStyle like" radius="30">
                                <GridLayout rows="*" columns="*">
                                    <Label row="0" col="0" class="like-icon fa">{{ 'fa-heart' | fonticon }}</Label>
                                </GridLayout>
                            </CardView>
                        </GridLayout>
                    </GridLayout>
                    <StackLayout row="1" class="content">
                        <Label class="title" row="1" text="Aqua Land"></Label>
                        <Label class="text" textWrap="true" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."></Label>
                        <Label class="text" textWrap="true" text="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"></Label>
                    </StackLayout>
                </GridLayout>
            </ScrollView>
            <Fab><Label @tap="goBack" row="0" col="0" class="btn-icon fas">{{ 'fa-arrow-left' | fonticon }}</Label></Fab>
        </GridLayout>
    </Page>
</template>

<script>
    import EventBus from '../helpers/EventBus'
    import Responsive from '../mixins/Responsive'
    import Fab from '../elements/Fab'

    export default {
        data() {
            return {

            }
        },
        mixins: [
            Responsive
        ],
        components: {
            Fab: Fab
        },
        methods: {
            goBack: function(){
                EventBus.$emit('back');
            }
        }
    }
</script>

<style scoped>

    /* Hero */
    Page.xs .hero-grid {
        height: 210;
    }
    Page.sm .hero-grid {
        height: 232;
    }
    Page.md .hero-grid {
        height: 270;
    }
    Page.lg .hero-grid {
        height: 432;
    }
    Page.xl .hero-grid {
        height: 576;
    }
    .hero-image {
        stretch: aspectFill;
        margin-top: -40;
    }
    .content {
        padding: 25;
    }
    .title {
        font-size: 18;
        font-weight: 700;
        padding-bottom: 10;
    }
    .text {
        color: #8f99ac;
        font-size: 16;
    }
    .like {
        background: #fff;
        width: 60;
        height: 60;
        margin: 0 18.75 -30 0;
    }
    .like-icon {
        color: #f010be;
        text-align: center;
        font-size: 20;
    }
</style>