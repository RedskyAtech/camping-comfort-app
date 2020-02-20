<script>
    import { handleOpenURL } from 'nativescript-urlhandler';
    import Splash from '../pages/Splash'

    export default {
        mounted() {

            // Detect a deep link and redirect
            handleOpenURL((appURL) => {
                this.redirectToDeepLink('https://'+appURL.path);
            });
        },
        methods: {
            redirectToDeepLink: function(deepLink) {
                let self = this;
                if(self.$options.name === 'Splash') {

                    // Process the deeplink when already on the splash page
                    self.processScanResult({text: deepLink});
                }
                else {

                    // Set a timeout to wait until some listeners are removed
                    // App
                    // MyVacationList
                    // NewsItemList
                    // Loader
                    setTimeout(function() {

                        // Redirect to the splash page and pass the deeplink as a prop
                        self.$navigateTo(Splash, {
                            clearHistory: true,
                            transition: {
                                name: 'fade',
                            },
                            props: {
                                deepLink: deepLink
                            }
                        })
                    }, 1000);
                }
            }
        }
    }
</script>