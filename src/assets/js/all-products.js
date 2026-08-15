(function () {

    /* =========================================================
       LUXURY PRODUCTS
       REVEAL + AUTO CAROUSEL
       ========================================================= */


    /* =========================================================
       INITIALIZE ALL LUXURY SECTIONS
       ========================================================= */

    function initLuxuryProducts() {

        var sections = document.querySelectorAll(
            '.luxury-products-section'
        );

        if (!sections.length) {
            return;
        }


        /* =====================================================
           INTERSECTION OBSERVER
           ===================================================== */

        var observer = null;


        /*
         * إذا كان المتصفح يدعم IntersectionObserver
         * نستخدمه للتحكم في ظهور القسم وتشغيل الـCarousel
         */

        if ('IntersectionObserver' in window) {

            observer = new IntersectionObserver(

                function (entries) {

                    entries.forEach(function (entry) {

                        var section =
                            entry.target;

                        var carousel =
                            section.querySelector(
                                '.lux-carousel'
                            );


                        /* =================================================
                           SECTION ENTERS VIEW
                        ================================================= */

                        if (entry.isIntersecting) {

                            /*
                             * إضافة class الخاصة بالظهور
                             */

                            section.classList.add(
                                'is-visible'
                            );


                            /*
                             * تشغيل الـCarousel
                             */

                            if (carousel) {

                                startCarousel(
                                    carousel
                                );

                            }


                            /*
                             * لا نوقف مراقبة القسم
                             * لأننا نريد معرفة خروجه من الشاشة
                             */

                        }


                        /* =================================================
                           SECTION LEAVES VIEW
                        ================================================= */

                        else {

                            /*
                             * إيقاف الـCarousel عندما يخرج
                             * القسم من الشاشة
                             */

                            if (carousel) {

                                stopCarousel(
                                    carousel
                                );

                            }

                        }

                    });

                },

                {
                    /*
                     * يبدأ الظهور عندما يظهر حوالي 15%
                     * من القسم
                     */

                    threshold: 0.15,

                    /*
                     * نبدأ قبل وصول القسم بالكامل
                     * بقليل لإعطاء حركة ناعمة
                     */

                    rootMargin:
                        '0px 0px -60px 0px'
                }

            );


        }


        /* =====================================================
           INITIALIZE SECTIONS
        ===================================================== */

        sections.forEach(function (section) {

            /*
             * منع التهيئة أكثر من مرة
             */

            if (
                section.dataset.luxInitialized === 'true'
            ) {

                return;

            }


            section.dataset.luxInitialized = 'true';


            /*
             * إذا لم يكن IntersectionObserver متاحًا
             * نظهر القسم مباشرة
             */

            if (!observer) {

                section.classList.add(
                    'is-visible'
                );

            }


            /*
             * البحث عن الـCarousel
             */

            var carousel =
                section.querySelector(
                    '.lux-carousel'
                );


            /*
             * إذا لم يوجد Carousel
             * نكتفي بأنيميشن ظهور القسم
             */

            if (!carousel) {

                if (observer) {

                    observer.observe(
                        section
                    );

                }

                return;

            }


            /*
             * تهيئة بيانات الـCarousel
             */

            initCarouselData(
                carousel
            );


            /*
             * مراقبة القسم
             */

            if (observer) {

                observer.observe(
                    section
                );

            }

            else {

                /*
                 * المتصفح لا يدعم IntersectionObserver
                 * لذلك نبدأ مباشرة
                 */

                startCarousel(
                    carousel
                );

            }

        });

    }


    /* =========================================================
       INITIALIZE CAROUSEL DATA
       ========================================================= */

    function initCarouselData(carousel) {

        /*
         * منع التهيئة أكثر من مرة
         */

        if (
            carousel.dataset.carouselInitialized === 'true'
        ) {

            return;

        }


        var viewport =
            carousel.querySelector(
                '.lux-carousel-viewport'
            );

        var track =
            carousel.querySelector(
                '.lux-carousel-track'
            );


        if (!viewport || !track) {

            return;

        }


        var cards =
            Array.from(
                track.querySelectorAll(
                    '.lux-card'
                )
            );


        /*
         * لا يوجد عدد كافٍ من المنتجات
         */

        if (cards.length <= 1) {

            return;

        }


        carousel.dataset.carouselInitialized =
            'true';


        /*
         * حالة الحركة
         */

        carousel._luxIsMoving =
            false;


        /*
         * المؤقت
         */

        carousel._luxTimer =
            null;


        /*
         * هل الماوس فوق الـCarousel؟
         */

        carousel._luxHovered =
            false;


        /*
         * مدة الانتظار بين الحركات
         */

        carousel._luxInterval =
            3500;


        /*
         * مدة حركة الـCarousel
         */

        carousel._luxTransitionDuration =
            550;


        /*
         * حفظ الـviewport والـtrack
         */

        carousel._luxViewport =
            viewport;

        carousel._luxTrack =
            track;


        /*
         * =====================================================
         * MOUSE ENTER
         * =====================================================
         */

        carousel.addEventListener(
            'mouseenter',
            function () {

                carousel._luxHovered =
                    true;

                stopCarousel(
                    carousel
                );

            }
        );


        /*
         * =====================================================
         * MOUSE LEAVE
         * =====================================================
         */

        carousel.addEventListener(
            'mouseleave',
            function () {

                carousel._luxHovered =
                    false;

                /*
                 * لا نبدأ إلا إذا كان القسم ظاهرًا
                 */

                var section =
                    carousel.closest(
                        '.luxury-products-section'
                    );


                if (
                    section &&
                    section.classList.contains(
                        'is-visible'
                    )
                ) {

                    startCarousel(
                        carousel
                    );

                }

            }
        );


        /*
         * =====================================================
         * RESIZE
         * =====================================================
         */

        var resizeTimer =
            null;


        carousel._luxResizeHandler =
            function () {

                clearTimeout(
                    resizeTimer
                );


                resizeTimer =
                    setTimeout(
                        function () {

                            if (
                                !carousel._luxIsMoving
                            ) {

                                track.style.transition =
                                    'none';

                                track.style.transform =
                                    'translate3d(0, 0, 0)';

                            }

                        },
                        150
                    );

            };


        window.addEventListener(
            'resize',
            carousel._luxResizeHandler
        );

    }


    /* =========================================================
       GET STEP
       CARD WIDTH + GAP
       ========================================================= */

    function getCarouselStep(carousel) {

        var track =
            carousel._luxTrack;


        if (!track) {

            return 0;

        }


        var card =
            track.querySelector(
                '.lux-card'
            );


        if (!card) {

            return 0;

        }


        var cardWidth =
            card.getBoundingClientRect().width;


        var styles =
            window.getComputedStyle(
                track
            );


        var gap =
            parseFloat(
                styles.columnGap ||
                styles.gap
            ) || 0;


        return cardWidth + gap;

    }


    /* =========================================================
       MOVE NEXT
       RIGHT → LEFT
       ========================================================= */

    function moveCarouselNext(carousel) {

        /*
         * منع الحركة أثناء حركة أخرى
         */

        if (
            carousel._luxIsMoving
        ) {

            return;

        }


        var track =
            carousel._luxTrack;


        if (!track) {

            return;

        }


        var step =
            getCarouselStep(
                carousel
            );


        if (!step) {

            return;

        }


        carousel._luxIsMoving =
            true;


        var duration =
            carousel._luxTransitionDuration;


        /*
         * =====================================================
         * MOVE TRACK LEFT
         * =====================================================
         */

        track.style.transition =
            'transform ' +
            duration +
            'ms cubic-bezier(.22, 1, .36, 1)';


        track.style.transform =
            'translate3d(-' +
            step +
            'px, 0, 0)';


        /*
         * =====================================================
         * AFTER ANIMATION
         * =====================================================
         */

        setTimeout(
            function () {

                var firstCard =
                    track.firstElementChild;


                /*
                 * نقل أول بطاقة إلى النهاية
                 */

                if (firstCard) {

                    track.appendChild(
                        firstCard
                    );

                }


                /*
                 * إيقاف الانتقال
                 */

                track.style.transition =
                    'none';


                /*
                 * إعادة الـtrack إلى الصفر
                 * بدون حركة
                 */

                track.style.transform =
                    'translate3d(0, 0, 0)';


                /*
                 * إجبار المتصفح على إعادة الحساب
                 */

                track.offsetHeight;


                carousel._luxIsMoving =
                    false;


            },
            duration
        );

    }


    /* =========================================================
       START AUTOPLAY
       ========================================================= */

    function startCarousel(carousel) {

        if (!carousel) {

            return;

        }


        /*
         * يجب أن تكون تهيئة الـCarousel موجودة
         */

        if (
            carousel.dataset.carouselInitialized !==
            'true'
        ) {

            return;

        }


        /*
         * إذا كان الماوس فوق الـCarousel
         * لا نشغل الحركة
         */

        if (carousel._luxHovered) {

            return;

        }


        /*
         * إذا كانت الصفحة مخفية
         * لا نشغل الحركة
         */

        if (document.hidden) {

            return;

        }


        /*
         * إيقاف أي Timer قديم
         */

        stopCarousel(
            carousel
        );


        /*
         * بدء الـAutoplay
         */

        carousel._luxTimer =
            setInterval(
                function () {

                    /*
                     * التأكد أن القسم ما زال ظاهرًا
                     */

                    var section =
                        carousel.closest(
                            '.luxury-products-section'
                        );


                    if (
                        section &&
                        !section.classList.contains(
                            'is-visible'
                        )
                    ) {

                        return;

                    }


                    moveCarouselNext(
                        carousel
                    );

                },
                carousel._luxInterval
            );

    }


    /* =========================================================
       STOP AUTOPLAY
       ========================================================= */

    function stopCarousel(carousel) {

        if (!carousel) {

            return;

        }


        if (
            carousel._luxTimer
        ) {

            clearInterval(
                carousel._luxTimer
            );

            carousel._luxTimer =
                null;

        }

    }


    /* =========================================================
       PAGE VISIBILITY
       ========================================================= */

    document.addEventListener(
        'visibilitychange',
        function () {

            var carousels =
                document.querySelectorAll(
                    '.lux-carousel'
                );


            carousels.forEach(
                function (carousel) {

                    if (
                        document.hidden
                    ) {

                        stopCarousel(
                            carousel
                        );

                        return;

                    }


                    /*
                     * عند العودة للصفحة
                     * نشغل فقط الـCarousel
                     * الموجود داخل قسم ظاهر
                     */

                    var section =
                        carousel.closest(
                            '.luxury-products-section'
                        );


                    if (
                        section &&
                        section.classList.contains(
                            'is-visible'
                        )
                    ) {

                        startCarousel(
                            carousel
                        );

                    }

                }
            );

        }
    );


    /* =========================================================
       START INITIALIZATION
       ========================================================= */

    if (
        document.readyState === 'loading'
    ) {

        document.addEventListener(
            'DOMContentLoaded',
            initLuxuryProducts
        );

    }

    else {

        initLuxuryProducts();

    }

})();