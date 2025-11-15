// -= TIMING CONTROLS
const overlapTime = 1400;
    // REAL
// const holdTime = 9800;
// const shortHoldTime = 4900;
    // TEST
const holdTime = 2100;
const shortHoldTime = 1400;

// -= Set up the slides
const container = document.getElementById('container');
const slidesFromHTML = Array.from(container.querySelectorAll('.slide'));
// window.generatedSlides.forEach(slide => container.appendChild(slide));
// let slides = [...slidesFromHTML, ...window.generatedSlides];

// slides[0].style.opacity = '1';
// slides[0].style.visibility = 'visible';

let slides = Array.from(container.querySelectorAll('.slide'));
if (slides[0]) {
  slides[0].style.opacity = '1';
  slides[0].style.visibility = 'visible';
}


// -= START SLIDESHOW
setTimeout(() => showSlide(1), holdTime);

// -= Rebuild slides based on latest data
window.mountSlides = function mountSlides() {
    // Clear container and re-append original HTML slides, then the latest generated ones
    container.innerHTML = '';
    slidesFromHTML.forEach(s => container.appendChild(s));
    (window.generatedSlides || []).forEach(s => container.appendChild(s));
    // Refresh our slides array reference so showSlide() indexes the new set
    slides = [...slidesFromHTML, ...window.generatedSlides];
}
window.addEventListener('overlayDataUpdated', window.mountSlides);
window.mountSlides();

// -= Slideshow function
let current = 0;
function showSlide(nextIndex) {
    if (!slides.length) return;
    const currentSlide = slides[current];
    const nextSlide = slides[nextIndex];

    const currentEffect = currentSlide.dataset.effect;
    const nextEffect = nextSlide.dataset.effect;

    // Prepare next slide
    nextSlide.style.transition = 'none';
    nextSlide.style.opacity = '0';
    nextSlide.style.transform = 'none';
    nextSlide.style.visibility = 'visible';

    // Starting transform for push-style slides
    if (nextEffect === 'push' || nextEffect === 'pushfade') {
        nextSlide.style.transform = 'translateY(100%)';
    }

    nextSlide.offsetHeight; // force reflow

    // Determine overlap behavior
    const overlapIn = ['push', 'pushfade'].includes(nextEffect);
    const overlapOut = ['push', 'fadepush'].includes(currentEffect);

    if (overlapOut) {
        // Animate current slide out with overlap
        currentSlide.style.transition = `opacity ${overlapTime}ms ease, transform ${overlapTime}ms ease, visibility 0s linear ${overlapTime}ms`;
        if (currentEffect === 'push') currentSlide.style.transform = 'translateY(-100%)';
        if (currentEffect === 'fadepush') {
            currentSlide.style.opacity = '0';
            currentSlide.style.transform = 'translateY(-100%)';
        }
        if (currentEffect === 'fade') currentSlide.style.opacity = '0'; // fade out

        setTimeout(() => currentSlide.style.visibility = 'hidden', overlapTime);
    } else {
        // Non-overlapping fade: hide current slide after fade
        currentSlide.style.transition = `opacity ${overlapTime}ms ease, visibility 0s linear ${overlapTime}ms`;
        currentSlide.style.opacity = '0';
        setTimeout(() => currentSlide.style.visibility = 'hidden', overlapTime);
    }

    // Animate next slide in
    const delay = overlapOut ? 0 : overlapTime; // if no overlap, wait for fade
    setTimeout(() => {
        nextSlide.style.transition = `opacity ${overlapTime}ms ease, transform ${overlapTime}ms ease`;
        nextSlide.style.opacity = '1';
        nextSlide.style.transform = 'translateY(0)';
    }, delay);

    // Schedule next slide
    const effectiveHold = nextSlide.classList.contains("short") ? shortHoldTime : holdTime;
    const totalDelay = overlapOut ? effectiveHold : effectiveHold + overlapTime;
    setTimeout(() => {
        current = nextIndex;
        showSlide((current + 1) % slides.length);
    }, totalDelay);
}
