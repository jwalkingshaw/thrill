document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('.primary-nav');
  const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
  const mobileBreakpoint = 1024;
  
  // Check if mobile view
  const isMobile = () => window.innerWidth < mobileBreakpoint;
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    primaryNav.classList.toggle('active', !isExpanded);
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  };
  
  // Toggle dropdown menu
  const toggleDropdown = (trigger, forceClose = false) => {
    if (!isMobile()) return; // Only for mobile
    
    const parentItem = trigger.closest('.menu-item-has-children');
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
    
    if (forceClose) {
      // Close all dropdowns
      document.querySelectorAll('.menu-item-has-children').forEach(item => {
        item.classList.remove('active');
        const btn = item.querySelector('.dropdown-trigger');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
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
  
  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (isMobile() && primaryNav.classList.contains('active') && 
        !event.target.closest('.primary-nav') && 
        !event.target.closest('.menu-toggle')) {
      toggleMobileMenu();
    } else if (!isMobile() && !event.target.closest('.menu-item-has-children')) {
      // Close all dropdowns on desktop when clicking outside
      document.querySelectorAll('.menu-item-has-children').forEach(item => {
        const btn = item.querySelector('.dropdown-trigger');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }
  };
  
  // Handle window resize
  const handleResize = () => {
    if (window.innerWidth >= mobileBreakpoint) {
      // Reset mobile menu state
      menuToggle.setAttribute('aria-expanded', 'false');
      primaryNav.classList.remove('active');
      document.body.style.overflow = '';
      
      // Close all dropdowns
      document.querySelectorAll('.menu-item-has-children').forEach(item => {
        item.classList.remove('active');
        const btn = item.querySelector('.dropdown-trigger');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }
  };
  
  // Initialize event listeners
  if (menuToggle && primaryNav) {
    // Mobile menu toggle
    menuToggle.addEventListener('click', toggleMobileMenu);
    
    // Dropdown triggers
    dropdownTriggers.forEach(trigger => {
      // Click handler for mobile
      trigger.addEventListener('click', (e) => {
        if (isMobile()) {
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
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 250);
    });
  }
});
