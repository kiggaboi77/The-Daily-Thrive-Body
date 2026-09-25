document.documentElement.classList.add('js');

// Header: solid background once the hero is scrolled past
const header = document.getElementById('site-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 60);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile nav
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
links.addEventListener('click', (e) => {
  if (e.target.tagName !== 'A') return;
  links.classList.remove('open');
  toggle.setAttribute('aria-expanded', false);
});

// Articles — add each new WordPress post here. Set `url` once it's published.
const posts = [
  {
    tag: 'Etiquette',
    title: 'Why Do Koreans Take Off Their Shoes Indoors?',
    excerpt: 'Floor heating, floor living and the meaning of the entryway — the real reasons behind the shoes-off rule.',
    url: 'https://kiggaboi77.com/',
  },
  { tag: 'Etiquette', title: 'Drinking Etiquette in Korea', excerpt: 'Two hands, turning away from elders, and who pours for whom.' },
  { tag: 'Food', title: 'Why Koreans Eat Seaweed Soup on Birthdays', excerpt: 'The story behind the birthday bowl of miyeokguk.' },
  { tag: 'Holidays', title: 'Chuseok: Korea’s Harvest Holiday', excerpt: 'Family trips, ancestral rites and half-moon rice cakes.' },
  { tag: 'Language', title: 'Oppa, Unni, Hyung: Family Words for Friends', excerpt: 'Why Koreans call friends “older brother” and “older sister”.' },
  { tag: 'Food', title: 'The Unwritten Rules of the Korean Table', excerpt: 'Spoons, chopsticks, shared side dishes and waiting for the eldest.' },
];

const routeEl = document.getElementById('route');
function renderRoute(filter) {
  routeEl.innerHTML = '';
  posts.forEach((p, i) => {
    if (filter !== 'all' && p.tag !== filter) return;
    const li = document.createElement('li');
    li.className = 'stop ' + (p.url ? 'live' : 'soon');
    const card = document.createElement(p.url ? 'a' : 'div');
    card.className = 'stop-card';
    if (p.url) card.href = p.url;
    card.innerHTML = '<span class="stop-tag"></span><h3></h3><p></p><span class="stop-status"></span>';
    card.querySelector('.stop-tag').textContent = p.tag;
    card.querySelector('h3').textContent = p.title;
    card.querySelector('p').textContent = p.excerpt;
    card.querySelector('.stop-status').textContent = p.url ? 'Read →' : 'Coming soon';
    const marker = document.createElement('span');
    marker.className = 'stop-marker';
    marker.textContent = String(i + 1).padStart(2, '0');
    li.append(marker, card);
    routeEl.appendChild(li);
  });
}
function setFilter(filter) {
  document.querySelectorAll('.chip').forEach((c) => c.classList.toggle('active', c.dataset.filter === filter));
  renderRoute(filter);
}
document.getElementById('filters').addEventListener('click', (e) => {
  if (e.target.dataset.filter) setFilter(e.target.dataset.filter);
});
document.querySelectorAll('.chapter').forEach((ch) => ch.addEventListener('click', () => {
  setFilter(ch.dataset.filter);
  document.getElementById('journey').scrollIntoView({ behavior: 'smooth' });
}));
renderRoute('all');

// Word of the day — Quick Vocab format: meaning + romanization with spaced syllables
const words = [
  { roman: 'an nyeong ha se yo', meaning: 'Hello', note: 'The polite, everyday greeting.' },
  { roman: 'gam sa ham ni da', meaning: 'Thank you', note: 'Formal and polite — safe with anyone.' },
  { roman: 'hyeon gwan', meaning: 'Entryway', note: 'The spot by the door where shoes come off.' },
  { roman: 'on dol', meaning: 'Underfloor heating', note: 'The warm floors at the heart of Korean homes.' },
  { roman: 'sil nae hwa', meaning: 'Indoor slippers', note: 'Worn inside schools and many homes.' },
  { roman: 'jal meok get seum ni da', meaning: 'I will eat well', note: 'Said before a meal — like “thanks for the food”.' },
  { roman: 'geon bae', meaning: 'Cheers', note: 'Raise your glass!' },
  { roman: 'jeong', meaning: 'Deep affection', note: 'The warm bond that grows between people over time.' },
  { roman: 'song pyeon', meaning: 'Half-moon rice cake', note: 'The classic Chuseok treat.' },
  { roman: 'mi yeok guk', meaning: 'Seaweed soup', note: 'Traditionally eaten on birthdays.' },
];
const card = document.getElementById('word-card');
let wordIndex = Math.floor(Date.now() / 86400000) % words.length;
function showWord() {
  const w = words[wordIndex];
  card.classList.remove('flipped');
  document.getElementById('word-roman').textContent = w.roman;
  document.getElementById('word-meaning').textContent = w.meaning;
  document.getElementById('word-note').textContent = w.note;
}
card.addEventListener('click', () => card.classList.toggle('flipped'));
document.getElementById('next-word').addEventListener('click', () => {
  wordIndex = (wordIndex + 1) % words.length;
  showWord();
});
showWord();

// Reveal sections as they scroll into view
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    io.observe(el);
  });
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
}

// Subscribe (front-end only — connect to Jetpack/Mailchimp to collect emails)
document.getElementById('subscribe-form').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('form-msg').textContent = 'Thank you — gam sa ham ni da!';
  e.target.reset();
});

document.getElementById('year').textContent = new Date().getFullYear();
