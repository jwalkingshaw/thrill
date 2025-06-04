document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const hamburger = document.querySelector('.hamburger');
    const navOverlay = document.querySelector('.nav-overlay');
    const body = document.body;
    const mobileBreakpoint = 1024; // Match this with your CSS breakpoint
    const dropdownItems = document.querySelectorAll('.thrill-nav__item.has-dropdown');
    let isMobile = window.innerWidth < mobileBreakpoint;

    // Toggle mobile menu
    function toggleMobileMenu() {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        navOverlay.setAttribute('aria-hidden', isExpanded);
        navOverlay.classList.toggle('open', !isExpanded);
        body.classList.toggle('nav-open', !isExpanded);
    }

    // Close mobile menu when clicking outside
    function handleClickOutside(event) {
        if (navOverlay.classList.contains('open') && 
            !event.target.closest('.thrill-nav') && 
            !event.target.closest('.hamburger')) {
            toggleMobileMenu();
        }
    }

    // Toggle dropdown on mobile
    function toggleDropdown(button, isKeyboard = false) {
        if (isMobile || isKeyboard) {
            const dropdownItem = button.closest('.thrill-nav__item');
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            
            // Close other dropdowns when opening a new one on mobile
            if (!isExpanded) {
                closeAllDropdowns();
            }

            // Toggle current dropdown
            dropdownItem.classList.toggle('active', !isExpanded);
            button.setAttribute('aria-expanded', !isExpanded);
        }
    }

    // Close all dropdowns
    function closeAllDropdowns() {
        if (!isMobile) return;
        
        document.querySelectorAll('.thrill-nav__item').forEach(item => {
            item.classList.remove('active');
            const btn = item.querySelector('.thrill-nav__link[aria-haspopup="true"]');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        });
    }

    // Initialize event listeners
    if (hamburger && navOverlay) {
        // Mobile menu toggle
        hamburger.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking outside
        document.addEventListener('click', handleClickOutside);
        
        // Handle dropdown toggles
        document.querySelectorAll('.thrill-nav__link[aria-haspopup="true"]').forEach(button => {
            // Click handler for mobile
            button.addEventListener('click', function(e) {
                if (isMobile) {
                    e.preventDefault();
                    toggleDropdown(this);
                }
            });
            
            // Keyboard navigation
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleDropdown(this, true);
                } else if (e.key === 'Escape') {
                    closeAllDropdowns();
                }
            });
        });
        
        // Handle hover for desktop
        dropdownItems.forEach(item => {
            const button = item.querySelector('.thrill-nav__link[aria-haspopup="true"]');
            
            if (!button) return;
            
            // Mouse enter/leave for desktop
            item.addEventListener('mouseenter', function() {
                if (!isMobile) {
                    this.classList.add('active');
                    button.setAttribute('aria-expanded', 'true');
                }
            });
            
            item.addEventListener('mouseleave', function() {
                if (!isMobile) {
                    this.classList.remove('active');
                    button.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Focus management
            item.addEventListener('focusin', function() {
                if (!isMobile) {
                    this.classList.add('active');
                    button.setAttribute('aria-expanded', 'true');
                }
            });
            
            item.addEventListener('focusout', function(e) {
                if (!isMobile && !this.contains(e.relatedTarget)) {
                    this.classList.remove('active');
                    button.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            const wasMobile = isMobile;
            isMobile = window.innerWidth < mobileBreakpoint;
            
            if (!isMobile && wasMobile) {
                // Reset mobile states when resizing to desktop
                if (hamburger) {
                    hamburger.setAttribute('aria-expanded', 'false');
                    navOverlay.classList.remove('open');
                    body.classList.remove('nav-open');
                    closeAllDropdowns();
                }
            } else if (isMobile && !wasMobile) {
                // Close all dropdowns when resizing to mobile
                closeAllDropdowns();
            }
        }, 250);
    });
});
