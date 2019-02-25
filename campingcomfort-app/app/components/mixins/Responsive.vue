<script>
    var platform = require("platform");

    export default {
        computed: {
            pageClass: function () {
                if (platform.screen.mainScreen.widthDIPs >= 768) {
                    return 'tablet';
                }
                if (platform.screen.mainScreen.widthDIPs < 375) {
                    return 'small-phone';
                }
            }
        }
    }
</script>