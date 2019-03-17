<template>
    <Page :class="pageClass" actionBarHidden="true">
        <GridLayout rows="*" columns="*">
            <ScrollView row="0" col="0">
                <GridLayout rows="auto,auto,auto">
                    <GridLayout row="0" class="hero-grid">
                        <Image row="0" :src="item.image" class="hero-image"></Image>
                        <CardView row="0" horizontalAlignment="right" verticalAlignment="bottom" class="cardStyle like" radius="30" v-if="likable">
                            <GridLayout rows="*" columns="*">
                                <Label row="0" col="0" class="like-icon fa" verticalAlignment="center">{{ 'fa-heart' | fonticon }}</Label>
                            </GridLayout>
                        </CardView>
                    </GridLayout>
                    <StackLayout row="1" class="timeframe" orientation="horizontal" v-if="item.start_time !== undefined">
                        <Label class="clock fa">{{ 'fa-clock' | fonticon }}</Label>
                        <StackLayout orientation="horizontal">
                            <Label text="Vandaag "></Label>
                            <Label :text="'2000-01-01 '+item.start_time | moment('HH:mm')"></Label>
                            <Label text=" - "></Label>
                            <Label :text="'2000-01-01 '+item.end_time | moment('HH:mm')"></Label>
                        </StackLayout>
                    </StackLayout>
                    <StackLayout row="2" class="content">
                        <Label class="title" :text="item.title"></Label>
                        <GridLayout columns="*" :rows="textHeight">
                            <Stacklayout col="0" row="0">
                                <Label class="text" textWrap="true" :text="item.text"></Label>
                            </Stacklayout>
                            <StackLayout v-if="collapsed" col="0" row="0" class="gradient"></StackLayout>
                            <StackLayout v-if="collapsed" col="0" row="1">
                                <Label class="read-more-link" text="+ Lees meer" @tap="readMore"></Label>
                            </StackLayout>
                        </GridLayout>
                        <StackLayout class="info-block" v-if="item.location !== undefined">
                            <GridLayout rows="auto,auto,auto" columns="auto,auto">
                                <Label row="0" col="0" class="left" text="Locatie:"></Label>
                                <Label row="0" col="1" :text="item.location"></Label>
                                <Label row="1" col="0" class="left" text="Leeftijd:"></Label>
                                <Label row="1" col="1" :text="item.age"></Label>
                                <Label row="2" col="0" class="left" text="Kosten:"></Label>
                                <Label row="2" col="1" :text="item.price"></Label>
                            </GridLayout>
                        </StackLayout>
                        <StackLayout class="address-block" v-if="item.place !== undefined">
                            <Label class="address-title" text="Voor meer informatie"></Label>
                            <Label class="address-text" :text="item.street+' '+item.house_number"></Label>
                            <Label class="address-text" :text="item.postal_code+' '+item.place"></Label>
                        </StackLayout>
                        <GridLayout columns="auto,*" v-if="item.place !== undefined">
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
    import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http";
    import EventBus from '../helpers/EventBus'
    import Responsive from '../mixins/Responsive'
    import Fab from '../elements/Fab'

    export default {
        props: {
            id: 0,
            type: ''
        },
        data() {
            return {
                collapsed: true,
                item: {},
                isLikable: false
            }
        },
        computed: {
            textHeight: function(){
                if(this.collapsed){
                    return '83,auto';
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
        created: function(){
            this.loadData();
        },
        methods: {

            // Get the data
            loadData: function(){
                let self = this;
                if(this.type === 'camping_facility'){
                    getJSON("https://www.campingcomfort.app/api/9665/camping-facilities/nl/"+self.id).then((r) => {
                        self.item = r.campingFacility;
                    }, (e) => {});
                }
                if(this.type === 'camping_activity'){
                    getJSON("https://www.campingcomfort.app/api/9665/camping-activities/nl/"+self.id).then((r) => {
                        self.item = r.campingActivity;
                        self.likable = true;
                    }, (e) => {});
                }
                if(this.type === 'nearby_activity'){
                    getJSON("https://www.campingcomfort.app/api/9665/nearby-activities/nl/"+self.id).then((r) => {
                        self.item = r.nearbyActivity;
                    }, (e) => {});
                }
            },
            like: function(){

            },
            readMore: function(){
                this.collapsed = false;
            },
            toRoute: function(){
                let self = this;
                EventBus.$emit('openModal', {
                    page: 'route',
                    props: {
                        url: 'https://www.google.com/maps/dir//'+encodeURI(self.item.street)+'+'+encodeURI(self.item.house_number)+','+encodeURI(self.item.postal_code)+'+'+encodeURI(self.item.place)
                    }
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