<script>
    var platform = require("platform");

    export default {
        computed: {
            pageClass: function () {
                let w = platform.screen.mainScreen.widthDIPs;
console.log(w);
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

                // Tablet
                if (w >= 480 && w < 768) {
                    return 'lg';
                }

                // Large tablet
                if (w >= 768) {
                    return 'xl';
                }
            }
        }
    }
</script>