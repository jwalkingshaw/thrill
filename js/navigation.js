document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('.primary-nav');
  const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
  const mobileBreakpoint = 1024;
  let isMobileView = window.innerWidth < mobileBreakpoint;
  
  // Update mobile view state
  const updateMobileView = () => {
    isMobileView = window.innerWidth < mobileBreakpoint;
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    primaryNav.classList.toggle('active', !isExpanded);
    document.body.style.overflow = isExpanded ? '' : 'hidden';
    
    // Close all dropdowns when closing mobile menu
    if (isExpanded) {
      closeAllDropdowns();
    }
  };
  
  // Close all dropdowns
  const closeAllDropdowns = () => {
    document.querySelectorAll('.menu-item-has-children').forEach(item => {
      item.classList.remove('active');
      const btn = item.querySelector('.dropdown-trigger');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  };
  
  // Toggle dropdown menu
  const toggleDropdown = (trigger, forceClose = false) => {
    if (!isMobileView) return; // Only for mobile
    
    const parentItem = trigger.closest('.menu-item-has-children');
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
    
    if (forceClose) {
      closeAllDropdowns();
      return;
    }
    
    // Close other dropdowns if opening a new one
    if (!isExpanded) {
      document.querySelectorAll('.menu-item-has-children').forEach(item => {
        if (item !== parentItem) {
          item.classList.remove('active');
          const btn = item.querySelector('.dropdown-trigger');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });
    }
    
    // Toggle current dropdown
    parentItem.classList.toggle('active', !isExpanded);
    trigger.setAttribute('aria-expanded', !isExpanded);
  };
  
  // Handle click outside
  const handleClickOutside = (event) => {
    // If mobile menu is open and click is outside
    if (isMobileView && primaryNav.classList.contains('active') && 
        !event.target.closest('.primary-nav') && 
        !event.target.closest('.menu-toggle')) {
      toggleMobileMenu();
    } 
    // If desktop and click is outside dropdowns
    else if (!isMobileView && !event.target.closest('.menu-item-has-children')) {
      closeAllDropdowns();
    }
  };
  
  // Handle window resize
  let resizeTimer;
  const handleResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateMobileView();
      
      // Reset mobile menu state when switching to desktop
      if (!isMobileView) {
        menuToggle.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('active');
        document.body.style.overflow = '';
      }
      
      // Close all dropdowns
      closeAllDropdowns();
    }, 250);
  };
  
  // Initialize event listeners
  if (menuToggle && primaryNav) {
    // Mobile menu toggle
    menuToggle.addEventListener('click', toggleMobileMenu);
    
    // Dropdown triggers
    dropdownTriggers.forEach(trigger => {
      // Click handler for mobile
      trigger.addEventListener('click', (e) => {
        if (isMobileView) {
          e.preventDefault();
          e.stopPropagation();
          toggleDropdown(trigger);
        }
      });
      
      // Keyboard navigation
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleDropdown(trigger);
        } else if (e.key === 'Escape') {
          toggleDropdown(trigger, true);
        }
      });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', handleClickOutside);
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
  }
});
