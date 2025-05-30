document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navOverlay = document.querySelector('.nav-overlay');
    const body = document.body;
    const mobileBreakpoint = 1024; // Match this with your CSS breakpoint

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
    function toggleDropdown(button) {
        if (window.innerWidth < mobileBreakpoint) {
            const dropdownItem = button.closest('.thrill-nav__item');
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            
            // Close all other dropdowns
            document.querySelectorAll('.thrill-nav__item').forEach(item => {
                if (item !== dropdownItem) {
                    item.classList.remove('active');
                    const btn = item.querySelector('.thrill-nav__link[aria-haspopup="true"]');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current dropdown
            dropdownItem.classList.toggle('active');
            button.setAttribute('aria-expanded', !isExpanded);
        }
    }

    // Initialize event listeners
    if (hamburger && navOverlay) {
        // Mobile menu toggle
        hamburger.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking outside
        document.addEventListener('click', handleClickOutside);
        
        // Handle dropdown toggles
        document.querySelectorAll('.thrill-nav__link[aria-haspopup="true"]').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                toggleDropdown(this);
            });
            
            // Add keyboard navigation
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleDropdown(this);
                }
            });
        });
    }
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Close all dropdowns when resizing to desktop
            if (window.innerWidth >= mobileBreakpoint) {
                document.querySelectorAll('.thrill-nav__item').forEach(item => {
                    item.classList.remove('active');
                    const btn = item.querySelector('.thrill-nav__link[aria-haspopup="true"]');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                });
            }
        }, 250);
    });
});
