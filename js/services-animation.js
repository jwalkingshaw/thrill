// Services Section Animation - GSAP ScrollTrigger stacked pinning

document.addEventListener('DOMContentLoaded', function () {
  if (window.gsap && window.ScrollTrigger) {
    const cards = document.querySelectorAll('.service-card');
    let pinSpacing = 0;

    cards.forEach((card, i) => {
      let h3 = card.querySelector('h3');
      let pinTarget = h3 || card;
      let start = i === 0 ? 'top top' : `top+=${pinSpacing} top`;
      gsap.set(card, {zIndex: cards.length - i});
      ScrollTrigger.create({
        trigger: card,
        start: start,
        pin: true,
        pinSpacing: false,
        onEnter: () => {
          card.classList.add('pinned');
        },
        onLeaveBack: () => {
          card.classList.remove('pinned');
        }
      });
      pinSpacing += card.offsetHeight;
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  // Intersection Observer for scroll animations
  const animateOnScroll = () => {
    const services = document.querySelectorAll('.service-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add staggered delay based on index
          const index = Array.from(services).indexOf(entry.target);
          entry.target.style.transitionDelay = `${index * 0.1}s`;
          entry.target.classList.add('visible');
          
          // Unobserve after animation
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    
    services.forEach(service => {
      observer.observe(service);
    });
  };
  
  // Initialize animations
  if ('IntersectionObserver' in window) {
    animateOnScroll();
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    document.querySelectorAll('.service-card').forEach(card => {
      card.classList.add('visible');
    });
  }
  
  // Add hover effect for touch devices
  let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints;
  if (isTouchDevice) {
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('click', function() {
        this.classList.toggle('hover-effect');
        
        // Remove hover effect from other cards
        document.querySelectorAll('.service-card').forEach(otherCard => {
          if (otherCard !== this) {
            otherCard.classList.remove('hover-effect');
          }
        });
      });
    });
  }
});
