// Dropdown/accordion logic for THRILL header navigation
// Desktop: open dropdown on hover/focus; Mobile: toggle accordion on tap

document.addEventListener('DOMContentLoaded', function() {
  const dropdownItems = document.querySelectorAll('.thrill-nav__item.has-dropdown');
  const dropdownLinks = document.querySelectorAll('.thrill-nav__item.has-dropdown > .thrill-nav__link');
  const isMobile = window.innerWidth < 800;
  let hoverTimeout;

  // Function to close all dropdowns except the one passed as parameter
  const closeOtherDropdowns = (currentItem) => {
    dropdownItems.forEach(item => {
      if (item !== currentItem) {
        item.classList.remove('active');
        const link = item.querySelector('.thrill-nav__link');
        if (link) link.setAttribute('aria-expanded', 'false');
      }
    });
  };

  // Handle click events for mobile dropdowns
  const handleClick = (e) => {
    if (isMobile) {
      e.preventDefault();
      const parent = e.currentTarget.parentElement;
      const isActive = parent.classList.contains('active');
      
      // Close all dropdowns first
      closeOtherDropdowns(parent);
      
      // Toggle current dropdown
      parent.classList.toggle('active', !isActive);
      e.currentTarget.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
    }
  };

  // Handle hover events for desktop
  const handleMouseEnter = (e) => {
    if (!isMobile) {
      clearTimeout(hoverTimeout);
      const parent = e.currentTarget.closest('.thrill-nav__item.has-dropdown');
      if (parent) {
        closeOtherDropdowns(parent);
        parent.classList.add('active');
        const link = parent.querySelector('.thrill-nav__link');
        if (link) link.setAttribute('aria-expanded', 'true');
      }
    }
  };

  // Handle mouse leave for desktop
  const handleMouseLeave = (e) => {
    if (!isMobile) {
      const parent = e.currentTarget;
      hoverTimeout = setTimeout(() => {
        if (parent.classList.contains('has-dropdown')) {
          parent.classList.remove('active');
          const link = parent.querySelector('.thrill-nav__link');
          if (link) link.setAttribute('aria-expanded', 'false');
        }
      }, 300);
    }
  };

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (isMobile && !e.target.closest('.thrill-nav__item.has-dropdown')) {
      closeOtherDropdowns();
    }
  });

  // Close dropdown when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeOtherDropdowns();
    }
  });

  // Initialize dropdowns
  dropdownLinks.forEach(link => {
    link.setAttribute('aria-haspopup', 'true');
    link.setAttribute('aria-expanded', 'false');
    
    // Click handler for mobile
    link.addEventListener('click', handleClick);
    
    // Hover handlers for desktop
    const parentItem = link.closest('.thrill-nav__item.has-dropdown');
    if (parentItem) {
      parentItem.addEventListener('mouseenter', handleMouseEnter);
      parentItem.addEventListener('mouseleave', handleMouseLeave);
      
      // Prevent hover timeout when mouse is over dropdown
      const dropdown = parentItem.querySelector('.thrill-dropdown');
      if (dropdown) {
        dropdown.addEventListener('mouseenter', () => clearTimeout(hoverTimeout));
        dropdown.addEventListener('mouseleave', () => handleMouseLeave({ currentTarget: parentItem }));
      }
    }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 800) {
      // Reset all dropdowns when switching to desktop
      dropdownItems.forEach(item => item.classList.remove('active'));
      dropdownLinks.forEach(link => link.setAttribute('aria-expanded', 'false'));
    }
  });
});
