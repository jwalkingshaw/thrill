// Dropdown/accordion logic for THRILL header navigation
// Desktop: open dropdown on hover/focus; Mobile: toggle accordion on tap

document.querySelectorAll('.thrill-nav__item.has-dropdown > .thrill-nav__link').forEach(btn => {
  btn.addEventListener('click', function(e) {
    if (window.innerWidth < 800) {
      e.preventDefault();
      const parent = btn.parentElement;
      parent.classList.toggle('active');
      // Close others
      document.querySelectorAll('.thrill-nav__item.has-dropdown').forEach(item => {
        if (item !== parent) item.classList.remove('active');
      });
    }
  });
  // Optional: close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!btn.parentElement.contains(e.target) && window.innerWidth < 800) {
      btn.parentElement.classList.remove('active');
    }
  });
});
