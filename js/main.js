gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);


document.addEventListener("DOMContentLoaded", function() {
    // ScrollTrigger.normalizeScroll(true); // Disabled to restore normal wheel/trackpad scroll on desktop
    const scroller = ".scroll-container"; // The main scroller

    function initHorizontalScroll() {
    console.log("Initializing horizontal scroll");
    const horizontalServicesSection = document.querySelector("#horizontal-services");
    const horizontalWrapper = document.querySelector(".horizontal-scroll-wrapper");
    const horizontalContent = document.querySelector(".horizontal-content");
    const panels = gsap.utils.toArray(".service-panel");
    const progressBar = document.querySelector(".progress-bar");
    const servicesHeader = document.querySelector(".services-header");

    if (!horizontalServicesSection || !horizontalWrapper || !horizontalContent || !panels.length) {
        console.error("Required elements for horizontal scroll not found");
        return;
    }

    // Set initial active state
    panels[0].classList.add('is-active');

    // Calculate the total scrollable width
    const getScrollDistance = () => {
        const wrapperWidth = horizontalWrapper.offsetWidth;
        const contentWidth = horizontalContent.scrollWidth;
        return Math.max(0, contentWidth - wrapperWidth);
    };

    // Create the horizontal scroll animation
    const scrollTween = gsap.to(horizontalContent, {
        x: () => `-${getScrollDistance()}`,
        ease: "none",
        scrollTrigger: {
            trigger: horizontalServicesSection,
            pin: true,
            scroller: scroller,
            scrub: 1,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            pinSpacing: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                // Update progress bar
                if (progressBar) {
                    gsap.to(progressBar, {
                        scaleX: self.progress,
                        transformOrigin: 'left center',
                        ease: 'none',
                        duration: 0.1
                    });
                }

                // Update active panel based on scroll position
                const progress = self.progress * (panels.length - 1);
                const activeIndex = Math.min(Math.floor(progress), panels.length - 1);
                
                panels.forEach((panel, i) => {
                    if (i === activeIndex) {
                        panel.classList.add('is-active');
                    } else {
                        panel.classList.remove('is-active');
                    }
                });
            }
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            scrollTween.scrollTrigger.refresh();
        }, 250);
    });

    // Add touch support for mobile
    if ('ontouchstart' in window) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        horizontalWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        horizontalWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const currentPanel = document.querySelector('.service-panel.is-active');
            let nextPanel;
            
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left
                nextPanel = currentPanel.nextElementSibling;
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right
                nextPanel = currentPanel.previousElementSibling;
            }
            
            if (nextPanel && nextPanel.classList.contains('service-panel')) {
                nextPanel.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'start'
                });
            }
        }
    }
    }

    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;
    
    // Only initialize horizontal scroll on desktop/tablet
    if (!isMobile) {
        initHorizontalScroll();
    } else {
        // Mobile-specific initialization
        initMobileServicePanels();
    }
    
    // Function to handle mobile service panels
    function initMobileServicePanels() {
        const servicePanels = document.querySelectorAll('.service-panel');
        
        // Add animation for mobile panels
        gsap.utils.toArray('.service-panel').forEach((panel, i) => {
            gsap.from(panel, {
                y: 50,
                opacity: 0,
                duration: 0.6,
                delay: i * 0.15,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: panel,
                    start: 'top bottom-=100',
                    toggleActions: 'play none none none',
                    scroller: scroller
                }
            });
        });
    }
    
    // Handle window resize to switch between mobile and desktop
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Reload the page if crossing the mobile breakpoint
            const wasMobile = isMobile;
            const isNowMobile = window.innerWidth <= 768;
            
            if (wasMobile !== isNowMobile) {
                window.location.reload();
            }
        }, 250);
    });

    // NOTE: If you open index.html directly with file://, styles/scripts may not load due to relative paths. Always use a dev server or deploy for correct rendering.

    // --- Section Indicator Dots & Smooth Scroll to Sections ---
    const sections = gsap.utils.toArray(".section");
    const indicatorDots = gsap.utils.toArray(".indicator-dot");
    const scrollContainerElement = document.querySelector(scroller);

    indicatorDots.forEach(dot => {
        dot.addEventListener("click", e => {
            e.preventDefault();
            const targetSectionId = dot.getAttribute("data-section");
            const targetSection = document.getElementById(targetSectionId);

            if (targetSection && scrollContainerElement) {
                gsap.to(scrollContainerElement, {
                    duration: 1,
                    scrollTo: {
                        y: targetSection,
                        offsetY: 0
                    },
                    ease: "power2.inOut"
                });
            }
        });
    });

    // This part CREATES ScrollTriggers for each section to toggle the 'active' class on dots
    sections.forEach(section => {
        const dot = indicatorDots.find(d => d.getAttribute("data-section") === section.id);
        if (dot) {
            ScrollTrigger.create({
                trigger: section, 
                scroller: scroller,
                start: "top center",
                end: "bottom center", 
                toggleClass: { targets: dot, className: "active" },
            });
        }
    });

    // --- Smooth scroll for internal anchor links (e.g., in footer) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1 && href.startsWith('#') && scrollContainerElement) {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    if (anchor.closest('.section-indicator')) return;
                    
                    e.preventDefault();
                    gsap.to(scrollContainerElement, {
                        duration: 1,
                        scrollTo: {
                            y: targetElement,
                            offsetY: 0
                        },
                        ease: "power2.inOut"
                    });
                }
            }
        });
    });
    
});