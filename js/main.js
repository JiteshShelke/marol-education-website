


AOS.init({
    duration: 1000, // animation duration
    easing: 'ease-in-out', // smooth effect
    once: true, // animate once when scrolled
});

(function () {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = document.querySelectorAll('.reveal');

    if (reduceMotion) {
        els.forEach(el => el.classList.add('in-view'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');    // add when entering
            } else {
                entry.target.classList.remove('in-view'); // remove when leaving
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.15
    });

    els.forEach(el => observer.observe(el));
})();

(function () {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = document.querySelectorAll('.reveal');
    if (reduceMotion) {
        els.forEach(el => el.classList.add('in-view'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');    // entering viewport
            } else {
                entry.target.classList.remove('in-view'); // leaving viewport
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.15
    });

    els.forEach(el => observer.observe(el));
})();
