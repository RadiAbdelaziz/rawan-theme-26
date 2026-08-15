/* =========================================================
   LUXURY REWARD PROGRESS
   ربط شريط المكافأة بالسلة بشكل مباشر
========================================================= */

(function () {

    'use strict';


    /* =====================================================
       INITIALIZE
       تهيئة جميع أقسام المكافأة
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
       REWARD SECTION
       تهيئة القسم
    ===================================================== */

    function initRewardSection(section) {

        const progressBar = section.querySelector(
            '[data-progress-bar]'
        );


        const rewardStatus = section.querySelector(
            '[data-reward-status]'
        );


        const rewardIcon = section.querySelector(
            '[data-reward-icon]'
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
           REWARD TARGET
           الحد المطلوب للوصول للمكافأة
        ================================================= */

        const target = parseFloat(
            section.dataset.rewardTarget || 0
        );


        if (!target || target <= 0) {

            setUnavailableState(section);

            return;

        }


        /* =================================================
           UPDATE REWARD
           تحديث الشريط والحالة
        ================================================= */

        function updateReward(cartTotal) {

            cartTotal = parseFloat(cartTotal) || 0;


            /* =============================================
               CALCULATE PROGRESS
            ============================================= */

            let progress =
                (cartTotal / target) * 100;


            progress = Math.max(
                0,
                Math.min(100, progress)
            );


            /* =============================================
               UPDATE PROGRESS BAR
            ============================================= */

            if (progressBar) {

                progressBar.style.width =
                    progress + '%';

            }


            /* =============================================
               SAVE STATE
            ============================================= */

            section.dataset.cartTotal =
                cartTotal;

            section.dataset.rewardProgress =
                progress;


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
                    cartTotal > 0
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
                        'مبروك! لقد وصلتِ إلى المكافأة';
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
           قراءة إجمالي السلة من Salla
        ================================================= */

        function loadCart() {

            if (
                typeof window.salla === 'undefined' ||
                !window.salla.cart ||
                typeof window.salla.cart.details !== 'function'
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
                        .catch(function (error) {

                            console.warn(
                                'Luxury Reward: Cart details failed',
                                error
                            );

                            updateReward(0);

                        });

                }

            } catch (error) {

                console.warn(
                    'Luxury Reward: Cart error',
                    error
                );

            }

        }


        /* =================================================
           REFRESH CART
           تأخير بسيط حتى تكتمل عملية السلة
        ================================================= */

        function refreshCart() {

            setTimeout(function () {

                loadCart();

            }, 500);

        }


        /* =================================================
           CART EVENTS
           أحداث السلة
        ================================================= */

        function bindCartEvents() {

            if (
                typeof window.salla === 'undefined' ||
                !window.salla.cart ||
                !window.salla.cart.event
            ) {

                return;

            }


            const cartEvents =
                window.salla.cart.event;


            /* =============================================
               PRODUCT ADDED
               تمت إضافة منتج
            ============================================= */

            if (
                typeof cartEvents.onItemAdded ===
                'function'
            ) {

                cartEvents.onItemAdded(
                    function () {

                        refreshCart();

                    }
                );

            }


            /* =============================================
               PRODUCT DELETED
               تم حذف منتج
            ============================================= */

            if (
                typeof cartEvents.onItemDeleted ===
                'function'
            ) {

                cartEvents.onItemDeleted(
                    function () {

                        refreshCart();

                    }
                );

            }


            /* =============================================
               CART UPDATED
               تغيرت كمية أو بيانات السلة
            ============================================= */

            if (
                typeof cartEvents.onUpdated ===
                'function'
            ) {

                cartEvents.onUpdated(
                    function () {

                        refreshCart();

                    }
                );

            }

        }


        /* =================================================
           INITIAL LOAD
           التحميل الأول
        ================================================= */

        loadCart();


        /* =================================================
           BIND EVENTS
           ربط أحداث السلة
        ================================================= */

        bindCartEvents();


        /* =================================================
           FALLBACK REFRESH
           فحص دوري احتياطي
        ================================================= */

        let lastTotal =
            section.dataset.cartTotal || '';


        setInterval(function () {

            if (
                typeof window.salla === 'undefined' ||
                !window.salla.cart
            ) {

                return;

            }


            loadCart();

        }, 5000);

    }


    /* =====================================================
       EXTRACT CART TOTAL
       استخراج إجمالي السلة
    ===================================================== */

    function extractCartTotal(response) {

        if (!response) {

            return 0;

        }


        let data =
            response.data ||
            response;


        /* =================================================
           إذا كانت الاستجابة تحتوي على data داخل data
        ================================================= */

        if (
            data &&
            data.data &&
            typeof data.data === 'object'
        ) {

            data = data.data;

        }


        /* =================================================
           POSSIBLE CART OBJECTS
        ================================================= */

        const cart =
            data.cart ||
            data;


        /* =================================================
           POSSIBLE TOTALS
        ================================================= */

        const possibleTotals = [

            cart.total,

            cart.total_price,

            cart.sub_total,

            cart.subtotal,

            cart.grand_total,

            cart.amount,

            data.total,

            data.total_price,

            data.sub_total,

            data.subtotal

        ];


        for (
            let i = 0;
            i < possibleTotals.length;
            i++
        ) {

            const value =
                parseFloat(
                    cleanNumber(
                        possibleTotals[i]
                    )
                );


            if (
                !isNaN(value) &&
                value >= 0
            ) {

                return value;

            }

        }


        /* =================================================
           FALLBACK
           جمع أسعار المنتجات
        ================================================= */

        const items =
            cart.items ||
            data.items ||
            data.cart_items ||
            [];


        if (Array.isArray(items)) {

            return items.reduce(
                function (total, item) {

                    const quantity =
                        parseFloat(
                            item.quantity || 1
                        );


                    const itemTotal =
                        parseFloat(
                            cleanNumber(
                                item.total
                            )
                        );


                    if (
                        !isNaN(itemTotal) &&
                        itemTotal >= 0
                    ) {

                        return total + itemTotal;

                    }


                    const price =
                        parseFloat(
                            cleanNumber(
                                item.price ||
                                item.product_price ||
                                0
                            )
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
       CLEAN NUMBER
       تنظيف الرقم من الرموز
    ===================================================== */

    function cleanNumber(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return 0;

        }


        if (typeof value === 'number') {

            return value;

        }


        return String(value)
            .replace(/[^0-9.-]/g, '');

    }


    /* =====================================================
       STEP STATE
       حالة مراحل المكافأة
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
       حالة عدم توفر الحد
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
                'لم يتم تحديد قيمة المكافأة';

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
       تنسيق السعر
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