<script>
    import { Label } from 'tns-core-modules/ui/label'
    import { FormattedString } from 'tns-core-modules/text/formatted-string'
    import { Span } from 'tns-core-modules/text/span'
    import { TextField } from "tns-core-modules/ui/text-field";
    import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout"
    import * as utils from "tns-core-modules/utils/utils"

    export default {
        methods: {
            addRichText: function(key) {
                let self = this;
                let wrapper = this.$refs.richTextContainer.nativeView;

                // Empty the wrapper first
                wrapper.removeChildren();

                // Check if the model has the passed key
                if(self.item[key] !== undefined) {
                    this.iterateRichTextComponents(self.item[key]['_children'], wrapper);
                }
            },
            iterateRichTextComponents: function(obj, wrapper, parentHtmlTag = null) {
                let previousHtmlTag = null;
                Object.keys(obj).forEach(key=>{

                    // <p>
                    if(obj[key]['_type'] === 'p') {

                        // Iterate the children
                        if(obj[key]['_children']) {

                            // Add a StackLayout with some bottom padding
                            let stackLayout = new StackLayout();
                            stackLayout.style = 'padding-bottom: 5';
                            wrapper.addChild(stackLayout);

                            // Iterate the children
                            this.iterateRichTextComponents(obj[key]['_children'], stackLayout, obj[key]['_type']);
                        }
                    }

                    // <ul> / <ol>
                    if(obj[key]['_type'] === 'ul' || obj[key]['_type'] === 'ol') {
                        this.iterateRichTextComponents(obj[key]['_children'], wrapper, obj[key]['_type']);
                    }

                    // <li>
                    if(obj[key]['_type'] === 'li') {

                        // Iterate the children
                        if(obj[key]['_children']) {

                            // Add a StackLayout with some bottom padding
                            let stackLayout = new StackLayout();
                            stackLayout.style = 'padding-bottom: 5';
                            wrapper.addChild(stackLayout);

                            // Iterate the children
                            this.iterateRichTextComponents(obj[key]['_children'], stackLayout, obj[key]['_type']);
                        }
                    }

                    // <span>
                    if(obj[key]['_type'] === 'span') {

                        // Add a Label
                        if(wrapper.typeName !== 'Label') {
                            let label = new Label();
                            if (obj[key]['_attributes']['style']) {
                                label.style = obj[key]['_attributes']['style'];
                            }
                            wrapper.addChild(label);

                            // Iterate the children
                            if (obj[key]['_children']) {
                                this.iterateRichTextComponents(obj[key]['_children'], label, obj[key]['_type']);
                            }
                        }
                        else {

                            // Iterate the children
                            if (obj[key]['_children']) {
                                this.iterateRichTextComponents(obj[key]['_children'], wrapper, obj[key]['_type']);
                            }
                        }
                    }

                    // An <em> tag has a wrapper to which some styling is applied
                    if(obj[key]['_type'] === 'em') {

                        // Add a label if the wrapper isn't a label
                        if(wrapper.typeName !== 'Label'){
                            let label = new Label();
                            label.textWrap = true;
                            label.style = 'font-style: italic';
                            wrapper.addChild(label);

                            // Iterate the children
                            if(obj[key]['_children']) {
                                this.iterateRichTextComponents(obj[key]['_children'], label, obj[key]['_type']);
                            }
                        }
                        else {
                            wrapper.style = 'font-style: italic';

                            // Iterate the children
                            if(obj[key]['_children']) {
                                this.iterateRichTextComponents(obj[key]['_children'], wrapper, obj[key]['_type']);
                            }
                        }
                    }

                    // <strong>
                    if(obj[key]['_type'] === 'strong') {

                        // Add a label if the wrapper isn't a label
                        if(wrapper.typeName !== 'Label'){
                            let label = new Label();
                            label.textWrap = true;
                            label.style = 'font-weight: bold';
                            wrapper.addChild(label);

                            // Iterate the children
                            if(obj[key]['_children']) {
                                this.iterateRichTextComponents(obj[key]['_children'], label, obj[key]['_type']);
                            }
                        }
                        else {
                            wrapper.style = 'font-weight: bold';

                            // Iterate the children
                            if(obj[key]['_children']) {
                                this.iterateRichTextComponents(obj[key]['_children'], wrapper, obj[key]['_type']);
                            }
                        }
                    }

                    // An <em> tag has a wrapper to which some styling is applied
                    if(obj[key]['_type'] === 'a') {

                        // Create a label
                        let label = new Label();
                        label.textWrap = true;

                        // Create a formatted string for the label
                        let formattedString = new FormattedString();

                        // Add a span for the formatted string
                        let span = new Span();
                        span.color = '#0070da';
                        span.style = 'text-decoration: underline';
                        Object.keys(obj[key]['_children']).forEach(key2=>{
                            if(obj[key]['_children'][key2]['_type'] === '_text') {
                                span.text = obj[key]['_children'][key2]['_content'];
                            }
                        });

                        // Add the span to the formatted string
                        formattedString.spans.push(span);

                        // Add the formatted string to the label
                        label.formattedText = formattedString;

                        // Add an onTap event
                        label.on("tap", function() {
                            let url = obj[key]['_attributes']['href'];
                            if(url.substr(0,4) !== 'http'){
                                url = 'https://'+url;
                            }
                            utils.openUrl(url);
                        }, this);

                        wrapper.addChild(label);
                    }

                    // Create a wrapping label and add text
                    if(obj[key]['_type'] === '_text') {

                        // Skip this node if the parent HTML tag is a <ul> or <ol> and the content is only a new line
                        if((parentHtmlTag === 'ul' || parentHtmlTag === 'ol') && obj[key]['_content'] === '\n') {

                        }
                        else {

                            // Add a label if the wrapper isn't a label or span
                            if(wrapper.typeName !== 'Label' && wrapper.typeName !== 'Span'){
                                let label = new Label();
                                label.textWrap = true;

                                // Replace new line characters
                                label.text = obj[key]['_content'] === '\n' ? ' ' : obj[key]['_content'].replace(/[\r\n]+/g, '');
                                wrapper.addChild(label);
                            }

                            // Add the text to the wrapper
                            else {
                                wrapper.text = obj[key]['_content'] === '\n' ? ' ' : obj[key]['_content'];
                            }
                        }
                    }

                    // <br>
                    if(obj[key]['_type'] === 'br') {

                        // Only insert a blank line when the previous tag wasn't _text
                        if(previousHtmlTag !== '_text') {
                            let label = new Label();
                            label.textWrap = true;
                            label.text = ' ';
                            wrapper.addChild(label);
                            console.log('br added');
                        }
                    }

                    // Set the previous HTML tag
                    previousHtmlTag = obj[key]['_type'];
                });
            }
        }
    }
</script>