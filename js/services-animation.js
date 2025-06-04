// Services Section Animation - GSAP ScrollTrigger stacked pinning with header offset and stacking below H3

document.addEventListener('DOMContentLoaded', function () {
  if (window.gsap && window.ScrollTrigger) {
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 0;
    const cards = document.querySelectorAll('.service-card');

    let cumulativeOffset = 0;
    cards.forEach((card, i) => {
      let h3 = card.querySelector('h3');
      let prevCard = i > 0 ? cards[i - 1] : null;
      let prevH3 = prevCard ? prevCard.querySelector('h3') : null;
      let startOffset = headerHeight + cumulativeOffset;
      let start = i === 0 ? `top+=${headerHeight} top` : `top+=${startOffset} top`;

      // Pin each card below the previous card's H3
      ScrollTrigger.create({
        trigger: card,
        start: start,
        pin: true,
        pinSpacing: false,
        pinnedContainer: card.parentElement,
        onEnter: () => card.classList.add('pinned'),
        onLeaveBack: () => card.classList.remove('pinned')
      });

      // For stacking, add the height of the previous H3 (if exists) or card
      if (h3) {
        cumulativeOffset += h3.offsetHeight;
      } else {
        cumulativeOffset += card.offsetHeight;
      }
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
