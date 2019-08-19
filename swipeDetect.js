class SwipeDetect {
    /**
     * @param {HTMLElement} element
     * @param {Object} params
     */
    constructor(element, params) {
        /**
         * Constants
         * @public
         */
        this.EVENTS_START = ['mousedown', 'touchstart'];
        this.EVENTS_MOVE = ['mousemove', 'touchmove'];
        this.EVENTS_END = ['mouseup', 'touchend'];

        const defaults = {
            /**
             * Amount of pixels, when swipe don't count.
             * @property {Number} swipeThreshold
             */
            swipeThreshold: 70,
            /**
             * Flag that indicates reaction only on touch events, Not on mouse events too.
             * @property {Boolean} useOnlyTouch
             */
            useOnlyTouch: false,
            /**
             * Flag that indicates support for vertical swipe.
             * @property {Boolean} verticalSwipe
             */
            verticalSwipe: false,
            /**
             * Flag that indicates to remove the listeners after the first swipe is completed
             * @property {Boolean} removeListenersAfterSwipe
             */
            removeListenersAfterSwipe: false,
            /**
             * On before swipe callback
             * Triggers just before starting to swipe (at first tap)
             * The element is also passed to the function
             * @property {function}
             */
            onBeforeSwipe: () => {},
            /**
             * On after swipe callback
             * Triggers after the swipe is completed (tap release)
             * The element is also passed to the function
             * @property {function}
             */
            onAfterSwipe: () => {}
        };
        /**
         * The state of the swipe
         * States: 0 - no swipe, 1 - swipe started, 2 - swipe released
         * @property {Number} swipeState
         */
        this.swipeState = 0;
        /**
         * Coordinates when swipe started
         * @property {Number} startX
         * @property {Number} startY
         */
        this.startX = 0;
        this.startY = 0;
        /**
         * Distance of swipe
         * @property {Number} pixelOffsetX
         * @property {Number} pixelOffsetY
         */
        this.pixelOffsetX = 0;
        this.pixelOffsetY = 0;
        /**
         * Target element which should detect swipes
         * @property {HTMLElement} element
         */
        this.element = element;
        /**
         * Target element which should detect end of swipes
         * @property {HTMLElement} html
         */
        this.html = document.querySelector('html');
        /**
         * Settings object merged with defauls
         * @property {Object} settings
         */
        this.settings = Utils.mergeObjects(defaults, params);

        this._swipeStart = this._swipeStart.bind(this);
        this._swiping = this._swiping.bind(this);

        this._init();
    }

    /**
     * Initialize
     * @private
     * @return void
     */
    _init(){
        const t = this;

        this.EVENTS_START.forEach((event) => {
            t.element.addEventListener(event, t._swipeStart, false);
        });

        this.EVENTS_MOVE.forEach((event) => {
            t.html.addEventListener(event, t._swiping, false);
        });
    }
    /**
     * Start the swipe, sets the state and position
     * @private
     * @return void
     */
    _swipeStart(event) {

        if (this.settings.useOnlyTouch && !event.touches){
            return;
        }

        if (event.touches){
            event = event.touches[0];
        }

        if (this.swipeState === 0) {
            this.settings.onBeforeSwipe.call(this, this.element);
            this.swipeState = 1;
            this.startX = event.clientX;
            this.startY = event.clientY;
        }
    }
    /**
     * End of swipe, trigger events based on swipe direction, remove listeners
     * @private
     * @return void
     */
    _swipeEnd(event) {
        if (this.swipeState === 2) {
            this.swipeState = 0;

            if (
                Math.abs(this.pixelOffsetX) >= Math.abs(this.pixelOffsetY)
                && Math.abs(this.pixelOffsetX) >= this.settings.swipeThreshold
            ) { // Horizontal Swipe
                if (this.pixelOffsetX < 0) {
                    this.element.dispatchEvent(new Event('swipeLeft.amo'));
                } else {
                    this.element.dispatchEvent(new Event('swipeRight.amo'));
                }
            } else if (
                this.settings.verticalSwipe &&
                (Math.abs(this.pixelOffsetY) >= this.settings.swipeThreshold)
            ) { // Vertical swipe
                if (this.pixelOffsetY < 0) {
                    this.element.dispatchEvent(new Event('swipeUp.amo'));
                } else {
                    this.element.dispatchEvent(new Event('swipeDown.amo'));

                }
            }
            this.settings.onAfterSwipe.call(this, this.element);
            this.settings.removeListenersAfterSwipe && this._removeListeners();
        }
    }
    /**
     * Actual swiping detection
     * @private
     * @return void
     */
    _swiping(event){
        // If swipe is not occurring, do nothing, bubble away.
        if (this.swipeState !== 1){
            return;
        }

        if (event.touches) {
            event = event.touches[0];
        }

        const swipeOffsetX = event.clientX - this.startX;
        const swipeOffsetY = event.clientY - this.startY;

        if (
            (Math.abs(swipeOffsetX) >= this.settings.swipeThreshold)
            || (Math.abs(swipeOffsetY) >= this.settings.swipeThreshold)
        ) {
            this.swipeState = 2;
            this.pixelOffsetX = swipeOffsetX;
            this.pixelOffsetY = swipeOffsetY;
            this._swipeEnd(event);
        }
    }
    /**
     * Remove listeners
     * @private
     * @return void
     */
    _removeListeners(){
        const t = this;

        this.EVENTS_START.forEach((event) => {
            t.element.removeEventListener(event, t._swipeStart, false);
        });

        this.EVENTS_MOVE.forEach((event) => {
            t.html.removeEventListener(event, t._swiping, false);
        });
    }
}
