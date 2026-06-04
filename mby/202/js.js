function swiperInit() {
    var swiper = new Swiper(".mySwiper", {
        slidesPerView: 'auto', // 5
        spaceBetween: 10,
        pagination: {
            el: ".swiper-pagination",
            dynamicBullets: true,
        },
        breakpoints: {
            "@0.00": {
                slidesPerView: 1,
                spaceBetween: 10,
            },
            "@0.75": {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            "@1.00": {
                slidesPerView: 3,
                spaceBetween: 40,
            },
            "@1.50": {
                slidesPerView: 4,
                spaceBetween: 50,
            },
        },
    });

    window.addEventListener('resize', (event) => {
        const width = window.innerWidth;
        console.log(`resize: width = ${width}`);
    });
}
document.addEventListener("DOMContentLoaded", swiperInit);