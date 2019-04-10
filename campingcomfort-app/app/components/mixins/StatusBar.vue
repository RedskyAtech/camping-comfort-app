<script>
    let application = require("application").android;

    export default {
        methods: {
            statusBar: function(action) {
                var activity = application.startActivity;
                var win = activity.getWindow();
                if(action === 'hide'){
                    win.addFlags(android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN);
                } else if(action === 'show'){
                    win.clearFlags(android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN);
                }
            }
        }
    }
</script>