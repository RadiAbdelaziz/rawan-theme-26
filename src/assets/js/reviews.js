/* =========================================================
   LUXURY TESTIMONIALS
   Premium Salla Slider Controller
========================================================= */

(function () {

    'use strict';


    /* =====================================================
       CONFIG
    ===================================================== */

    const SELECTOR = '#luxury-testimonials-slider';

    const AUTOPLAY_DELAY = 4200;

    const SWIPE_SPEED = 900;


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function initLuxuryTestimonials() {

        const sliders =
            document.querySelectorAll(SELECTOR);

        if (!sliders.length) {
            return;
        }

        sliders.forEach(function (slider) {

            initTestimonialsSlider(slider);

        });

    }


    /* =====================================================
       INIT SINGLE SLIDER
    ===================================================== */

    function initTestimonialsSlider(slider) {

        if (
            slider.dataset.luxuryTestimonialsInitialized === 'true'
        ) {
            return;
        }

        slider.dataset.luxuryTestimonialsInitialized = 'true';


        /* -------------------------------------------------
           Wait for Salla / Swiper
        ------------------------------------------------- */

        waitForSwiper(
            slider,
            function (swiper) {

                if (!swiper) {
                    return;
                }

                configureSwiper(
                    slider,
                    swiper
                );

            }
        );

    }


    /* =====================================================
       WAIT FOR SWIPER
    ===================================================== */

    function waitForSwiper(slider, callback) {

        let attempts = 0;

        const maxAttempts = 50;

        const timer =
            setInterval(function () {

                attempts++;

                let swiper = null;


                /* Salla component */

                if (
                    slider.swiper
                ) {
                    swiper = slider.swiper;
                }


                /* Shadow DOM */

                if (
                    !swiper &&
                    slider.shadowRoot
                ) {

                    const swiperElement =
                        slider.shadowRoot.querySelector(
                            '.swiper'
                        );

                    if (
                        swiperElement &&
                        swiperElement.swiper
                    ) {
                        swiper =
                            swiperElement.swiper;
                    }

                }


                /* Children */

                if (
                    !swiper
                ) {

                    const swiperElement =
                        slider.querySelector(
                            '.swiper'
                        );

                    if (
                        swiperElement &&
                        swiperElement.swiper
                    ) {
                        swiper =
                            swiperElement.swiper;
                    }

                }


                if (swiper) {

                    clearInterval(timer);

                    callback(swiper);

                    return;

                }


                if (
                    attempts >= maxAttempts
                ) {

                    clearInterval(timer);

                }

            }, 200);

    }


    /* =====================================================
       CONFIGURE SWIPER
    ===================================================== */

    function configureSwiper(
        slider,
        swiper
    ) {

        try {

            /*
             * جعل الحركة أكثر نعومة
             */

            swiper.params.speed =
                SWIPE_SPEED;


            swiper.params.loop =
                true;


            swiper.params.autoplay = {

                delay:
                    AUTOPLAY_DELAY,

                disableOnInteraction:
                    false,

                pauseOnMouseEnter:
                    true,

                waitForTransition:
                    true

            };


            /*
             * حركة Premium
             */

            swiper.params.easing =
                'cubic-bezier(.22,1,.36,1)';


            /*
             * تحديث
             */

            if (
                typeof swiper.update === 'function'
            ) {

                swiper.update();

            }


            /*
             * تشغيل Autoplay
             */

            if (
                swiper.autoplay &&
                typeof swiper.autoplay.start === 'function'
            ) {

                swiper.autoplay.start();

            }


            /*
             * Hover Pause
             */

            attachHoverControls(
                slider,
                swiper
            );


            /*
             * Touch interaction
             */

            attachTouchControls(
                slider,
                swiper
            );


            /*
             * Visibility
             */

            attachVisibilityControls(
                swiper
            );


            /*
             * Add movement class
             */

            slider.classList.add(
                'luxury-testimonials--ready'
            );


        } catch (error) {

            console.warn(
                'Luxury Testimonials:',
                error
            );

        }

    }


    /* =====================================================
       HOVER CONTROLS
    ===================================================== */

    function attachHoverControls(
        slider,
        swiper
    ) {

        let resumeTimer = null;


        slider.addEventListener(
            'mouseenter',
            function () {

                clearTimeout(
                    resumeTimer
                );

                pauseSwiper(
                    swiper
                );

            }
        );


        slider.addEventListener(
            'mouseleave',
            function () {

                clearTimeout(
                    resumeTimer
                );

                resumeTimer =
                    setTimeout(
                        function () {

                            playSwiper(
                                swiper
                            );

                        },
                        350
                    );

            }
        );

    }


    /* =====================================================
       TOUCH CONTROLS
    ===================================================== */

    function attachTouchControls(
        slider,
        swiper
    ) {

        slider.addEventListener(
            'touchstart',
            function () {

                pauseSwiper(
                    swiper
                );

            },
            {
                passive: true
            }
        );


        slider.addEventListener(
            'touchend',
            function () {

                setTimeout(
                    function () {

                        playSwiper(
                            swiper
                        );

                    },
                    1200
                );

            },
            {
                passive: true
            }
        );

    }


    /* =====================================================
       VISIBILITY
    ===================================================== */

    function attachVisibilityControls(
        swiper
    ) {

        document.addEventListener(
            'visibilitychange',
            function () {

                if (
                    document.hidden
                ) {

                    pauseSwiper(
                        swiper
                    );

                } else {

                    playSwiper(
                        swiper
                    );

                }

            }
        );

    }


    /* =====================================================
       PAUSE
    ===================================================== */

    function pauseSwiper(
        swiper
    ) {

        try {

            if (
                swiper &&
                swiper.autoplay &&
                typeof swiper.autoplay.stop === 'function'
            ) {

                swiper.autoplay.stop();

            }

        } catch (error) {}

    }


    /* =====================================================
       PLAY
    ===================================================== */

    function playSwiper(
        swiper
    ) {

        try {

            if (
                swiper &&
                swiper.autoplay &&
                typeof swiper.autoplay.start === 'function'
            ) {

                swiper.autoplay.start();

            }

        } catch (error) {}

    }


    /* =====================================================
       REFRESH
    ===================================================== */

    function refreshLuxuryTestimonials() {

        const sliders =
            document.querySelectorAll(
                SELECTOR
            );

        sliders.forEach(function (slider) {

            if (
                slider.swiper &&
                typeof slider.swiper.update === 'function'
            ) {

                slider.swiper.update();

            }

        });

    }


    /* =====================================================
       RESIZE
    ===================================================== */

    let resizeTimer = null;

    window.addEventListener(
        'resize',
        function () {

            clearTimeout(
                resizeTimer
            );

            resizeTimer =
                setTimeout(
                    refreshLuxuryTestimonials,
                    250
                );

        }
    );


    /* =====================================================
       DOM READY
    ===================================================== */

    if (
        document.readyState === 'loading'
    ) {

        document.addEventListener(
            'DOMContentLoaded',
            initLuxuryTestimonials
        );

    } else {

        initLuxuryTestimonials();

    }


    /* =====================================================
       SALLA / CUSTOM ELEMENT READY
    ===================================================== */

    window.addEventListener(
        'load',
        function () {

            setTimeout(
                initLuxuryTestimonials,
                500
            );

        }
    );


})();
