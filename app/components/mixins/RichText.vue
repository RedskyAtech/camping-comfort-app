<script>

    export default {
        data: function() {
            return {
                richText: ''
            }
        },
        methods: {

            // Set the font size for Android
            htmlViewLoaded: function() {
                if(this.$isAndroid) {
                    let htmlView = this.$refs.htmlView.nativeView.android;
                    htmlView.setTextSize(16);
                }
            },

            // Add the rich text from html
            addRichText: function(html) {

                let self = this;

                // Define the style for iOS (Android doesn't support style tags in a HtmlView)
                let style = `<style>
                    html, body, td {
                        margin: 0;
                        padding: 0;
                        font-family: 'Avenir', sans-serif;
                        font-weight: 400;
                        color: #8e8e8e;
                        font-size: 16px;
                    }
                </style>`;

                // Set the font and font size for iOS
                if(self.$isIOS) {
                    self.richText = style+html;

                    // Re-render the HtmlView to re-calculate the height
                    self.$nextTick(function() {
                        self.$refs.htmlView.nativeView.requestLayout();
                    });
                }

                // Just set the HTML for Android
                else {
                    self.richText = html;
                }
            }
        }
    }
</script>