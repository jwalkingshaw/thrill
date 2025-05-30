// GSAP initialization and smooth scrolling
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

document.addEventListener("DOMContentLoaded", function() {
    // Initialize ScrollTrigger for section highlighting
    gsap.utils.toArray(".section").forEach((section) => {
        ScrollTrigger.create({
            trigger: section,
            start: "top 50%",
            end: "bottom 50%",
            onEnter: () => {
                // Update active navigation
                document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));
                const navLink = document.querySelector(`.nav-link[href*="${section.id}"]`);
                if (navLink) navLink.classList.add("active");
            },
            onEnterBack: () => {
                // Update active navigation when scrolling back
                document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));
                const navLink = document.querySelector(`.nav-link[href*="${section.id}"]`);
                if (navLink) navLink.classList.add("active");
            }
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: targetElement,
                        offsetY: 80,
                        autoKill: true
                    },
                    ease: "power2.inOut"
                });
            }
        });
    });
});
