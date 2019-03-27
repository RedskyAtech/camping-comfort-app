<script>
    import { connectionType, getConnectionType, startMonitoring, stopMonitoring } from 'tns-core-modules/connectivity';

    export default {
        data: function() {
            return {
                connectionType: ''
            }
        },
        created: function(){

            // Get the connection type
            const myConnectionType = getConnectionType();

            // Register the connection type
            switch (myConnectionType) {
                case connectionType.none:
                    this.connectionType = 'none';
                    break;
                case connectionType.wifi:
                    this.connectionType = 'wifi';
                    break;
                case connectionType.mobile:
                    this.connectionType = 'mobile';
                    break;
                case connectionType.ethernet:
                    this.connectionType = 'ethernet';
                    break;
                default:
                    break;
            }

            // Start monitoring a change in the connection type
            startMonitoring((newConnectionType) => {
                switch (newConnectionType) {
                    case connectionType.none:
                        this.connectionType = 'none';
                        break;
                    case connectionType.wifi:
                        this.connectionType = 'wifi';
                        break;
                    case connectionType.mobile:
                        this.connectionType = 'mobile';
                        break;
                    case connectionType.ethernet:
                        this.connectionType = 'ethernet';
                        break;
                    default:
                        break;
                }
            });
            startMonitoring();

            // Explicitly stop the monitoring
//            stopMonitoring();
        },
        methods: {

            /**
             * Check if the app has an internet connection
             *
             * @returns {boolean}
             */
            hasInternetConnection: function(){
                if(this.connectionType === 'wifi' || this.connectionType === 'mobile' || this.connectionType === 'ethernet'){
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    }
</script>