(function () {
    function initCrystalReveal() {
        var sections = document.querySelectorAll('.crystal-categories-section');

        if (!sections.length) {
            return;
        }

        if (!('IntersectionObserver' in window)) {
            sections.forEach(function (section) {
                section.classList.add('is-visible');
            });

            return;
        }

        var observer = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add('is-visible');

                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        sections.forEach(function (section) {
            observer.observe(section);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            initCrystalReveal
        );
    } else {
        initCrystalReveal();
    }
})();