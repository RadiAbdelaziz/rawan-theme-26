(function () {
    'use strict';

    function initLuxuryNavigation() {
        var hero = document.querySelector('.luxury-overlay-hero');
        if (!hero) return;

        var toggle = hero.querySelector('#luxury-menu-toggle');
        var mobileMenu = hero.querySelector('#luxury-mobile-menu');
        var navigation = hero.querySelector('[data-luxury-main-navigation]');

        if (!toggle || !mobileMenu || !navigation) return;

        var navigationInner = navigation.querySelector('.luxury-overlay-navigation__inner');
        var placeholder = mobileMenu.querySelector('.luxury-overlay-header__mobile-menu-placeholder');

        if (!navigationInner || !placeholder) return;

        var mainMenu = navigationInner.querySelector('custom-main-menu');
        if (!mainMenu) return;

        var mobileBreakpoint = 768;

        function isMobile() {
            return window.innerWidth <= mobileBreakpoint;
        }

        function setMenuClosedState() {
            mobileMenu.classList.remove('is-open');
            mobileMenu.setAttribute('aria-hidden', 'true');
            toggle.setAttribute('aria-expanded', 'false');
        }

        function moveMenu() {
            if (isMobile()) {
                if (mainMenu.parentElement !== placeholder) {
                    placeholder.appendChild(mainMenu);
                }
            } else {
                if (mainMenu.parentElement !== navigationInner) {
                    navigationInner.appendChild(mainMenu);
                }
                setMenuClosedState();
            }
        }

        function toggleMenu() {
            if (!isMobile()) return;

            var isOpen = mobileMenu.classList.contains('is-open');
            if (isOpen) {
                setMenuClosedState();
            } else {
                mobileMenu.classList.add('is-open');
                mobileMenu.setAttribute('aria-hidden', 'false');
                toggle.setAttribute('aria-expanded', 'true');
            }
        }

        // Event Listeners
        toggle.addEventListener('click', toggleMenu);

        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(moveMenu, 100);
        });

        document.addEventListener('click', function (event) {
            if (!isMobile() || !mobileMenu.classList.contains('is-open')) return;
            if (mobileMenu.contains(event.target) || toggle.contains(event.target)) return;
            setMenuClosedState();
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') setMenuClosedState();
        });

        // Initial Execution
        moveMenu();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLuxuryNavigation);
    } else {
        initLuxuryNavigation();
    }
})();
