<template>
    <Page :class="pageClass" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <GridLayout rows="*" columns="*">
            <ScrollView row="0" col="0">
                <GridLayout rows="auto,auto,auto" columns="*">
                    <GridLayout row="0" class="hero-grid">
                        <WebImage row="0" :src="item.image" class="hero-image"></WebImage>
                    </GridLayout>
                    <StackLayout row="1" class="timeframe" orientation="horizontal" v-if="item.start_time !== undefined">
                        <Label class="clock far">{{ 'fa-clock' | fonticon }}</Label>
                        <StackLayout orientation="horizontal">
                            <Label :text="$t('detail.today')"></Label>
                            <Label :text="'2000-01-01 '+item.start_time | moment($t('formatting.time'))"></Label>
                            <Label text=" - "></Label>
                            <Label :text="'2000-01-01 '+item.end_time | moment($t('formatting.time'))"></Label>
                        </StackLayout>
                    </StackLayout>
                    <StackLayout row="1" class="timeframe" orientation="horizontal" v-if="item.date !== undefined">
                        <Label class="clock far">{{ 'fa-calendar-alt' | fonticon }}</Label>
                        <Label :text="item.date+' 00:00:00' | moment($t('formatting.date'))"></Label>
                    </StackLayout>
                    <StackLayout row="2" class="content">
                        <Label class="title" :text="item.title" textWrap="true"></Label>
                        <GridLayout columns="*" :rows="textHeight">
                            <Stacklayout col="0" row="0">
                                <Label class="text" textWrap="true" :text="item.text"></Label>
                            </Stacklayout>
                            <StackLayout v-if="collapsed" col="0" row="0" class="gradient"></StackLayout>
                            <StackLayout v-if="collapsed" col="0" row="1">
                                <Label class="read-more-link" :text="'+ '+$t('detail.readMore')" @tap="readMore"></Label>
                            </StackLayout>
                        </GridLayout>
                        <StackLayout class="info-block" v-if="item.location !== undefined">
                            <GridLayout rows="auto,auto,auto" columns="auto,auto">
                                <Label row="0" col="0" class="left" :text="$t('detail.location')+':'"></Label>
                                <Label row="0" col="1" :text="item.location"></Label>
                                <Label row="1" col="0" class="left" :text="$t('detail.age')+':'"></Label>
                                <Label row="1" col="1" :text="item.age"></Label>
                                <Label row="2" col="0" class="left" :text="$t('detail.price')+':'"></Label>
                                <Label row="2" col="1" :text="item.price"></Label>
                            </GridLayout>
                        </StackLayout>
                        <StackLayout class="address-block" v-if="item.place !== undefined">
                            <Label class="address-title" :text="$t('detail.forMoreInformation')"></Label>
                            <Label class="address-text" :text="item.street+' '+item.house_number"></Label>
                            <Label class="address-text" :text="item.postal_code+' '+item.place"></Label>
                        </StackLayout>
                        <GridLayout columns="auto,*" v-if="item.place !== undefined">
                            <StackLayout class="btn" col="0" @tap="toRoute">
                                <Label :text="$t('detail.route')" verticalAlignment="center"></Label>
                            </StackLayout>
                        </GridLayout>
                    </StackLayout>
                    <AbsoluteLayout class="like-container" row="0" columns="*" rowSpan="2" horizontalAlignment="right">
                        <CardView row="0" col="0" horizontalAlignment="right" verticalAlignment="top" class="cardStyle like" radius="30" v-if="isLikable" @tap="toggleLike(id)">
                            <GridLayout rows="*" columns="*">
                                <Label row="0" col="0" class="like-icon far" verticalAlignment="center" v-if="!liked">{{ 'fa-heart' | fonticon }}</Label>
                                <Label row="0" col="0" class="like-icon fas" verticalAlignment="center" v-if="liked">{{ 'fa-heart' | fonticon }}</Label>
                            </GridLayout>
                        </CardView>
                    </AbsoluteLayout>
                </GridLayout>
            </ScrollView>
            <Fab verticalAlignment="bottom"><GridLayout rows="*" columns="*" @tap="goBack"><Label row="0" col="0" class="btn-icon fas" verticalAlignment="center">{{ 'fa-arrow-left' | fonticon }}</Label></GridLayout></Fab>
        </GridLayout>
    </Page>
</template>

<script>
    import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http";
    import EventBus from '../helpers/EventBus'
    import Responsive from '../mixins/Responsive'
    import Fab from '../elements/Fab'
    import Connection from '../mixins/Connection'
    import LocalStorage from '../mixins/LocalStorage'
    import Likes from '../mixins/Likes'

    export default {
        props: {
            id: 0,
            type: ''
        },
        data() {
            return {
                collapsed: true,
                item: {},
                isLikable: false,
                liked: false
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
            Responsive,
            LocalStorage,
            Connection,
            Likes
        ],
        components: {
            Fab: Fab
        },
        created: function(){
            if(this.type === 'camping_facility' || this.type === 'news_item'){
                this.collapsed = false;
            }
            this.loadData();
        },
        methods: {

            // Get the data
            loadData: function(){
                let self = this;
                let campingId = this.getNumberFromStore('campingId');
                let lang = this.getStringFromStore('language');
                if(this.type === 'news_item') {
                    if(self.hasInternetConnection()) {

                        // Show the cached version first to prevent flickering
                        if(self.keyExistsInStore('newsItem_'+self.id)) {
                            self.item = self.getObjectFromStore('newsItem_'+self.id);
                        }

                        // Get the live data
                        getJSON("https://www.campingcomfort.app/api/"+campingId+"/news-items/"+lang+"/"+self.id).then((r) => {
                            if(r.newsItem) {
                                self.item = r.newsItem;
                                self.storeObject('newsItem_'+self.id, self.item);
                            }
                            else {
                                self.item = {};
                                self.removeKeyFromStore('newsItem_'+self.id);
                            }
                        }, (e) => {
                            self.item = {};
                            self.removeKeyFromStore('newsItem_'+self.id);
                        });
                    }
                    else {
                        if(self.keyExistsInStore('newsItem_'+self.id)){
                            self.item = self.getObjectFromStore('newsItem_'+self.id);
                        }
                        else {
                            self.item = {};

                            setTimeout(function(){
                                alert({
                                    title: self.$t('errors.offline.title'),
                                    message: self.$t('errors.offline.message'),
                                    okButtonText: self.$t('errors.offline.buttonText')
                                }).then(() => {
                                });
                            }, 500);
                        }
                    }
                }
                if(this.type === 'camping_facility') {
                    if(self.hasInternetConnection()) {

                        // Show the cached version first to prevent flickering
                        if(self.keyExistsInStore('campingFacility_'+self.id)) {
                            self.item = self.getObjectFromStore('campingFacility_'+self.id);
                        }

                        // Get the live data
                        getJSON("https://www.campingcomfort.app/api/"+campingId+"/camping-facilities/"+lang+"/"+self.id).then((r) => {
                            if(r.campingFacility) {
                                self.item = r.campingFacility;
                                self.storeObject('campingFacility_'+self.id, self.item);
                            }
                            else {
                                self.item = {};
                                self.removeKeyFromStore('campingFacility_'+self.id);
                            }
                        }, (e) => {
                            self.item = {};
                            self.removeKeyFromStore('campingFacility_'+self.id);
                        });
                    }
                    else {
                        if(self.keyExistsInStore('campingFacility_'+self.id)){
                            self.item = self.getObjectFromStore('campingFacility_'+self.id);
                        }
                        else {
                            self.item = {};

                            setTimeout(function(){
                                alert({
                                    title: self.$t('errors.offline.title'),
                                    message: self.$t('errors.offline.message'),
                                    okButtonText: self.$t('errors.offline.buttonText')
                                }).then(() => {
                                });
                            }, 500);
                        }
                    }
                }
                if(this.type === 'camping_activity') {
                    if(self.hasInternetConnection()) {

                        // Show the cached version first to prevent flickering
                        if(self.keyExistsInStore('campingActivity_'+self.id)) {
                            self.item = self.getObjectFromStore('campingActivity_'+self.id);
                        }

                        // Set liked from storage
                        self.liked = self.isLiked(self.id);

                        // Get the live data
                        getJSON("https://www.campingcomfort.app/api/" + campingId + "/camping-activities/" + lang + "/" + self.id).then((r) => {
                            if(r.campingActivity) {
                                self.item = r.campingActivity;
                                self.isLikable = true;
                                self.storeObject('campingActivity_'+self.id, self.item);
                                self.storeBoolean('isLikable_'+self.id, true);
                            }
                            else {
                                self.item = {};
                                self.removeKeyFromStore('campingActivity_'+self.id);
                                self.removeKeyFromStore('isLikable_'+self.id);
                            }
                        }, (e) => {
                            self.item = {};
                            self.removeKeyFromStore('campingActivity_'+self.id);
                            self.removeKeyFromStore('isLikable_'+self.id);
                        });
                    }
                    else {
                        if(self.keyExistsInStore('campingActivity_'+self.id)){
                            self.item = self.getObjectFromStore('campingActivity_'+self.id);
                        }
                        else {
                            self.item = {};

                            setTimeout(function(){
                                alert({
                                    title: self.$t('errors.offline.title'),
                                    message: self.$t('errors.offline.message'),
                                    okButtonText: self.$t('errors.offline.buttonText')
                                }).then(() => {
                                });
                            }, 500);
                        }
                    }
                }
                if(this.type === 'nearby_activity') {
                    if(self.hasInternetConnection()) {

                        // Show the cached version first to prevent flickering
                        if(self.keyExistsInStore('nearbyActivity_'+self.id)) {
                            self.item = self.getObjectFromStore('nearbyActivity_'+self.id);
                        }

                        // Get the live data
                        getJSON("https://www.campingcomfort.app/api/" + campingId + "/nearby-activities/" + lang + "/" + self.id).then((r) => {
                            if(r.nearbyActivity) {
                                self.item = r.nearbyActivity;
                                self.storeObject('nearbyActivity_'+self.id, self.item);
                            }
                            else {
                                self.item = {};
                                self.removeKeyFromStore('nearbyActivity_'+self.id);
                            }
                        }, (e) => {
                            self.item = {};
                            self.removeKeyFromStore('nearbyActivity_'+self.id);
                        });
                    }
                    else {
                        if(self.keyExistsInStore('nearbyActivity_'+self.id)){
                            self.item = self.getObjectFromStore('nearbyActivity_'+self.id);
                        }
                        else {
                            self.item = {};

                            setTimeout(function(){
                                alert({
                                    title: self.$t('errors.offline.title'),
                                    message: self.$t('errors.offline.message'),
                                    okButtonText: self.$t('errors.offline.buttonText')
                                }).then(() => {
                                });
                            }, 500);
                        }
                    }
                }
            },
            readMore: function(){
                this.collapsed = false;
            },
            toRoute: function(){
                let self = this;
                if(self.hasInternetConnection()) {
                    EventBus.$emit('openModal', {
                        page: 'route',
                        props: {
                            url: 'https://www.google.com/maps/dir//' + encodeURI(self.item.street) + '+' + encodeURI(self.item.house_number) + ',' + encodeURI(self.item.postal_code) + '+' + encodeURI(self.item.place)
                        }
                    });
                }
                else {
                    setTimeout(function(){
                        alert({
                            title: self.$t('errors.offline.title'),
                            message: self.$t('errors.offline.message'),
                            okButtonText: self.$t('errors.offline.buttonText')
                        }).then(() => {
                        });
                    }, 500);
                }
            },
            goBack: function(){
                EventBus.$emit('back');
            }
        }
    }
</script>

<style scoped>

    /* Like */
    Page.xs .like-container {
        padding-top: 180;
    }
    Page.sm .like-container {
        padding-top: 202;
    }
    Page.md .like-container {
        padding-top: 240;
    }
    Page.lg .like-container {
        padding-top: 402;
    }
    Page.xl .like-container {
        padding-top: 546;
    }
    .like-container {
        z-index: 10;
        padding: 0 18.75 0 0;
    }
    .like {
        background: #fff;
        width: 60;
        height: 60;
    }
    .like-icon {
        color: #f010be;
        text-align: center;
        font-size: 20;
    }

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