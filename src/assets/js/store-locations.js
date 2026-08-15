/* =========================================================
   STORE LOCATIONS
   Interactive Leaflet Map
========================================================= */

document.addEventListener('DOMContentLoaded', function () {

    'use strict';


    /* =====================================================
       CHECK LEAFLET
    ===================================================== */

    if (typeof L === 'undefined') {
        return;
    }


    /* =====================================================
       FIND MAPS
    ===================================================== */

    const mapElements = document.querySelectorAll(
        '[data-store-map]'
    );


    if (!mapElements.length) {
        return;
    }


    /* =====================================================
       INITIALIZE EACH SECTION
    ===================================================== */

    mapElements.forEach(function (mapElement) {

        const section =
            mapElement.closest('.store-location-section');


        if (!section) {
            return;
        }


        /* =================================================
           CONTROLS
        ================================================= */

        const showControls =
            section.dataset.showControls !== 'false';


        /* =================================================
           BRANCHES
        ================================================= */

        const branchButtons =
            section.querySelectorAll(
                '.store-branch-card'
            );


        /* =================================================
           DEFAULT LOCATION
        ================================================= */

        let defaultLat = 24.7136;
        let defaultLng = 46.6753;


        if (branchButtons.length) {

            const firstBranch =
                branchButtons[0];

            const firstLat =
                parseFloat(
                    firstBranch.dataset.lat
                );

            const firstLng =
                parseFloat(
                    firstBranch.dataset.lng
                );


            if (
                Number.isFinite(firstLat) &&
                Number.isFinite(firstLng)
            ) {

                defaultLat = firstLat;
                defaultLng = firstLng;

            }

        }


        /* =================================================
           CREATE MAP
        ================================================= */

        const map = L.map(
            mapElement,
            {
                zoomControl: showControls,
                scrollWheelZoom: showControls,
                dragging: true,
                doubleClickZoom: showControls,
                touchZoom: showControls
            }
        ).setView(
            [
                defaultLat,
                defaultLng
            ],
            12
        );


        /* =================================================
           OPENSTREETMAP
        ================================================= */

        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                attribution:
                    '&copy; OpenStreetMap contributors',

                maxZoom: 19
            }
        ).addTo(map);


        /* =================================================
           MARKER
        ================================================= */

        const marker = L.marker(
            [
                defaultLat,
                defaultLng
            ]
        ).addTo(map);


        /* =================================================
           BRANCH CLICK
        ================================================= */

        branchButtons.forEach(function (button) {

            button.addEventListener(
                'click',
                function () {

                    const lat =
                        parseFloat(
                            this.dataset.lat
                        );

                    const lng =
                        parseFloat(
                            this.dataset.lng
                        );

                    const name =
                        this.dataset.name || 'الفرع';


                    if (
                        !Number.isFinite(lat) ||
                        !Number.isFinite(lng)
                    ) {
                        return;
                    }


                    /* =====================================
                       MOVE MAP
                    ===================================== */

                    map.flyTo(
                        [
                            lat,
                            lng
                        ],
                        15,
                        {
                            animate: true,
                            duration: 1
                        }
                    );


                    /* =====================================
                       UPDATE MARKER
                    ===================================== */

                    marker
                        .setLatLng(
                            [
                                lat,
                                lng
                            ]
                        )
                        .bindPopup(
                            '<strong>' +
                            name +
                            '</strong>'
                        )
                        .openPopup();


                    /* =====================================
                       ACTIVE CARD
                    ===================================== */

                    branchButtons.forEach(
                        function (card) {

                            card.classList.remove(
                                'active'
                            );

                        }
                    );


                    this.classList.add(
                        'active'
                    );

                }
            );

        });


        /* =================================================
           ACTIVATE FIRST BRANCH
        ================================================= */

        if (branchButtons.length) {

            branchButtons[0]
                .classList.add('active');

            marker
                .bindPopup(
                    '<strong>' +
                    (
                        branchButtons[0]
                            .dataset.name ||
                        'الفرع الرئيسي'
                    ) +
                    '</strong>'
                )
                .openPopup();

        }


        /* =================================================
           FIX MAP SIZE
        ================================================= */

        setTimeout(function () {

            map.invalidateSize();

        }, 300);


    });

});