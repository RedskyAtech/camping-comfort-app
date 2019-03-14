<template>
    <Page :class="pageClass" actionBarHidden="true">
        <GridLayout rows="*" columns="*">
            <ScrollView row="0" col="0">
                <GridLayout rows="auto,auto,auto">
                    <GridLayout row="0" class="hero-grid">
                        <Image row="0" src="~/assets/images/demo/aqua-land.png" class="hero-image"></Image>
                        <CardView row="0" horizontalAlignment="right" verticalAlignment="bottom" class="cardStyle like" radius="30">
                            <GridLayout rows="*" columns="*">
                                <Label row="0" col="0" class="like-icon fa" verticalAlignment="center">{{ 'fa-heart' | fonticon }}</Label>
                            </GridLayout>
                        </CardView>
                    </GridLayout>
                    <StackLayout row="1" class="timeframe" orientation="horizontal">
                        <Label class="clock fa">{{ 'fa-clock' | fonticon }}</Label>
                        <Label text="Vandaag 10:00 - 12:00"></Label>
                    </StackLayout>
                    <StackLayout row="2" class="content">
                        <Label class="title" text="Aqua Land"></Label>
                        <GridLayout columns="*" :rows="textHeight">
                            <Stacklayout col="0" row="0">
                                <Label class="text" textWrap="true" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."></Label>
                                <Label class="text" textWrap="true" text="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"></Label>
                            </Stacklayout>
                            <StackLayout v-if="collapsed" col="0" row="0" class="gradient"></StackLayout>
                            <StackLayout v-if="collapsed" col="0" row="1">
                                <Label class="read-more-link" text="+ Lees meer" @tap="readMore"></Label>
                            </StackLayout>
                        </GridLayout>
                        <!--<StackLayout class="info-block">
                            <GridLayout rows="auto,auto,auto" columns="auto,auto">
                                <Label row="0" col="0" class="left" text="Locatie:"></Label>
                                <Label row="0" col="1" text="Receptie"></Label>
                                <Label row="1" col="0" class="left" text="Leeftijd:"></Label>
                                <Label row="1" col="1" text="Vanaf 12 jaar"></Label>
                                <Label row="2" col="0" class="left" text="Kosten:"></Label>
                                <Label row="2" col="1" text="Gratis"></Label>
                            </GridLayout>
                        </StackLayout>-->
                        <StackLayout class="address-block">
                            <Label class="address-title" text="Voor meer informatie"></Label>
                            <Label class="address-text" text="Smidsweg 7"></Label>
                            <Label class="address-text" text="7411 SC Schalkhaar"></Label>
                        </StackLayout>
                        <GridLayout columns="auto,*">
                            <StackLayout class="btn" col="0" @tap="toRoute">
                                <Label text="Route" verticalAlignment="center"></Label>
                            </StackLayout>
                        </GridLayout>
                    </StackLayout>
                </GridLayout>
            </ScrollView>
            <Fab><Label @tap="goBack" row="0" col="0" class="btn-icon fas" verticalAlignment="center">{{ 'fa-arrow-left' | fonticon }}</Label></Fab>
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
                collapsed: true
            }
        },
        computed: {
            textHeight: function(){
                if(this.collapsed){
                    return '89,auto';
                }
                else {
                    return 'auto';
                }
            }
        },
        mixins: [
            Responsive
        ],
        components: {
            Fab: Fab
        },
        methods: {
            like: function(){

            },
            readMore: function(){
                this.collapsed = false;
            },
            toRoute: function(){
                EventBus.$emit('openModal', {
                    page: 'route'
                });
            },
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
    .like {
        z-index: 10;
    }
    .hero-image {
        stretch: aspectFill;
        margin-top: -40;
    }
    .timeframe {
        padding: 12.5 25;
        color: #8f99ac;
        font-size: 14;
        border-bottom-width: 1;
        border-color: #e5e5e5;
    }
    .clock {
        padding-right: 5;
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
        opacity: 0.5;
        line-height: 5;
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

    /* Read more */
    .gradient {
        background: linear-gradient(to bottom, rgba(248,248,248,0), rgba(248,248,248,0.1), #f8f8f8);
    }
    .read-more-link {
        padding-top: 12.5;
        color: #0070da;
    }

    /* Info block */
    .info-block {
        margin-top: 25;
        padding: 12.5 18.75;
        border-width: 1;
        border-color: rgba(0,112,218,0.25);
        border-radius: 3;
        background-color: rgba(0,112,218,0.1);
        font-size: 14;
    }
    .info-block .left {
        padding-right: 25;
        font-weight: 700;
    }

    /* Addres block */
    .address-block {
        margin-top: 25;
    }
    .address-title {
        font-weight: 700;
    }
    .btn {
        margin-top: 12.5;
    }
</style>