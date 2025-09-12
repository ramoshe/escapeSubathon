// -= Timing controls
// const overlapTime = 1400;
// const holdTime = 10000;
const overlapTime = 700; // test
const holdTime = 1400; // test

// -= Set up the slides
const container = document.getElementById('container');
const hardSlides = Array.from(container.querySelectorAll('.slide'));
const slides = [...hardSlides, ...window.generatedSlides];

window.generatedSlides.forEach(slide => container.appendChild(slide));

slides[0].style.opacity = '1';
slides[0].style.visibility = 'visible';

// -= START SLIDESHOW
setTimeout(() => showSlide(1), holdTime);

// -= Slideshow function
let current = 0;
function showSlide(nextIndex) {
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
    const overlapOut = ['push', 'fadepush'].includes(currentEffect); // <-- pushfade removed

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
    const delay = overlapOut ? 0 : overlapTime; // if no overlap, wait for current fade
    setTimeout(() => {
        nextSlide.style.transition = `opacity ${overlapTime}ms ease, transform ${overlapTime}ms ease`;
        nextSlide.style.opacity = '1';
        nextSlide.style.transform = 'translateY(0)';
    }, delay);

    // Schedule next slide
    const totalDelay = overlapOut ? holdTime : holdTime + overlapTime;
    setTimeout(() => {
        current = nextIndex;
        showSlide((current + 1) % slides.length);
    }, totalDelay);
}