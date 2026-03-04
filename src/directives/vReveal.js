export const vReveal = {
    mounted(el) {
        el.classList.add('reveal'); // Ensure base class is present

        // Observer options
        const revealOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    obs.unobserve(entry.target);
                }
            });
        }, revealOptions);

        observer.observe(el);

        // Initial check for elements already in viewport
        setTimeout(() => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 50) {
                el.classList.add('active');
            }
        }, 100);
    }
}
