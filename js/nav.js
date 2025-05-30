// Hamburger navigation logic
const hamburger = document.querySelector('.hamburger');
const navOverlay = document.querySelector('.nav-overlay');

function toggleNav() {
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', !expanded);
  navOverlay.setAttribute('aria-hidden', expanded);
  navOverlay.classList.toggle('open', !expanded);
  document.body.classList.toggle('nav-open', !expanded);
}

if (hamburger && navOverlay) {
  hamburger.addEventListener('click', toggleNav);
  navOverlay.addEventListener('click', function(e) {
    if (e.target === navOverlay) toggleNav(); // close if overlay bg is clicked
  });
}
