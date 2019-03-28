<script>
    import EventBus from '../helpers/EventBus'
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
            isLiked(id) {
                let likes = this.getLikes();
                return likes[id];
            },

            /**
             * Like an ID
             *
             * @param id
             */
            like(id) {
                let likes = this.getLikes();
                if(!likes[id]){
                    likes[id] = true;
                    this.storeObject('likes', likes);

                    // Set the component data key if available
                    this.liked = true;

                    // Force updating the data in other components
                    EventBus.$emit('reInit');

                    // Show a toast
                    new Toasty(this.$t('detail.liked')).show();
                }
            },

            /**
             * Remove a liked ID
             *
             * @param id
             */
            unlike(id) {
                let likes = this.getLikes();
                if(likes[id]){
                    delete likes[id];
                    this.storeObject('likes', likes);

                    // Set the component data key if available
                    this.liked = false;

                    // Force updating the data in other components
                    EventBus.$emit('reInit');
                }
            },

            /**
             * Toggle a like
             *
             * @param id
             */
            toggleLike(id) {
                let likes = this.getLikes();
                if(likes[id]){
                    this.unlike(id);
                }
                else {
                    this.like(id);
                }
            }
        }
    }
</script>