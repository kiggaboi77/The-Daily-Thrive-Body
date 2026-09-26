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

  // ----- Connected topics -----
  // Each main topic groups several Blogger labels. Posts are read from the blog's own feed.
  var PILLARS = [
    { name: 'Holidays & Seasons', url: '/search/label/Holidays%20%26%20Culture', labels: ['Holidays & Culture', 'Halloween', 'Fall Guides', 'Travel & Outdoors'] },
    { name: 'Money & Daily Life', url: '/search/label/Money%20%26%20Insurance', labels: ['Money & Insurance', 'Credit Cards'] }
  ];

  function feedFor(label) {
    if (window.__feedMock) return Promise.resolve(window.__feedMock[label || '*'] || []);
    var path = label ? '/feeds/posts/summary/-/' + encodeURIComponent(label) : '/feeds/posts/summary';
    return fetch(path + '?alt=json&max-results=25')
      .then(function (r) { return r.ok ? r.json() : { feed: {} }; })
      .then(function (d) {
        return (d.feed.entry || []).map(function (e) {
          var link = (e.link || []).filter(function (l) { return l.rel === 'alternate'; })[0];
          var thumb = e.media$thumbnail ? e.media$thumbnail.url.replace(/\/s\d+(-c)?\//, '/w400-h267-c/').replace(/=s\d+(-c)?$/, '=w400-h267-c') : '';
          return { title: e.title.$t, url: link ? link.href : '#', date: e.published.$t, thumb: thumb };
        });
      })
      .catch(function () { return []; });
  }
  function postsFor(labels) {
    return Promise.all(labels.map(feedFor)).then(function (lists) {
      var seen = {}, all = [];
      lists.forEach(function (list) { list.forEach(function (p) { if (!seen[p.url]) { seen[p.url] = 1; all.push(p); } }); });
      return all.sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    });
  }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; }

  // Home: list the newest posts of each topic as stops on a road.
  document.querySelectorAll('.pillar[data-labels]').forEach(function (box) {
    var list = box.querySelector('.pillar-posts');
    postsFor(box.getAttribute('data-labels').split('|')).then(function (posts) {
      posts.slice(0, 4).forEach(function (p) {
        var li = el('li'), a = el('a', '', p.title);
        a.href = p.url; li.appendChild(a); list.appendChild(li);
      });
    });
  });

  // Post page: "Keep reading" — other posts in the same topic.
  var next = document.getElementById('journey-next');
  if (next) {
    var tags = Array.prototype.map.call(document.querySelectorAll('.post-tags a'), function (a) { return a.textContent.replace(/^#/, '').trim(); });
    var pillar = PILLARS.filter(function (pl) { return pl.labels.some(function (l) { return tags.indexOf(l) !== -1; }); })[0];
    // A post without a topic label still gets "Keep reading" — from the newest posts on the blog.
    if (!pillar) pillar = { name: 'the blog', url: '/search', labels: [null] };
    if (pillar) {
      var here = location.pathname;
      postsFor(pillar.labels).then(function (posts) {
        var others = posts.filter(function (p) { return p.url.indexOf(here) === -1; }).slice(0, 3);
        if (!others.length) return;
        next.querySelector('.journey-pillar').textContent = pillar.name;
        next.querySelector('.journey-all').href = pillar.url;
        var wrap = next.querySelector('.journey-list');
        others.forEach(function (p, i) {
          var a = el('a', 'journey-item'); a.href = p.url;
          var th = el('span', 'journey-thumb');
          if (p.thumb) { var img = el('img'); img.src = p.thumb; img.alt = ''; img.loading = 'lazy'; th.appendChild(img); }
          var tx = el('span');
          tx.appendChild(el('span', 'journey-kicker', i === 0 ? 'Next up' : (pillar.labels[0] ? pillar.name : 'Latest')));
          tx.appendChild(el('span', 'journey-name', p.title));
          a.appendChild(th); a.appendChild(tx); wrap.appendChild(a);
        });
        next.hidden = false;
      });
    }
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

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
