<template>
    <Page :class="pageClass" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <Header :hasHero="true" :title="$t('home.map')" :showHeader="true" :showBackBtn="true" :inModal="true" background="#009fe3" color="#fff">
            <GridLayout rows="*" columns="*" width="100%" height="100%" class="content">
                <StackLayout verticalAlignment="center">
                    <StackLayout>
                        <Label class="intro-title" textWrap="true" :text="$t('identification.title')"></Label>
                    </StackLayout>
                    <StackLayout>
                        <Label class="intro-text" textWrap="true" :text="$t('identification.text')"></Label>
                    </StackLayout>
                    <StackLayout class="input-fields">
                        <TextField v-model="guestName" :hint="$t('identification.guestName')" class="input" ref="inputName" editable="true" returnKeyType="done" />
                        <TextField v-model="guestLocation" :hint="$t('identification.guestLocation')" class="input" ref="inputLocation"editable="true" returnKeyType="done" />
                    </StackLayout>
                    <StackLayout class="button" verticalAlignment="center" @tap="submit">
                        <Label :text="$t('splash.continue')"></Label>
                    </StackLayout>
                </StackLayout>
            </GridLayout>
        </Header>
    </Page>
</template>

<script>
    import EventBus from '../helpers/EventBus'
    import LocalStorage from '../mixins/LocalStorage'
    import Responsive from '../mixins/Responsive'
    import Header from '../elements/Header'

    export default {
        components: {
            Header: Header
        },
        data: function() {
            return {
                guestName: '',
                guestLocation: ''
            }
        },
        mixins: [
            LocalStorage,
            Responsive
        ],
        methods: {
            submit: function() {

                // Store the data
                if(this.guestName) {
                    this.storeString('guestName', this.guestName);

                    if(this.guestLocation) {
                        this.storeString('guestLocation', this.guestLocation);
                    }

                    // Activate tab 5
                    EventBus.$emit('toTab5');

                    // Close the modal
                    this.$modal.close();
                }
            }
        }
    }
</script>

<style scoped>
    .content {
        padding: 25;
        background: linear-gradient(to bottom, #009fe3, rgba(0,159,227,0.7));
        text-align: center;
    }
    .intro-title {
        font-size: 18;
        font-weight: 700;
    }
    .intro-text {
        font-size: 18;
        padding-top: 12.5;
        padding-bottom: 25;
    }
    .input {
        border-width: 1;
        border-color: rgba(255,255,255,0.25);
        color: #fff;
        height: 40;
        border-radius: 5;
        margin-bottom: 10;
        placeholder-color: #fff;
        text-align: left;
        padding-left: 10;
        padding-right: 10;
        background: rgba(255,255,255,0.1);
    }
    .button {
        color: #009fe3;
        border-color: #fff;
        background-color: #fff;
        border-width: 1;
        height: 40;
        border-radius: 20;
    }
    Page.lg .button,
    Page.xl .button,
    Page.xxl .button{
        width: 350;
    }
</style>