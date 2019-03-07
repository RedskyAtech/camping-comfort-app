<template>
    <Page :class="pageClass" actionBarHidden="true">
        <GridLayout rows="auto,*" columns="*">
            <StackLayout row="0" class="title-container">
                <GridLayout>
                    <TextField row="0" col="0" ref="textField" @loaded="textFieldLoaded"></TextField>
                    <Label row="0" col="0" class="back-btn fas" horizontalAlignment="left" @tap="$modal.close('Foo')">{{ 'fa-arrow-left' | fonticon }}</Label>
                </GridLayout>
            </StackLayout>
            <Stacklayout row="1"></Stacklayout>
        </GridLayout>
    </Page>
</template>

<script>
    import Responsive from '../mixins/Responsive'

    export default {
        mixins: [
            Responsive
        ],
        methods: {
            textFieldLoaded(){
                this.$refs.textField.nativeView.focus();
            }
        }
    }
</script>

<style scoped>

    /* Title */
    .title-container {
        background-color: #454f63;
        padding: 25;
        font-weight: 500;
    }
    Page.xs .title-container {
        padding: 25 12.5;
    }
    TextField {
        background: #fff;
        border-radius: 5;
        padding: 12.5 12.5 12.5 60;
    }
    .back-btn {
        width: 60;
        text-align: center;
    }
</style>