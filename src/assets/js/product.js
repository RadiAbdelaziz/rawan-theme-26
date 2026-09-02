import 'lite-youtube-embed';
import BasePage from './base-page';

import Fslightbox from 'fslightbox';
window.fslightbox = Fslightbox;

import { zoom } from './partials/image-zoom';


class Product extends BasePage {

    onReady() {

        app.watchElements({

            totalPrice: '.total-price',

            productWeight: '.product-weight',

            beforePrice: '.before-price',

            startingPriceTitle: '.starting-price-title',

            productSku: '.product-sku',

        });


        this.initProductOptionValidations();

        this.initImagesZooming();

        this.initStickyCart();

    }


    /* =====================================================
       PRODUCT OPTIONS / PRICE VALIDATION
    ====================================================== */

    initProductOptionValidations() {

        document
            .querySelector('.product-form')
            ?.addEventListener('change', function () {

                const isComplete =
                    Array.from(this.elements)
                        .every(el => el.validity.valid);

                if (isComplete) {

                    salla.product.getPrice(
                        new FormData(this)
                    );

                }

            });

    }


    /* =====================================================
       IMAGE ZOOM
    ====================================================== */

    initImagesZooming() {

        const createZoom = () => {

            if (window.innerWidth < 1024) {
                return;
            }


            const existingZoom =
                document.querySelector(
                    '.image-slider .magnify-wrapper.swiper-slide-active .img-magnifier-glass'
                );


            if (existingZoom) {
                return;
            }


            const image =
                document.querySelector(
                    '.image-slider .swiper-slide-active img'
                );


            if (!image?.id) {
                return;
            }


            setTimeout(() => {

                zoom(image.id, 2);

            }, 250);

        };


        createZoom();


        window.addEventListener(
            'resize',
            createZoom
        );


        const slider =
            document.querySelector(
                'salla-slider.details-slider'
            );


        if (!slider) {
            return;
        }


        slider.addEventListener(
            'slideChange',
            () => {

                setTimeout(() => {

                    if (window.innerWidth < 1024) {
                        return;
                    }


                    const existingZoom =
                        document.querySelector(
                            '.image-slider .swiper-slide-active .img-magnifier-glass'
                        );


                    if (existingZoom) {
                        return;
                    }


                    const image =
                        document.querySelector(
                            '.image-slider .magnify-wrapper.swiper-slide-active img'
                        );


                    if (image?.id) {

                        zoom(image.id, 2);

                    }

                }, 250);

            }
        );

    }


    /* =====================================================
       STICKY ADD TO CART
    ====================================================== */

    initStickyCart() {

        const sticky =
            document.querySelector(
                '#rawan-sticky-cart'
            );


        const stickyButton =
            document.querySelector(
                '#rawan-sticky-cart-button'
            );


        const productForm =
            document.querySelector(
                '#rawan-product-form'
            );


        if (
            !sticky ||
            !stickyButton ||
            !productForm
        ) {
            return;
        }


        /*
         * Show sticky bar after the main
         * purchase area leaves the viewport.
         */

        const purchaseArea =
            document.querySelector(
                '.rawan-main-cart-button'
            );


        if (!purchaseArea) {
            return;
        }


        const observer =
            new IntersectionObserver(
                (entries) => {

                    const entry = entries[0];


                    if (entry.isIntersecting) {

                        sticky.classList.remove(
                            'is-visible'
                        );

                        sticky.setAttribute(
                            'aria-hidden',
                            'true'
                        );

                    } else {

                        sticky.classList.add(
                            'is-visible'
                        );

                        sticky.setAttribute(
                            'aria-hidden',
                            'false'
                        );

                    }

                },
                {
                    threshold: 0.1
                }
            );


        observer.observe(purchaseArea);


        /*
         * Sticky button submits the SAME
         * product form.
         */

        stickyButton.addEventListener(
            'click',
            () => {

                if (
                    typeof productForm.requestSubmit ===
                    'function'
                ) {

                    productForm.requestSubmit();

                } else {

                    productForm.dispatchEvent(
                        new Event(
                            'submit',
                            {
                                bubbles: true,
                                cancelable: true
                            }
                        )
                    );

                }

            }
        );


        /*
         * Keep sticky price synchronized
         * with the main product price.
         */

        const stickyPrice =
            document.querySelector(
                '.rawan-sticky-cart__price'
            );


        const mainPrice =
            document.querySelector(
                '.rawan-product-info .total-price'
            );


        if (
            stickyPrice &&
            mainPrice
        ) {

            const priceObserver =
                new MutationObserver(
                    () => {

                        if (mainPrice.textContent.trim()) {

                            stickyPrice.textContent =
                                mainPrice.textContent.trim();

                        }

                    }
                );


            priceObserver.observe(
                mainPrice,
                {
                    childList: true,
                    subtree: true,
                    characterData: true
                }
            );

        }

    }


    /* =====================================================
       SALLA PRICE EVENTS
    ====================================================== */

    registerEvents() {


        /*
         * Price update failed
         */

        salla.event.on(
            'product::price.updated.failed',
            () => {

                const priceWrapper =
                    document.querySelector(
                        '.price-wrapper'
                    );


                if (priceWrapper) {

                    priceWrapper.classList.add(
                        'hidden'
                    );

                }


                const outOfStock =
                    document.querySelector(
                        '.out-of-stock'
                    );


                if (!outOfStock) {
                    return;
                }


                outOfStock.classList.remove(
                    'hidden'
                );


                outOfStock.classList.remove(
                    'scale-pulse'
                );


                void outOfStock.offsetWidth;


                outOfStock.classList.add(
                    'scale-pulse'
                );

            }
        );


        /*
         * Price updated successfully
         */

        salla.product.event.onPriceUpdated(
            (res) => {

                const outOfStock =
                    document.querySelector(
                        '.out-of-stock'
                    );


                const priceWrapper =
                    document.querySelector(
                        '.price-wrapper'
                    );


                if (outOfStock) {

                    outOfStock.classList.add(
                        'hidden'
                    );

                }


                if (priceWrapper) {

                    priceWrapper.classList.remove(
                        'hidden'
                    );

                }


                const data =
                    res.data;


                const isOnSale =
                    data.has_sale_price &&
                    data.regular_price > data.price;


                app.startingPriceTitle
                    ?.classList
                    .add('hidden');


                app.productWeight
                    .forEach(
                        (el) => {

                            el.innerHTML =
                                data.weight || '';

                        }
                    );


                app.totalPrice
                    .forEach(
                        (el) => {

                            el.innerHTML =
                                salla.money(
                                    data.price
                                );

                        }
                    );


                app.beforePrice
                    .forEach(
                        (el) => {

                            el.innerHTML =
                                salla.money(
                                    data.regular_price
                                );

                        }
                    );


                app.productSku
                    .forEach(
                        (el) => {

                            el.innerHTML =
                                data.sku || '';

                        }
                    );


                app.toggleClassIf(
                    '.price_is_on_sale',
                    'showed',
                    'hidden',
                    () => isOnSale
                );


                app.toggleClassIf(
                    '.starting-or-normal-price',
                    'hidden',
                    'showed',
                    () => isOnSale
                );


                /*
                 * Animation after price update
                 */

                document
                    .querySelectorAll(
                        '.total-price, .product-weight'
                    )
                    .forEach(
                        (el) => {

                            el.classList.remove(
                                'scale-pulse'
                            );


                            void el.offsetWidth;


                            el.classList.add(
                                'scale-pulse'
                            );

                        }
                    );

            }
        );


        /* =================================================
           READ MORE
        ================================================== */

        app.onClick(
            '#btn-show-more',
            e => {

                app.all(
                    '#more-content',
                    div => {

                        e.target.classList.add(
                            'is-expanded'
                        );


                        div.style =
                            `max-height:${div.scrollHeight}px`;

                    }
                ) || e.target.remove();

            }
        );

    }

}


Product.initiateWhenReady([
    'product.single'
]);