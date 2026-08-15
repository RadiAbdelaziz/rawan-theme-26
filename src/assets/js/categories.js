/* =========================================================
   LUXURY CATEGORIES SHOWCASE
   Crystal + Reveal + Hover + Horizontal Motion
   مستقل عن الأقسام الأخرى
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

    const sections = document.querySelectorAll('.categories-section');

    if (!sections.length) return;


    sections.forEach(function (section) {

        const cards = section.querySelectorAll('.cat-item');
        const list = section.querySelector('.categories-list');
        const crystal = section.querySelectorAll('.decor-line .crystal');


        /* =====================================================
           1. STAGGER ANIMATION
           ظهور التصنيفات بالتتابع
           ===================================================== */

        cards.forEach(function (card, index) {

            card.style.setProperty(
                '--category-delay',
                (index * 90) + 'ms'
            );

        });


        /* =====================================================
           2. INTERSECTION OBSERVER
           تشغيل الحركة عند وصول القسم للشاشة
           ===================================================== */

        if ('IntersectionObserver' in window) {

            const observer = new IntersectionObserver(
                function (entries) {

                    entries.forEach(function (entry) {

                        if (!entry.isIntersecting) return;

                        section.classList.add('categories-visible');

                        cards.forEach(function (card, index) {

                            setTimeout(function () {

                                card.classList.add('is-visible');

                            }, index * 90);

                        });

                        observer.unobserve(section);

                    });

                },
                {
                    threshold: 0.15
                }
            );

            observer.observe(section);

        } else {

            section.classList.add('categories-visible');

            cards.forEach(function (card) {
                card.classList.add('is-visible');
            });

        }


        /* =====================================================
           3. CRYSTAL FLOATING ANIMATION
           البلورة تتحرك بشكل حي
           ===================================================== */

        crystal.forEach(function (item, index) {

            let angle = index % 2 === 0 ? 0 : 45;

            function animateCrystal(time) {

                if (!document.body.contains(item)) return;

                const y = Math.sin(time / 900 + index) * 5;
                const scale = 1 + Math.sin(time / 700 + index) * 0.06;

                item.style.transform =
                    `rotate(${angle}deg) translateY(${y}px) scale(${scale})`;

                requestAnimationFrame(animateCrystal);
            }

            requestAnimationFrame(animateCrystal);

        });


        /* =====================================================
           4. MOUSE PARALLAX
           حركة بسيطة للبطاقات مع الماوس
           ===================================================== */

        cards.forEach(function (card) {

            card.addEventListener('mousemove', function (event) {

                if (window.innerWidth <= 768) return;

                const rect = card.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left) /
                    rect.width - 0.5;

                const y =
                    (event.clientY - rect.top) /
                    rect.height - 0.5;

                const rotateX = y * -5;
                const rotateY = x * 5;

                card.style.setProperty(
                    '--card-x',
                    `${x * 5}px`
                );

                card.style.setProperty(
                    '--card-y',
                    `${y * 5}px`
                );

                card.style.setProperty(
                    '--card-rx',
                    `${rotateX}deg`
                );

                card.style.setProperty(
                    '--card-ry',
                    `${rotateY}deg`
                );

            });


            card.addEventListener('mouseleave', function () {

                card.style.setProperty('--card-x', '0px');
                card.style.setProperty('--card-y', '0px');
                card.style.setProperty('--card-rx', '0deg');
                card.style.setProperty('--card-ry', '0deg');

            });

        });


        /* =====================================================
           5. HORIZONTAL DRAG
           سحب التصنيفات بالماوس / اللمس
           ===================================================== */

        if (list) {

            let isDown = false;
            let startX = 0;
            let scrollLeft = 0;

            list.addEventListener('pointerdown', function (event) {

                isDown = true;

                startX = event.clientX;

                scrollLeft = list.scrollLeft;

                list.classList.add('is-dragging');

            });


            list.addEventListener('pointermove', function (event) {

                if (!isDown) return;

                const distance =
                    event.clientX - startX;

                list.scrollLeft =
                    scrollLeft - distance;

            });


            function stopDragging() {

                isDown = false;

                list.classList.remove('is-dragging');

            }

            list.addEventListener(
                'pointerup',
                stopDragging
            );

            list.addEventListener(
                'pointercancel',
                stopDragging
            );

            list.addEventListener(
                'pointerleave',
                stopDragging
            );

        }


        /* =====================================================
           6. AUTO MICRO-MOTION
           حركة خفيفة جداً أثناء عدم التفاعل
           ===================================================== */

        if (list && window.innerWidth > 768) {

            let autoScroll = true;

            let animationFrame;

            function autoMove() {

                if (!autoScroll) return;

                if (
                    list.scrollWidth >
                    list.clientWidth
                ) {

                    list.scrollLeft += 0.25;

                    if (
                        list.scrollLeft +
                        list.clientWidth >=
                        list.scrollWidth - 2
                    ) {

                        list.scrollLeft = 0;

                    }

                }

                animationFrame =
                    requestAnimationFrame(autoMove);
            }

            list.addEventListener(
                'mouseenter',
                function () {
                    autoScroll = false;
                    cancelAnimationFrame(animationFrame);
                }
            );

            list.addEventListener(
                'mouseleave',
                function () {
                    autoScroll = true;
                    autoMove();
                }
            );

            autoMove();

        }


        /* =====================================================
           7. TOUCH FRIENDLY
           إيقاف الحركة التلقائية أثناء اللمس
           ===================================================== */

        if (list) {

            list.addEventListener(
                'touchstart',
                function () {
                    list.classList.add('is-touching');
                },
                {
                    passive: true
                }
            );

            list.addEventListener(
                'touchend',
                function () {
                    list.classList.remove('is-touching');
                },
                {
                    passive: true
                }
            );

        }

    });


    /* =========================================================
       REDUCED MOTION
       ========================================================= */

    const reducedMotion =
        window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;


    if (reducedMotion) {

        document
            .querySelectorAll(
                '.categories-section .cat-item'
            )
            .forEach(function (card) {

                card.classList.add('is-visible');

            });

    }

});