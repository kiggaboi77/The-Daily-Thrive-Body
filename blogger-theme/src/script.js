(function () {
  var header = document.getElementById('site-header');
  var isHome = document.body.classList.contains('is-home');
  if (header && isHome) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 60); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Hero photo: use the image from the "Hero photo" Layout gadget, upscaled for full-screen.
  var hero = document.querySelector('.hero');
  var photo = document.querySelector('.hero-photo img');
  if (hero && photo && photo.getAttribute('src')) {
    var src = photo.getAttribute('src').replace(/\/(s|w)\d+(-h\d+)?(-[a-z-]+)?\//, '/s2400/').replace(/=(s|w)\d+(-h\d+)?(-[a-z-]+)?$/, '=s2400');
    hero.style.setProperty('--hero-photo', 'url("' + src.replace(/"/g, '%22') + '")');
    hero.classList.add('has-photo');
  }

  // Start here: add a short description under each topic (label). Keys are label names, lower-case.
  var TOPIC_NOTES = {
    'credit cards': 'Rewards, rotating bonus categories and getting the most from your cards.',
    'fall guides': 'Seasonal how-tos for autumn in the U.S.',
    'halloween': 'Costumes, candy, trick-or-treating and how Americans celebrate.',
    'holidays & culture': 'American holidays and traditions, and the stories behind them.',
    'money & insurance': 'Everyday money matters: saving, insurance and smart spending.',
    'travel & outdoors': 'Trips, parks and outdoor ideas across the United States.'
  };
  document.querySelectorAll('.focus-topics .Label li a').forEach(function (a) {
    var name = '';
    a.childNodes.forEach(function (n) { if (n.nodeType === 3) name += n.textContent; });
    name = name.trim();
    if (!name) return;
    var text = document.createElement('span');
    text.className = 'topic-text';
    var title = document.createElement('span');
    title.className = 'topic-name';
    title.textContent = name;
    text.appendChild(title);
    var note = TOPIC_NOTES[name.toLowerCase()];
    if (note) {
      var p = document.createElement('span');
      p.className = 'topic-note';
      p.textContent = note;
      text.appendChild(p);
    }
    Array.prototype.slice.call(a.childNodes).forEach(function (n) { if (n.nodeType === 3) a.removeChild(n); });
    a.insertBefore(text, a.firstChild);
  });

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

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
