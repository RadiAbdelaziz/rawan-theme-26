/* =========================================================
   LUXURY REVIEWS CAROUSEL
   تحريك تقييمات العملاء تلقائياً
========================================================= */

(function () {

    'use strict';


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function initLuxuryReviews() {

        const sliders = document.querySelectorAll(
            '#luxury-reviews-slider'
        );


        if (!sliders.length) {
            return;
        }


        sliders.forEach(function (slider) {

            initReviewsSlider(slider);

        });

    }


    /* =====================================================
       REVIEWS SLIDER
    ===================================================== */

    function initReviewsSlider(slider) {

        const items = slider.querySelector(
            '[slot="items"]'
        );


        if (!items) {
            return;
        }


        const cards = items.querySelectorAll(
            '.luxury-review-card'
        );


        if (cards.length <= 1) {
            return;
        }


        /* =================================================
           PREVENT DUPLICATE INITIALIZATION
        ================================================= */

        if (slider.dataset.reviewsInitialized === 'true') {
            return;
        }


        slider.dataset.reviewsInitialized = 'true';


        /* =================================================
           AUTOPLAY
        ================================================= */

        let currentIndex = 0;

        const intervalTime = 4000;


        /* =================================================
           GET VISIBLE CARDS
        ================================================= */

        function getVisibleCards() {

            const width = window.innerWidth;


            if (width <= 600) {

                return 1;

            }


            if (width <= 992) {

                return 2;

            }


            return 4;

        }


        /* =================================================
           MOVE SLIDER
        ================================================= */

        function moveSlider() {

            const visibleCards =
                getVisibleCards();


            const totalCards =
                cards.length;


            if (totalCards <= visibleCards) {

                return;

            }


            currentIndex++;


            if (
                currentIndex >
                totalCards - visibleCards
            ) {

                currentIndex = 0;

            }


            const card =
                cards[currentIndex];


            if (!card) {
                return;
            }


            card.scrollIntoView({

                behavior: 'smooth',

                block: 'nearest',

                inline: 'start'

            });

        }


        /* =================================================
           START AUTOPLAY
        ================================================= */

        let autoplay =
            setInterval(
                moveSlider,
                intervalTime
            );


        /* =================================================
           PAUSE ON HOVER
        ================================================= */

        slider.addEventListener(
            'mouseenter',
            function () {

                clearInterval(autoplay);

            }
        );


        /* =================================================
           RESUME AFTER HOVER
        ================================================= */

        slider.addEventListener(
            'mouseleave',
            function () {

                clearInterval(autoplay);


                autoplay =
                    setInterval(
                        moveSlider,
                        intervalTime
                    );

            }
        );


        /* =================================================
           RESET INDEX ON RESIZE
        ================================================= */

        window.addEventListener(
            'resize',
            function () {

                currentIndex = 0;

            }
        );

    }


    /* =====================================================
       DOM READY
    ===================================================== */

    if (
        document.readyState === 'loading'
    ) {

        document.addEventListener(
            'DOMContentLoaded',
            initLuxuryReviews
        );

    } else {

        initLuxuryReviews();

    }


})();