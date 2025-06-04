// Initialize fullPage.js for the services section with smooth transitions and pinning

document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector('#fullpage')) {
    new fullpage('#fullpage', {
      autoScrolling: true,
      scrollHorizontally: false,
      fitToSection: true,
      anchors: ['commerce', 'fulfil', 'media'],
      navigation: true,
      navigationPosition: 'right',
      sectionSelector: '.section',
      afterLoad: function(origin, destination, direction) {
        // Animate the active service card in
        var cards = document.querySelectorAll('.service-card');
        cards.forEach(function(card, idx) {
          if (idx === destination.index) {
            card.classList.add('active');
          } else {
            card.classList.remove('active');
          }
        });
        // Optionally, scroll H3 into view if needed
        var h3 = destination.item.querySelector('h3');
        if (h3) {
          h3.classList.add('pinned');
        }
        // Remove pin from previous
        if (origin && origin.item && origin.item.querySelector('h3')) {
          origin.item.querySelector('h3').classList.remove('pinned');
        }
      },
      onLeave: function(origin, destination, direction) {
        // Fade out the leaving card
        var cards = document.querySelectorAll('.service-card');
        if (origin && origin.index !== undefined) {
          cards[origin.index].classList.remove('active');
        }
        // Allow normal scroll after last service
        if (destination.isLast) {
          fullpage_api.setAutoScrolling(false);
        } else {
          fullpage_api.setAutoScrolling(true);
        }
      }
    });
    // Initial activation for first card
    var firstCard = document.querySelector('.service-card');
    if (firstCard) firstCard.classList.add('active');
  }
});
