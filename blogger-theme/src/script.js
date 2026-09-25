(function () {
  var header = document.getElementById('site-header');
  var isHome = document.body.classList.contains('is-home');
  if (header && isHome) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 60); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName !== 'A') return;
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    });
  }

  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.1 });
    items.forEach(function (el, n) { el.style.transitionDelay = (n % 3) * 90 + 'ms'; io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Trading cards: energy type from the first label, card numbers, holo tilt.
  var TYPES = [
    ['t-grass', /hous|home|rent|mov|apartment|garden/i],
    ['t-lightning', /money|credit|bank|tax|finance|saving|budget|cost/i],
    ['t-water', /health|insur|doctor|medical|hospital|dental/i],
    ['t-fire', /car|driv|dmv|road|travel|trip/i],
    ['t-steel', /work|job|career|visa|paycheck|business|immigra/i],
    ['t-psychic', /life|culture|holiday|food|shop|tip|school|educat/i]
  ];
  var CYCLE = ['t-fire', 't-water', 't-grass', 't-lightning', 't-psychic', 't-steel', 't-earth'];
  var cards = document.querySelectorAll('.post-grid .tcg');
  cards.forEach(function (card, n) {
    var label = card.querySelector('.tcg-type');
    var text = label ? label.textContent : '';
    var type = CYCLE[n % CYCLE.length];
    for (var i = 0; i < TYPES.length; i++) { if (TYPES[i][1].test(text)) { type = TYPES[i][0]; break; } }
    card.classList.add(type);
    var no = card.querySelector('.tcg-no');
    if (no) no.textContent = 'No. ' + ('00' + (n + 1)).slice(-3);
  });

  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!still) {
    document.querySelectorAll('.tcg').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.classList.add('tilting');
        card.style.setProperty('--ry', ((x - 0.5) * 16).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - y) * 16).toFixed(2) + 'deg');
        card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', function () {
        card.classList.remove('tilting');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
