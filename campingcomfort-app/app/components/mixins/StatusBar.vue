<script>
    let application = require("application").android;
    import { isAndroid, isIOS, device, screen } from "tns-core-modules/platform";

    export default {
        methods: {
            statusBar: function(action) {
                if(isAndroid) {
                    var activity = application.startActivity;
                    var win = activity.getWindow();
                    if(action === 'hide'){
                        win.addFlags(android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN);
                    } else if(action === 'show'){
                        win.clearFlags(android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN);
                    }
                }
            }
        },
        mounted: function() {
            this.statusBar('hide');
        }
    }
</script>