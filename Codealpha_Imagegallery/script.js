document.addEventListener("DOMContentLoaded", function () {

    // Gallery elements
    const galleryItems = Array.from(
        document.querySelectorAll(".gallery-item")
    );

    const filterButtons = document.querySelectorAll(".filter-btn");

    // Lightbox elements
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const closeBtn = document.getElementById("closeBtn");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const imageCounter = document.getElementById("imageCounter");

    let visibleItems = [...galleryItems];
    let currentIndex = 0;

    // FILTER BUTTONS

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const filter = button.dataset.filter;

            filterButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            galleryItems.forEach(function (item) {

                const shouldShow =
                    filter === "all" ||
                    item.classList.contains(filter);

                item.classList.toggle("hidden", !shouldShow);

            });

            visibleItems = galleryItems.filter(function (item) {
                return !item.classList.contains("hidden");
            });

            // Close lightbox when changing category
            closeLightbox();

        });

    });

    // OPEN LIGHTBOX

    galleryItems.forEach(function (item) {

        const image = item.querySelector("img");

        image.addEventListener("click", function () {

            visibleItems = galleryItems.filter(function (galleryItem) {
                return !galleryItem.classList.contains("hidden");
            });

            currentIndex = visibleItems.indexOf(item);

            showImage();

            lightbox.classList.add("active");
            lightbox.setAttribute("aria-hidden", "false");

        });

    });

    // SHOW IMAGE

    function showImage() {

        if (visibleItems.length === 0) {
            return;
        }

        currentIndex =
            (currentIndex + visibleItems.length) % visibleItems.length;

        const image = visibleItems[currentIndex].querySelector("img");

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;

        imageCounter.textContent =
            (currentIndex + 1) + " / " + visibleItems.length;

    }

    // NEXT IMAGE

    nextBtn.addEventListener("click", function () {
        currentIndex++;
        showImage();
    });

    // PREVIOUS IMAGE

    prevBtn.addEventListener("click", function () {
        currentIndex--;
        showImage();
    });

    // CLOSE LIGHTBOX

    function closeLightbox() {

        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");

        lightboxImage.src = "";

    }

    closeBtn.addEventListener("click", closeLightbox);

    // CLOSE BY CLICKING BACKGROUND

    lightbox.addEventListener("click", function (event) {

        if (event.target === lightbox) {
            closeLightbox();
        }

    });

    // KEYBOARD CONTROLS

    document.addEventListener("keydown", function (event) {

        if (!lightbox.classList.contains("active")) {
            return;
        }

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowRight") {
            currentIndex++;
            showImage();
        }

        if (event.key === "ArrowLeft") {
            currentIndex--;
            showImage();
        }

    });

});