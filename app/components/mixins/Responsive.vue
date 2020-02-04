<script>
    var platform = require("platform");

    export default {
        computed: {
            screenWidth: function() {
                return platform.screen.mainScreen.widthDIPs;
            },
            pageClass: function () {
                let w = platform.screen.mainScreen.widthDIPs;

                // Very small Android phone
                if (w < 321) {
                    return 'xxs';
                }

                // iPhone SE
                if (w >= 321 && w < 375) {
                    return 'xs';
                }

                // iPhone 6
                if (w >= 375 && w < 414) {
                    return 'sm';
                }

                // iPhone 7/8
                if (w >= 414 && w < 480) {
                    return 'md';
                }

                // Large phone
                if (w >= 480 && w < 768) {
                    return 'lg';
                }

                // Small tablet tablet
                if (w >= 768 && w < 1536) {
                    return 'xl';
                }

                // Small tablet tablet
                if (w >= 1536) {
                    return 'xxl';
                }
            }
        }
    }
</script>