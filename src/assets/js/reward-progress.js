/* =========================================================
   LUXURY REWARD PROGRESS
   ربط شريط المكافأة بالسلة
========================================================= */

(function () {

    'use strict';


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function initLuxuryReward() {

        const sections = document.querySelectorAll(
            '.luxury-reward-section'
        );


        if (!sections.length) {
            return;
        }


        sections.forEach(function (section) {

            initRewardSection(section);

        });

    }


    /* =====================================================
       SECTION
    ===================================================== */

    function initRewardSection(section) {


        /* =================================================
           ELEMENTS
        ================================================= */

        const progressBar = section.querySelector(
            '[data-progress-bar]'
        );


        const rewardStatus = section.querySelector(
            '[data-reward-status]'
        );


        const rewardIcon = section.querySelector(
            '[data-reward-icon]'
        );


        const targetElement = section.querySelector(
            '[data-reward-target]'
        );


        const steps = {
            cart: section.querySelector(
                '[data-step="cart"]'
            ),

            shipping: section.querySelector(
                '[data-step="shipping"]'
            ),

            gift: section.querySelector(
                '[data-step="gift"]'
            )
        };


        /* =================================================
           TARGET
           سعر المنتج المرجعي
        ================================================= */

        const target = parseFloat(
            section.dataset.rewardTarget ||
            (targetElement
                ? targetElement.dataset.rewardTarget
                : 0)
        );


        if (!target || target <= 0) {

            setUnavailableState(section);

            return;
        }


        /* =================================================
           UPDATE
        ================================================= */

        function updateReward(cartTotal) {


            cartTotal = parseFloat(cartTotal) || 0;


            /* =============================================
               CALCULATE PROGRESS
            ============================================= */

            let progress = (
                cartTotal / target
            ) * 100;


            progress = Math.max(
                0,
                Math.min(100, progress)
            );


            /* =============================================
               PROGRESS BAR
            ============================================= */

            if (progressBar) {

                progressBar.style.width =
                    progress + '%';

            }


            /* =============================================
               UPDATE DATA ATTRIBUTE
            ============================================= */

            section.dataset.cartTotal = cartTotal;

            section.dataset.rewardProgress = progress;


            /* =============================================
               BEFORE TARGET
            ============================================= */

            if (cartTotal < target) {


                const remaining =
                    target - cartTotal;


                if (rewardStatus) {

                    rewardStatus.textContent =
                        'أضيفي ' +
                        formatPrice(remaining) +
                        ' للوصول إلى المكافأة';

                }


                if (rewardIcon) {

                    rewardIcon.textContent = '✓';

                }


                setStepState(
                    steps.cart,
                    true
                );


                setStepState(
                    steps.shipping,
                    false
                );


                setStepState(
                    steps.gift,
                    false
                );


                section.classList.remove(
                    'reward-complete'
                );

            }


            /* =============================================
               TARGET REACHED
            ============================================= */

            else {


                if (rewardStatus) {

                    rewardStatus.textContent =
                        '{{ component.status_complete ?: "مبروك! لقد وصلتِ إلى المكافأة" }}';

                }


                if (rewardIcon) {

                    rewardIcon.textContent = '✓';

                }


                setStepState(
                    steps.cart,
                    true
                );


                setStepState(
                    steps.shipping,
                    true
                );


                setStepState(
                    steps.gift,
                    true
                );


                section.classList.add(
                    'reward-complete'
                );

            }

        }


        /* =================================================
           LOAD CART
        ================================================= */

        function loadCart() {


            if (
                typeof window.salla === 'undefined' ||
                !window.salla.cart
            ) {

                return;

            }


            try {

                const request =
                    window.salla.cart.details();


                if (
                    request &&
                    typeof request.then === 'function'
                ) {

                    request
                        .then(function (response) {

                            const total =
                                extractCartTotal(response);

                            updateReward(total);

                        })
                        .catch(function () {

                            updateReward(0);

                        });

                }

            } catch (error) {

                console.warn(
                    'Luxury Reward:',
                    error
                );

            }

        }


        /* =================================================
           CART EVENTS
        ================================================= */

        function bindCartEvents() {


            if (
                typeof window.salla === 'undefined' ||
                !window.salla.cart
            ) {

                return;

            }


            /* =============================================
               PRODUCT ADDED
            ============================================= */

            if (
                window.salla.cart.event &&
                typeof window.salla.cart.event.onItemAdded ===
                'function'
            ) {

                window.salla.cart.event.onItemAdded(
                    function () {

                        setTimeout(
                            loadCart,
                            300
                        );

                    }
                );

            }


            /* =============================================
               PRODUCT REMOVED
            ============================================= */

            if (
                window.salla.cart.event &&
                typeof window.salla.cart.event.onItemRemoved ===
                'function'
            ) {

                window.salla.cart.event.onItemRemoved(
                    function () {

                        setTimeout(
                            loadCart,
                            300
                        );

                    }
                );

            }


            /* =============================================
               CART UPDATED
            ============================================= */

            if (
                window.salla.cart.event &&
                typeof window.salla.cart.event.onUpdated ===
                'function'
            ) {

                window.salla.cart.event.onUpdated(
                    function () {

                        setTimeout(
                            loadCart,
                            300
                        );

                    }
                );

            }

        }


        /* =================================================
           INITIAL LOAD
        ================================================= */

        loadCart();


        /* =================================================
           BIND EVENTS
        ================================================= */

        bindCartEvents();

    }


    /* =====================================================
       CART TOTAL
    ===================================================== */

    function extractCartTotal(response) {


        if (!response) {

            return 0;
        }


        const data =
            response.data ||
            response;


        /* =============================================
           POSSIBLE TOTAL LOCATIONS
        ============================================= */

        const possibleTotals = [

            data.total,

            data.total_price,

            data.sub_total,

            data.subtotal,

            data.cart &&
            data.cart.total,

            data.cart &&
            data.cart.total_price,

            data.cart &&
            data.cart.sub_total,

            data.data &&
            data.data.total,

            data.data &&
            data.data.total_price

        ];


        for (
            let i = 0;
            i < possibleTotals.length;
            i++
        ) {


            const value =
                parseFloat(
                    possibleTotals[i]
                );


            if (
                !isNaN(value) &&
                value >= 0
            ) {

                return value;

            }

        }


        /* =============================================
           FALLBACK
           جمع أسعار العناصر
        ============================================= */

        const items =
            data.items ||
            data.cart_items ||
            (
                data.cart &&
                data.cart.items
            ) ||
            [];


        if (Array.isArray(items)) {


            return items.reduce(
                function (total, item) {


                    const price =
                        parseFloat(
                            item.price ||
                            item.total ||
                            item.product_price ||
                            0
                        );


                    const quantity =
                        parseFloat(
                            item.quantity || 1
                        );


                    return total +
                        (price * quantity);

                },
                0
            );

        }


        return 0;

    }


    /* =====================================================
       STEP STATE
    ===================================================== */

    function setStepState(
        step,
        active
    ) {


        if (!step) {

            return;
        }


        step.classList.toggle(
            'active',
            active
        );


        step.classList.toggle(
            'completed',
            active
        );

    }


    /* =====================================================
       UNAVAILABLE STATE
    ===================================================== */

    function setUnavailableState(section) {


        section.classList.add(
            'reward-unavailable'
        );


        const status =
            section.querySelector(
                '[data-reward-status]'
            );


        if (status) {

            status.textContent =
                'لم يتم تحديد منتج للمكافأة';

        }


        const bar =
            section.querySelector(
                '[data-progress-bar]'
            );


        if (bar) {

            bar.style.width = '0%';

        }

    }


    /* =====================================================
       FORMAT PRICE
    ===================================================== */

    function formatPrice(value) {


        value =
            Math.max(
                0,
                Number(value) || 0
            );


        try {

            return new Intl.NumberFormat(
                'ar-SA',
                {
                    maximumFractionDigits: 2
                }
            ).format(value);

        } catch (error) {

            return value.toFixed(2);

        }

    }


    /* =====================================================
       DOM READY
    ===================================================== */

    if (
        document.readyState === 'loading'
    ) {

        document.addEventListener(
            'DOMContentLoaded',
            initLuxuryReward
        );

    } else {

        initLuxuryReward();

    }


})();