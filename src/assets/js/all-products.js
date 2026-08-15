(function () {
    function initAllProductsCarousel() {
        var carousels = document.querySelectorAll('[data-lux-carousel]');

        if (!carousels.length) {
            return;
        }

        carousels.forEach(function (carousel) {
            if (carousel.dataset.initialized === 'true') {
                return;
            }

            var viewport = carousel.querySelector('.lux-carousel-viewport');
            var track = carousel.querySelector('.lux-carousel-track');
            var cards = track ? Array.from(track.children) : [];

            var previousButton = carousel.querySelector('[data-carousel-prev]');
            var nextButton = carousel.querySelector('[data-carousel-next]');

            if (!viewport || !track || cards.length <= 1) {
                return;
            }

            carousel.dataset.initialized = 'true';

            var interval = parseInt(
                carousel.dataset.interval || '3000',
                10
            );

            var timer = null;
            var isMoving = false;

            function getStep() {
                var card = track.querySelector('.lux-card');

                if (!card) {
                    return 0;
                }

                var cardWidth = card.getBoundingClientRect().width;
                var styles = window.getComputedStyle(track);
                var gap = parseFloat(styles.gap) || 0;

                return cardWidth + gap;
            }

            function moveNext() {
                if (isMoving || cards.length <= 1) {
                    return;
                }

                var step = getStep();

                if (!step) {
                    return;
                }

                isMoving = true;

                track.style.transform = 'translateX(' + step + 'px)';
                track.classList.add('is-moving');

                setTimeout(function () {
                    var firstCard = track.firstElementChild;

                    if (firstCard) {
                        track.appendChild(firstCard);
                    }

                    track.classList.remove('is-moving');
                    track.style.transform = 'translateX(0)';
                    isMoving = false;
                }, 500);
            }

            function movePrevious() {
                if (isMoving || cards.length <= 1) {
                    return;
                }

                var step = getStep();

                if (!step) {
                    return;
                }

                isMoving = true;

                var lastCard = track.lastElementChild;

                if (lastCard) {
                    track.insertBefore(lastCard, track.firstElementChild);
                }

                track.style.transform = 'translateX(' + step + 'px)';
                track.classList.add('is-moving');

                requestAnimationFrame(function () {
                    requestAnimationFrame(function () {
                        track.style.transform = 'translateX(0)';
                    });
                });

                setTimeout(function () {
                    track.classList.remove('is-moving');
                    isMoving = false;
                }, 500);
            }

            function startAutoplay() {
                if (carousel.dataset.autoplay !== 'true') {
                    return;
                }

                stopAutoplay();

                timer = setInterval(moveNext, interval);
            }

            function stopAutoplay() {
                if (timer) {
                    clearInterval(timer);
                    timer = null;
                }
            }

            if (nextButton) {
                nextButton.addEventListener('click', function () {
                    moveNext();
                    startAutoplay();
                });
            }

            if (previousButton) {
                previousButton.addEventListener('click', function () {
                    movePrevious();
                    startAutoplay();
                });
            }

            carousel.addEventListener('mouseenter', stopAutoplay);
            carousel.addEventListener('mouseleave', startAutoplay);

            document.addEventListener('visibilitychange', function () {
                if (document.hidden) {
                    stopAutoplay();
                } else {
                    startAutoplay();
                }
            });

            window.addEventListener('resize', function () {
                if (!isMoving) {
                    track.style.transform = 'translateX(0)';
                }
            });

            startAutoplay();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            initAllProductsCarousel
        );
    } else {
        initAllProductsCarousel();
    }
})();