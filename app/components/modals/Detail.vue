<template>
    <Page :class="pageClass" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <Header :hasHero="item.image !== undefined && item.image !== ''" :title="item.title" :showHeader="showHeader" :showBackBtn="true" :inModal="true" :heroHeight="heroHeight">
            <GridLayout>
                <StackLayout row="0">
                    <GridLayout rows="auto" v-if="item.image !== '' && item.image !== undefined">
                        <Image :src="item.image" class="hero" ref="hero" :height="heroHeight"></Image>
                        <StackLayout row="0" class="hero-overlay"></StackLayout>
                    </GridLayout>
                    <GridLayout rows="auto" columns="auto,auto" class="timeframe" v-if="item.start_time !== undefined">
                        <Label col="0" class="clock far" verticalAlignment="center">{{ 'fa-clock' | fonticon }}</Label>
                        <StackLayout col="1" orientation="horizontal" verticalAlignment="center" v-if="item.is_all_day === false">
                            <Label :text="humanizeDate(item.start_date +' '+item.start_time)+' '" class="day"></Label>
                            <Label text=" - "></Label>
                            <Label :text="'2000-01-01 '+item.end_time | moment($t('formatting.time'))"></Label>
                        </StackLayout>
                        <StackLayout col="1" orientation="horizontal" verticalAlignment="center" v-else>
                            <Label :text="humanizeDate(item.start_date, false)+' '" class="day"></Label>
                            <Label :text="'- '+$t('general.allDay')"></Label>
                        </StackLayout>
                    </GridLayout>
                    <GridLayout rows="auto" columns="auto,auto" class="timeframe" v-if="item.date !== undefined">
                        <Label col="0" class="clock far" verticalAlignment="center">{{ 'fa-calendar-alt' | fonticon }}</Label>
                        <Label col="1" :text="humanizeDate(item.date, false)" verticalAlignment="center"></Label>
                    </GridLayout>
                    <StackLayout class="content">
                        <FlexboxLayout flexWrap="wrap" v-if="item.type === 'camping'" class="tags">
                            <Label class="tag activity-camping" :text="$t('activities.onTheCampsite_'+appType)"></Label>
                        </FlexboxLayout>
                        <FlexboxLayout flexWrap="wrap" v-if="item.type === 'nearby'" class="tags">
                            <Label class="tag activity-nearby" :text="$t('activities.nearby')"></Label>
                        </FlexboxLayout>
                        <FlexboxLayout flexWrap="wrap" v-if="item.tags !== undefined" class="tags">
                            <Label class="tag primary" :text="$t('nearby.'+item.category)"></Label>
                            <Label class="tag" :text="tag.translation" v-for="tag in item.tags" v-bind:data="item.tags" v-bind:key="tag.tag"></Label>
                        </FlexboxLayout>
                        <Label class="title" :text="item.title" textWrap="true"></Label>
                        <GridLayout columns="*" :rows="textHeight">
                            <Stacklayout col="0" row="0">
                                <HtmlView :html="richText" @layoutChanged="htmlViewLoaded" ref="htmlView"></HtmlView>
                                <StackLayout v-if="item.reviews && item.reviews.length > 0">
                                    <Label class="text subtitle" textWrap="true" :text="$t('detail.whatOtherPeopleSay')+':'"></Label>
                                    <StackLayout class="review-container" :class="[{ 'last': index === (item.reviews.length-1) }]" v-for="(review, index) in item.reviews" v-bind:data="review" v-bind:key="review.id">
                                        <StackLayout horizontalAlignment="left"><StarRating :value="review.rating" :size="starSize" fillColor="#0070DA" emptyColor="#7FB7EC" outlineColor="#FFFFFF" /></StackLayout>
                                        <Label class="review" textWrap="true" :text="review.text"></Label>
                                    </StackLayout>
                                </StackLayout>
                            </Stacklayout>
                            <StackLayout v-if="collapsed" col="0" row="0" class="gradient"></StackLayout>
                            <StackLayout v-if="collapsed" col="0" row="1">
                                <Label class="read-more-link" :text="'+ '+$t('detail.readMore')" @tap="readMore"></Label>
                            </StackLayout>
                        </GridLayout>
                        <GridLayout columns="auto,*" class="website" v-if="item.website">
                            <StackLayout class="btn" col="0" @tap="toWebsite">
                                <Label :text="$t('detail.toWebsite')" verticalAlignment="center"></Label>
                            </StackLayout>
                        </GridLayout>
                        <StackLayout class="info-block" v-if="item.opened_mon || item.opened_tue || item.opened_wed || item.opened_thu || item.opened_fri || item.opened_sat || item.opened_sun">
                            <Label class="info-title" :text="$t('detail.openingHours')"></Label>
                            <GridLayout rows="auto,auto,auto,auto,auto,auto,auto" columns="auto,auto">
                                <Label row="0" col="0" class="left" :text="$t('detail.monday')+':'"></Label>
                                <Label row="0" col="1" :text="((item.opened_mon === '00:00:00' && !item.closed_mon) ? $t('detail.allDay') : (item.opened_mon ? item.opened_mon.substring(0, 5) + (item.closed_mon ? ' - ' + item.closed_mon.substring(0, 5) : '') : $t('detail.closed')))"></Label>
                                <Label row="1" col="0" class="left" :text="$t('detail.tuesday')+':'"></Label>
                                <Label row="1" col="1" :text="((item.opened_tue === '00:00:00' && !item.closed_tue) ? $t('detail.allDay') : (item.opened_tue ? item.opened_tue.substring(0, 5) + (item.closed_tue ? ' - ' + item.closed_tue.substring(0, 5) : '') : $t('detail.closed')))"></Label>
                                <Label row="2" col="0" class="left" :text="$t('detail.wednesday')+':'"></Label>
                                <Label row="2" col="1" :text="((item.opened_wed === '00:00:00' && !item.closed_wed) ? $t('detail.allDay') : (item.opened_wed ? item.opened_wed.substring(0, 5) + (item.closed_wed ? ' - ' + item.closed_wed.substring(0, 5) : '') : $t('detail.closed')))"></Label>
                                <Label row="3" col="0" class="left" :text="$t('detail.thursday')+':'"></Label>
                                <Label row="3" col="1" :text="((item.opened_thu === '00:00:00' && !item.closed_thu) ? $t('detail.allDay') : (item.opened_thu ? item.opened_thu.substring(0, 5) + (item.closed_thu ? ' - ' + item.closed_thu.substring(0, 5) : '') : $t('detail.closed')))"></Label>
                                <Label row="4" col="0" class="left" :text="$t('detail.friday')+':'"></Label>
                                <Label row="4" col="1" :text="((item.opened_fri === '00:00:00' && !item.closed_fri) ? $t('detail.allDay') : (item.opened_fri ? item.opened_fri.substring(0, 5) + (item.closed_fri ? ' - ' + item.closed_fri.substring(0, 5) : '') : $t('detail.closed')))"></Label>
                                <Label row="5" col="0" class="left" :text="$t('detail.saturday')+':'"></Label>
                                <Label row="5" col="1" :text="((item.opened_sat === '00:00:00' && !item.closed_sat) ? $t('detail.allDay') : (item.opened_sat ? item.opened_sat.substring(0, 5) + (item.closed_sat ? ' - ' + item.closed_sat.substring(0, 5) : '') : $t('detail.closed')))"></Label>
                                <Label row="6" col="0" class="left" :text="$t('detail.sunday')+':'"></Label>
                                <Label row="6" col="1" :text="((item.opened_sun === '00:00:00' && !item.closed_sun) ? $t('detail.allDay') : (item.opened_sun ? item.opened_sun.substring(0, 5) + (item.closed_sun ? ' - ' + item.closed_sun.substring(0, 5) : '') : $t('detail.closed')))"></Label>
                            </GridLayout>
                        </StackLayout>
                        <StackLayout class="hr"></StackLayout>
                        <StackLayout class="info-block" v-if="item.location || item.age || item.price">
                            <GridLayout rows="auto,auto,auto" columns="auto,auto">
                                <Label v-if="item.location" row="0" col="0" class="left" :text="$t('detail.location')+':'"></Label>
                                <Label v-if="item.location" row="0" col="1" :text="item.location"></Label>
                                <Label v-if="item.age" row="1" col="0" class="left" :text="$t('detail.age')+':'"></Label>
                                <Label v-if="item.age" row="1" col="1" :text="item.age"></Label>
                                <Label v-if="item.price" row="2" col="0" class="left" :text="$t('detail.price')+':'"></Label>
                                <Label v-if="item.price" row="2" col="1" :text="item.price"></Label>
                            </GridLayout>
                        </StackLayout>
                        <StackLayout class="address-block" v-if="item.place">
                            <Label class="address-title" :text="$t('detail.forMoreInformation') + ((item.distance || item.distance === 0.0) && item.distance < 100 ? ' ('+item.distance+' km)' : '')"></Label>
                            <Label v-if="item.street || item.house_number" class="address-text" :text="(item.street ? item.street + ' ' : '') + (item.house_number ? item.house_number : '')"></Label>
                            <Label v-if="item.postal_code || item.place" class="address-text" :text="(item.postal_code ? item.postal_code + ' ' : '') + (item.place ? item.place : '')"></Label>
                        </StackLayout>
                        <GridLayout columns="auto,*" v-if="item.place">
                            <StackLayout class="btn" col="0" @tap="toRoute">
                                <Label :text="$t('detail.route')" verticalAlignment="center"></Label>
                            </StackLayout>
                        </GridLayout>
                        <Label class="disclaimer" v-if="item.is_auto_translated === 1" textWrap="true" :text="$t('detail.isAutoTranslated')"></Label>
                    </StackLayout>
                </StackLayout>
                <AbsoluteLayout class="like-container" row="0" horizontalAlignment="right" :paddingTop="(heroHeight-30)">
                    <Fab bg="#fff" color="#f010be" border-color="#e5e5e5" horizontalAlignment="right" verticalAlignment="top" class="like" v-if="isLikable" v-on:tapped="toggleLike(id)">
                        <GridLayout rows="*" columns="*">
                            <Label row="0" col="0" class="like-icon far" verticalAlignment="center" v-if="!liked">{{ 'fa-heart' | fonticon }}</Label>
                            <Label row="0" col="0" class="like-icon fas" verticalAlignment="center" v-if="liked">{{ 'fa-heart' | fonticon }}</Label>
                        </GridLayout>
                    </Fab>
                </AbsoluteLayout>
            </GridLayout>
        </Header>
    </Page>
</template>

<script>
    import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http"
    import EventBus from '../helpers/EventBus'
    import Responsive from '../mixins/Responsive'
    import Fab from '../elements/Fab'
    import Connection from '../mixins/Connection'
    import LocalStorage from '../mixins/LocalStorage'
    import Likes from '../mixins/Likes'
    import Dates from '../mixins/Dates'
    import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert"
    import * as utils from "tns-core-modules/utils/utils"
    import Header from '../elements/Header'
    import HeaderMixin from '../mixins/HeaderMixin'
    import RichText from '../mixins/RichText'

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
            heroHeight: function() {
                let h = this.screenWidth * 0.566;
                return h;
            },
            textHeight: function(){
                if(this.collapsed){
                    return '83,auto';
                }
                else {
                    return 'auto';
                }
            },
            starSize: function() {
                if(this.$isAndroid) {
                    return 40;
                }
                else {
                    return 25;
                }
            },

            // Get the type from the storage
            appType: function() {
                let self = this;
                if(self.keyExistsInStore('settings')) {
                    let settings = self.getObjectFromStore('settings');
                    return settings.type;
                }
                else {
                    return '';
                }
            }
        },
        mixins: [
            Responsive,
            LocalStorage,
            Connection,
            Likes,
            Dates,
            HeaderMixin,
            RichText
        ],
        components: {
            Fab: Fab,
            Header: Header
        },
        mounted: function(){
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

                            // Add the text to the page
                            self.addRichText(self.item.text);
                        }

                        // Get the live data
                        let loadingId = Date.now();
                        EventBus.$emit('startLoading', loadingId);
                        let url = self.$apiBaseUrl + "/" + campingId + "/news-items/" + lang + "/" + self.id + "?v=" + self.$apiVersion;
                        getJSON(url).then((r) => {
                            if(r.newsItem) {
                                self.item = r.newsItem;
                                self.storeObject('newsItem_'+self.id, self.item);

                                // Add the text to the page
                                self.addRichText(self.item.text);
                            }
                            else {
                                self.item = {};
                                self.removeKeyFromStore('newsItem_'+self.id);
                            }

                            // Show the header
                            self.showHeader = true;

                            // Stop the loader
                            EventBus.$emit('stopLoading', loadingId);
                        }, (e) => {
                            self.item = {};
                            self.removeKeyFromStore('newsItem_'+self.id);

                            // Show the header
                            self.showHeader = true;

                            // Stop the loader
                            EventBus.$emit('stopLoading', loadingId);
                        });
                    }
                    else {
                        if(self.keyExistsInStore('newsItem_'+self.id)){
                            self.item = self.getObjectFromStore('newsItem_'+self.id);

                            // Add the text to the page
                            self.addRichText(self.item.text);

                            // Show the header
                            self.showHeader = true;
                        }
                        else {
                            self.item = {};

                            // Show the header
                            self.showHeader = true;

                            setTimeout(function(){
                                TNSFancyAlert.showError(
                                    self.$t('errors.offline.title'),
                                    self.$t('errors.offline.message'),
                                    self.$t('errors.offline.buttonText')
                                );
                            }, 500);
                        }
                    }
                }
                if(this.type === 'camping_facility') {
                    if(self.hasInternetConnection()) {

                        // Show the cached version first to prevent flickering
                        if(self.keyExistsInStore('campingFacility_'+self.id)) {
                            self.item = self.getObjectFromStore('campingFacility_'+self.id);

                            // Add the text to the page
                            self.addRichText(self.item.text);
                        }

                        // Get the live data
                        let loadingId = Date.now();
                        EventBus.$emit('startLoading', loadingId);
                        let url = self.$apiBaseUrl + "/" + campingId + "/camping-facilities/" + lang + "/" + self.id + "?v=" + self.$apiVersion;
                        getJSON(url).then((r) => {

                            if(r.campingFacility) {
                                self.item = r.campingFacility;
                                self.storeObject('campingFacility_'+self.id, self.item);

                                // Add the text to the page
                                self.addRichText(self.item.text);
                            }
                            else {
                                self.item = {};
                                self.removeKeyFromStore('campingFacility_'+self.id);
                            }

                            // Show the header
                            self.showHeader = true;

                            // Stop the loader
                            EventBus.$emit('stopLoading', loadingId);
                        }, (e) => {
                            self.item = {};
                            self.removeKeyFromStore('campingFacility_'+self.id);

                            // Show the header
                            self.showHeader = true;

                            // Stop the loader
                            EventBus.$emit('stopLoading', loadingId);
                        });
                    }
                    else {
                        if(self.keyExistsInStore('campingFacility_'+self.id)){
                            self.item = self.getObjectFromStore('campingFacility_'+self.id);

                            // Add the text to the page
                            self.addRichText(self.item.text);

                            // Show the header
                            self.showHeader = true;
                        }
                        else {
                            self.item = {};

                            // Show the header
                            self.showHeader = true;

                            setTimeout(function(){
                                TNSFancyAlert.showError(
                                    self.$t('errors.offline.title'),
                                    self.$t('errors.offline.message'),
                                    self.$t('errors.offline.buttonText')
                                );
                            }, 500);
                        }
                    }
                }
                if(this.type === 'camping_activity') {
                    if(self.hasInternetConnection()) {

                        // Show the cached version first to prevent flickering
                        if(self.keyExistsInStore('campingActivity_'+self.id)) {
                            self.item = self.getObjectFromStore('campingActivity_'+self.id);
                            self.isLikable = true;

                            // Add the text to the page
                            self.addRichText(self.item.text);
                        }

                        // Set liked from storage
                        self.liked = self.isLiked(self.id);

                        // Get the live data
                        let loadingId = Date.now();
                        EventBus.$emit('startLoading', loadingId);
                        getJSON(self.$apiBaseUrl + "/" + campingId + "/camping-activities/" + lang + "/" + self.id + "?v=" + self.$apiVersion).then((r) => {
                            if(r.campingActivity) {
                                self.item = r.campingActivity;
                                self.isLikable = true;
                                self.storeObject('campingActivity_'+self.id, self.item);
                                self.storeBoolean('isLikable_'+self.id, true);

                                // Add the text to the page
                                self.addRichText(self.item.text);
                            }
                            else {
                                self.item = {};
                                self.removeKeyFromStore('campingActivity_'+self.id);
                                self.removeKeyFromStore('isLikable_'+self.id);
                            }

                            // Show the header
                            self.showHeader = true;

                            // Stop the loader
                            EventBus.$emit('stopLoading', loadingId);
                        }, (e) => {
                            self.item = {};
                            self.removeKeyFromStore('campingActivity_'+self.id);
                            self.removeKeyFromStore('isLikable_'+self.id);

                            // Show the header
                            self.showHeader = true;

                            // Stop the loader
                            EventBus.$emit('stopLoading', loadingId);
                        });
                    }
                    else {
                        if(self.keyExistsInStore('campingActivity_'+self.id)){
                            self.item = self.getObjectFromStore('campingActivity_'+self.id);
                            self.isLikable = true;

                            // Set liked from storage
                            self.liked = self.isLiked(self.id);

                            // Add the text to the page
                            self.addRichText(self.item.text);

                            // Show the header
                            self.showHeader = true;
                        }
                        else {
                            self.item = {};

                            // Show the header
                            self.showHeader = true;

                            setTimeout(function(){
                                TNSFancyAlert.showError(
                                    self.$t('errors.offline.title'),
                                    self.$t('errors.offline.message'),
                                    self.$t('errors.offline.buttonText')
                                );
                            }, 500);
                        }
                    }
                }
                if(this.type === 'nearby_activity') {
                    if(self.hasInternetConnection()) {

                        // Show the cached version first to prevent flickering
                        if(self.keyExistsInStore('nearbyActivity_'+self.id)) {
                            self.item = self.getObjectFromStore('nearbyActivity_'+self.id);

                            // Add the text to the page
                            self.addRichText(self.item.text);
                        }

                        // Get the live data
                        let loadingId = Date.now();
                        EventBus.$emit('startLoading', loadingId);
                        getJSON(self.$apiBaseUrl + "/" + campingId + "/nearby-activities/" + lang + "/" + self.id + "?v=" + self.$apiVersion).then((r) => {
                            if(r.nearbyActivity) {
                                self.item = r.nearbyActivity;
                                self.storeObject('nearbyActivity_'+self.id, self.item);

                                // Add the text to the page
                                self.addRichText(self.item.text);
                            }
                            else {
                                self.item = {};
                                self.removeKeyFromStore('nearbyActivity_'+self.id);
                            }

                            // Show the header
                            self.showHeader = true;

                            // Stop the loader
                            EventBus.$emit('stopLoading', loadingId);
                        }, (e) => {
                            self.item = {};
                            self.removeKeyFromStore('nearbyActivity_'+self.id);

                            // Show the header
                            self.showHeader = true;

                            // Stop the loader
                            EventBus.$emit('stopLoading', loadingId);
                        });
                    }
                    else {
                        if(self.keyExistsInStore('nearbyActivity_'+self.id)){
                            self.item = self.getObjectFromStore('nearbyActivity_'+self.id);

                            // Add the text to the page
                            self.addRichText(self.item.text);

                            // Show the header
                            self.showHeader = true;

                            // Stop the loader
                            let loadingId = Date.now();
                            EventBus.$emit('stopLoading', loadingId);
                        }
                        else {
                            self.item = {};

                            // Show the header
                            self.showHeader = true;

                            setTimeout(function(){
                                TNSFancyAlert.showError(
                                    self.$t('errors.offline.title'),
                                    self.$t('errors.offline.message'),
                                    self.$t('errors.offline.buttonText')
                                );
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
                    let url = 'https://www.google.com/maps/dir//' + encodeURI(self.item.street) + '+' + encodeURI(self.item.house_number) + ',+' + encodeURI(self.item.postal_code) + '+' + encodeURI(self.item.place);
                    utils.openUrl(url);
                }
                else {
                    TNSFancyAlert.showError(
                        self.$t('errors.offline.title'),
                        self.$t('errors.offline.message'),
                        self.$t('errors.offline.buttonText')
                    );
                }
            },
            toWebsite: function() {
                let self = this;
                if(self.hasInternetConnection()) {
                    let url = this.item.website;
                    if(url.substr(0,4) !== 'http'){
                        url = 'https://'+url;
                    }
                    utils.openUrl(url);
                }
                else {
                    TNSFancyAlert.showError(
                        self.$t('errors.offline.title'),
                        self.$t('errors.offline.message'),
                        self.$t('errors.offline.buttonText')
                    );
                }
            }
        }
    }
</script>

<style scoped>

    /* Like */
    Page.xxs .like-container {
        z-index: 10;
        padding: 0 6.25 0 0;
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
    .hero {
        stretch: aspectFill;
    }
    .hero-overlay {
        background-color: #000;
        opacity: 0.25;
        background: linear-gradient(to bottom, black, transparent);
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
    .text.subtitle {
        padding-top: 15;
        font-weight: 700;
        padding-bottom: 15;
    }
    .review-container {
        padding-bottom: 15;
    }
    .review-container.last {
        padding-bottom: 5;
    }
    .review {
        margin-top: 5;
        opacity: 0.5;
    }
    .disclaimer {
        padding-top: 25;
        font-size: 10;
        opacity: 0.5;
        line-height: 5;
    }

    /* Read more */
    .gradient {
        background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.1), #ffffff);
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
        border-radius: 6;
        background-color: rgba(0,112,218,0.1);
        font-size: 14;
    }
    .info-block .info-title {
        font-size: 16;
        font-weight: 700;
        padding-bottom: 5;
    }
    .info-block .left {
        padding-right: 25;
        font-weight: 700;
    }

    /* Addres block */
    .address-block {
        margin-top: 20;
    }
    .address-title {
        font-weight: 700;
        padding-bottom: 5;
    }
    .btn {
        margin-top: 12.5;
    }

    /* Tags */
    .tags {
        margin-bottom: 15;
    }
    .tag {
        border-width: 1;
        border-radius: 100%;
        background-color: #8f99ac;
        border-color: #8f99ac;
        margin: 0 4 4 0;
        padding: 4 8;
        font-weight: 500;
        color: #ffffff;
        font-size: 11;
    }
    .tag.primary {
        background-color: #0a7cf7;
        border-color: #0a7cf7;
    }
    .tag.activity-camping {
        background-color: #009fe3;
        border-color: #009fe3;
    }
    .tag.activity-nearby {
        background-color: #9ac331;
        border-color: #9ac331;
    }

    /* HR */
    .hr {
        border-top-width: 1;
        border-color: #e5e5e5;
        margin-top: 25;
    }
</style>