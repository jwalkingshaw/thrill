// Modern GSAP Animations for Services Section

document.addEventListener('DOMContentLoaded', function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(max-width: 900px)').matches) {
    // Hide SVG lines on mobile (handled by CSS too)
    const svg = document.querySelector('.services-connections');
    if (svg) svg.style.display = 'none';
    return;
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Instantly show cards and lines if reduced motion
    document.querySelectorAll('.service-card').forEach(card => {
      card.style.opacity = 1;
      card.style.transform = 'none';
    });
    document.querySelectorAll('.services-connections line').forEach(line => {
      line.style.strokeDashoffset = 0;
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  const cards = document.querySelectorAll('.service-card');
  const lines = [
    document.getElementById('line-commerce-fulfil'),
    document.getElementById('line-fulfil-media'),
    document.getElementById('line-media-commerce')
  ];

  // 1. Animate cards in a staggered sequence
  gsap.from(cards, {
    opacity: 0,
    y: 60,
    stagger: 0.18,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#services',
      start: 'top 80%',
      once: true
    }
  });

  // 2. Animate SVG lines drawing in sync with cards
  lines.forEach((line, i) => {
    if (!line) return;
    const length = line.getTotalLength();
    gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(line, {
      strokeDashoffset: 0,
      duration: 1,
      delay: 0.3 + i * 0.18,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#services',
        start: 'top 80%',
        once: true
      }
    });
  });

  // 3. Hover/tap interactions for card and line highlight
  const connectionMap = {
    commerce: ['#line-commerce-fulfil', '#line-media-commerce'],
    fulfil: ['#line-commerce-fulfil', '#line-fulfil-media'],
    media: ['#line-fulfil-media', '#line-media-commerce']
  };

  function highlightConnections(service, highlight) {
    const linesToHighlight = connectionMap[service] || [];
    lines.forEach(line => {
      if (!line) return;
      if (linesToHighlight.includes('#' + line.id)) {
        gsap.to(line, {
          stroke: highlight ? '#ffb347' : '#E0E0E0',
          strokeWidth: highlight ? 5 : 3,
          duration: 0.3
        });
      } else {
        gsap.to(line, {
          stroke: '#E0E0E0',
          strokeWidth: 3,
          duration: 0.3
        });
      }
    });
  }

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { scale: 1.06, boxShadow: '0 8px 32px rgba(255,179,71,0.18)', duration: 0.3 });
      highlightConnections(card.dataset.service, true);
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { scale: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', duration: 0.3 });
      highlightConnections(card.dataset.service, false);
    });
    card.addEventListener('touchstart', () => {
      gsap.to(card, { scale: 1.06, boxShadow: '0 8px 32px rgba(255,179,71,0.18)', duration: 0.3 });
      highlightConnections(card.dataset.service, true);
    });
    card.addEventListener('touchend', () => {
      gsap.to(card, { scale: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', duration: 0.3 });
      highlightConnections(card.dataset.service, false);
    });
  });
});

// services-animation.js
gsap.registerPlugin(ScrollTrigger);

// Animate cards in
gsap.from('.service-card', {
  opacity: 0,
  y: 60,
  stagger: 0.2,
  duration: 1,
  ease: "power3.out",
  scrollTrigger: {
    trigger: "#services",
    start: "top 80%",
  }
});

// Animate SVG lines (connections)
['#line-commerce-fulfil', '#line-fulfil-media', '#line-media-commerce'].forEach((line, i) => {
  const length = document.querySelector(line).getTotalLength();
  gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
  gsap.to(line, {
    strokeDashoffset: 0,
    duration: 1,
    delay: 0.4 + i * 0.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: "#services",
      start: "top 80%",
    }
  });
});

// Card hover/tap interaction
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, { scale: 1.06, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", duration: 0.3 });
    highlightConnections(card.dataset.service, true);
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { scale: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", duration: 0.3 });
    highlightConnections(card.dataset.service, false);
  });
  // Touch for mobile
  card.addEventListener('touchstart', () => {
    gsap.to(card, { scale: 1.06, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", duration: 0.3 });
    highlightConnections(card.dataset.service, true);
  });
  card.addEventListener('touchend', () => {
    gsap.to(card, { scale: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", duration: 0.3 });
    highlightConnections(card.dataset.service, false);
  });
});

function highlightConnections(service, highlight) {
  if (service === "commerce") {
    gsap.to("#line-commerce-fulfil, #line-media-commerce", { stroke: highlight ? "#F39C12" : "#E0E0E0", duration: 0.3 });
  } else if (service === "fulfil") {
    gsap.to("#line-commerce-fulfil, #line-fulfil-media", { stroke: highlight ? "#27AE60" : "#E0E0E0", duration: 0.3 });
  } else if (service === "media") {
    gsap.to("#line-fulfil-media, #line-media-commerce", { stroke: highlight ? "#2980D9" : "#E0E0E0", duration: 0.3 });
  }
}