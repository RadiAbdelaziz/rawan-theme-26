class BrandVideo {
    constructor(container) {
        this.container = container;
        this.wrapper = container.querySelector(".brand-video__wrapper");
        this.video = container.querySelector(".brand-video__video");
        this.overlay = container.querySelector(".brand-video__overlay");
        this.playButton = container.querySelector(".brand-video__play");

        if (!this.video || !this.wrapper) return;

        this.bindEvents();
    }

    bindEvents() {

        if (this.playButton) {
            this.playButton.addEventListener("click", (e) => {
                e.preventDefault();
                this.play();
            });
        }

        this.overlay?.addEventListener("click", () => {
            this.play();
        });

        this.video.addEventListener("click", () => {
            this.toggle();
        });

        this.video.addEventListener("play", () => {
            this.wrapper.classList.add("is-playing");
        });

        this.video.addEventListener("pause", () => {
            this.wrapper.classList.remove("is-playing");
        });

        this.video.addEventListener("ended", () => {
            this.wrapper.classList.remove("is-playing");
        });
    }

    play() {
        this.video.play();
    }

    pause() {
        this.video.pause();
    }

    toggle() {
        this.video.paused ? this.play() : this.pause();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".brand-video").forEach(section => {
        new BrandVideo(section);
    });
});