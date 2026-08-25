(function () {
    'use strict';

    function initLuxuryNavigation() {
        var hero = document.querySelector('.luxury-overlay-hero');
        if (!hero) return;

        // جلب العناصر مع توفير عناصر بديلة لتجنب التوقف
        var toggle = hero.querySelector('#luxury-menu-toggle') || hero.querySelector('.luxury-overlay-header__control');
        var mobileMenu = hero.querySelector('#luxury-mobile-menu') || hero.querySelector('.luxury-overlay-header__mobile-menu');
        var navigation = hero.querySelector('[data-luxury-main-navigation]') || hero.querySelector('.luxury-overlay-navigation');

        if (!mobileMenu || !navigation) return;

        // البحث عن الحاوية الداخلية أو استخدام الحاوية الرئيسية مباشرة
        var navigationInner = navigation.querySelector('.luxury-overlay-navigation__inner') || navigation;
        var placeholder = mobileMenu.querySelector('.luxury-overlay-header__mobile-menu-placeholder') || mobileMenu;

        var mainMenu = navigation.querySelector('custom-main-menu') || mobileMenu.querySelector('custom-main-menu');
        if (!mainMenu) return;

        var mobileBreakpoint = 768;

        function isMobile() {
            return window.innerWidth <= mobileBreakpoint;
        }

        function setMenuClosedState() {
            mobileMenu.classList.remove('is-open');
            mobileMenu.setAttribute('aria-hidden', 'true');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
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

        function toggleMenu(event) {
            if (event) event.preventDefault();
            if (!isMobile()) return;

            var isOpen = mobileMenu.classList.contains('is-open');
            if (isOpen) {
                setMenuClosedState();
            } else {
                mobileMenu.classList.add('is-open');
                mobileMenu.setAttribute('aria-hidden', 'false');
                if (toggle) toggle.setAttribute('aria-expanded', 'true');
            }
        }

        // Event Listeners
        if (toggle) {
            toggle.addEventListener('click', toggleMenu);
        }

        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(moveMenu, 100);
        });

        document.addEventListener('click', function (event) {
            if (!isMobile() || !mobileMenu.classList.contains('is-open')) return;
            if (mobileMenu.contains(event.target) || (toggle && toggle.contains(event.target))) return;
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