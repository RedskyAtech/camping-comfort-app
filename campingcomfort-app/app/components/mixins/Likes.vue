<script>
    import LocalStorage from '../mixins/LocalStorage'
    import { Toasty } from 'nativescript-toasty'

    export default {
        mixins: [
            LocalStorage
        ],
        methods: {

            /**
             * Get the likes from storage
             *
             * @returns {*}
             */
            getLikes() {
                if (this.keyExistsInStore('likes')) {
                    return this.getObjectFromStore('likes');
                }
                else {
                    return {};
                }
            },

            /**
             * Check if an ID is liked
             *
             * @param id
             * @returns {*}
             */
            isLiked() {
                let likes = this.getLikes();
                return likes[this.id];
            },

            /**
             * Like an ID
             *
             * @param id
             */
            like() {
                let likes = this.getLikes();
                if(!likes[this.id]){
                    likes[this.id] = true;
                    this.storeObject('likes', likes);

                    // Set the component data key if available
                    this.liked = true;

                    // Show a toast
                    new Toasty(this.$t('detail.liked')).show();
                }
            },

            /**
             * Remove a liked ID
             *
             * @param id
             */
            unlike() {
                let likes = this.getLikes();
                if(likes[this.id]){
                    delete likes[this.id];
                    this.storeObject('likes', likes);

                    // Set the component data key if available
                    this.liked = false;
                }
            },

            toggleLike() {
                let likes = this.getLikes();
                if(likes[this.id]){
                    this.unlike(this.id);
                }
                else {
                    this.like(this.id);
                }
            }
        }
    }
</script>