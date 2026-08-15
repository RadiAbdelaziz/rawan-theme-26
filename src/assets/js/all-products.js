(function () {

    function initLuxuryCarousels() {

        var carousels = document.querySelectorAll('.lux-carousel');

        if (!carousels.length) {
            return;
        }

        carousels.forEach(function (carousel) {

            /* منع التهيئة أكثر من مرة */
            if (carousel.dataset.initialized === 'true') {
                return;
            }

            var viewport = carousel.querySelector('.lux-carousel-viewport');
            var track = carousel.querySelector('.lux-carousel-track');

            if (!viewport || !track) {
                return;
            }

            var cards = Array.from(
                track.querySelectorAll('.lux-card')
            );

            if (cards.length <= 1) {
                return;
            }

            carousel.dataset.initialized = 'true';

            var isMoving = false;
            var timer = null;

            /*
             * مدة الانتظار بين كل حركة
             * يمكنك تغييرها هنا
             */
            var interval = 3500;

            /*
             * مدة الحركة نفسها
             * يجب أن تكون قريبة من مدة transition في CSS
             */
            var transitionDuration = 550;


            /* =====================================================
               GET STEP
               عرض البطاقة + المسافة بينها
            ===================================================== */

            function getStep() {

                var firstCard = track.querySelector('.lux-card');

                if (!firstCard) {
                    return 0;
                }

                var cardWidth =
                    firstCard.getBoundingClientRect().width;

                var styles =
                    window.getComputedStyle(track);

                var gap =
                    parseFloat(styles.columnGap || styles.gap) || 0;

                return cardWidth + gap;
            }


            /* =====================================================
               MOVE NEXT
               
               الحركة:
               RTL بصريًا
               البطاقة الأولى تتحرك إلى اليسار
               ثم تنتقل إلى نهاية القائمة
            ===================================================== */

            function moveNext() {

                if (isMoving) {
                    return;
                }

                var step = getStep();

                if (!step) {
                    return;
                }

                isMoving = true;


                /*
                 * نحرك الـtrack إلى اليسار
                 */
                track.style.transition =
                    'transform ' +
                    transitionDuration +
                    'ms cubic-bezier(.22,1,.36,1)';

                track.style.transform =
                    'translate3d(-' +
                    step +
                    'px, 0, 0)';


                /*
                 * بعد انتهاء الحركة
                 * ننقل أول بطاقة إلى النهاية
                 */
                setTimeout(function () {

                    var firstCard =
                        track.firstElementChild;

                    if (firstCard) {
                        track.appendChild(firstCard);
                    }


                    /*
                     * نوقف transition مؤقتًا
                     * حتى نعيد الـtrack إلى مكانه
                     * بدون أن يشعر المستخدم بالقفزة
                     */
                    track.style.transition = 'none';

                    track.style.transform =
                        'translate3d(0, 0, 0)';


                    /*
                     * إجبار المتصفح على إعادة الحساب
                     */
                    track.offsetHeight;


                    isMoving = false;

                }, transitionDuration);

            }


            /* =====================================================
               AUTOPLAY
            ===================================================== */

            function startAutoplay() {

                stopAutoplay();

                timer = setInterval(function () {

                    moveNext();

                }, interval);

            }


            function stopAutoplay() {

                if (timer) {

                    clearInterval(timer);

                    timer = null;

                }

            }


            /* =====================================================
               PAUSE WHEN HOVER
            ===================================================== */

            carousel.addEventListener(
                'mouseenter',
                function () {

                    stopAutoplay();

                }
            );


            carousel.addEventListener(
                'mouseleave',
                function () {

                    startAutoplay();

                }
            );


            /* =====================================================
               VISIBILITY
            ===================================================== */

            document.addEventListener(
                'visibilitychange',
                function () {

                    if (document.hidden) {

                        stopAutoplay();

                    } else {

                        startAutoplay();

                    }

                }
            );


            /* =====================================================
               RESIZE
            ===================================================== */

            var resizeTimer = null;

            window.addEventListener(
                'resize',
                function () {

                    clearTimeout(resizeTimer);

                    resizeTimer = setTimeout(
                        function () {

                            if (!isMoving) {

                                track.style.transition =
                                    'none';

                                track.style.transform =
                                    'translate3d(0, 0, 0)';

                            }

                        },
                        150
                    );

                }
            );


            /* =====================================================
               START
            ===================================================== */

            startAutoplay();

        });

    }


    /* =========================================================
       INITIALIZE
    ========================================================= */

    if (document.readyState === 'loading') {

        document.addEventListener(
            'DOMContentLoaded',
            initLuxuryCarousels
        );

    } else {

        initLuxuryCarousels();

    }

})();