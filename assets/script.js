// Mobile nav
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
links.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') links.classList.remove('open');
});

// Articles — add each new WordPress post here. Set `url` once it's published.
const posts = [
  {
    tag: 'Etiquette',
    title: 'Why Do Koreans Take Off Their Shoes Indoors?',
    excerpt: 'Floor heating, floor living and the meaning of the entryway — the real reasons behind the shoes-off rule.',
    url: 'https://kiggaboi77.com/',
  },
  { tag: 'Etiquette', title: 'Drinking Etiquette in Korea', excerpt: 'Two hands, turning away from elders and who pours for whom.' },
  { tag: 'Food', title: 'Why Koreans Eat Seaweed Soup on Birthdays', excerpt: 'The story behind the birthday bowl of miyeokguk.' },
  { tag: 'Holidays', title: 'Chuseok: Korea’s Harvest Holiday', excerpt: 'Family trips, ancestral rites and half-moon rice cakes.' },
  { tag: 'Language', title: 'Oppa, Unni, Hyung: Korean Family Words for Friends', excerpt: 'Why Koreans call friends “older brother” and “older sister”.' },
  { tag: 'Food', title: 'The Unwritten Rules of the Korean Dinner Table', excerpt: 'Spoons, chopsticks, shared side dishes and waiting for the eldest.' },
];

const gridEl = document.getElementById('post-grid');
function renderPosts(filter) {
  gridEl.innerHTML = '';
  posts
    .filter((p) => filter === 'all' || p.tag === filter)
    .forEach((p) => {
      const el = document.createElement('article');
      el.className = 'post' + (p.url ? '' : ' soon');
      el.innerHTML = `<span class="tag"></span><h3></h3><p></p><span class="meta"></span>`;
      el.querySelector('.tag').textContent = p.tag;
      el.querySelector('h3').textContent = p.title;
      el.querySelector('p').textContent = p.excerpt;
      el.querySelector('.meta').innerHTML = p.url
        ? `<a href="${p.url}">Read article →</a>`
        : 'COMING SOON';
      gridEl.appendChild(el);
    });
}
document.getElementById('filters').addEventListener('click', (e) => {
  if (!e.target.dataset.filter) return;
  document.querySelectorAll('.chip').forEach((c) => c.classList.toggle('active', c === e.target));
  renderPosts(e.target.dataset.filter);
});
renderPosts('all');

// Word of the day — Quick Vocab format: meaning + romanization with spaced syllables
const words = [
  { roman: 'an nyeong ha se yo', meaning: 'Hello', note: 'The polite, everyday greeting.' },
  { roman: 'gam sa ham ni da', meaning: 'Thank you', note: 'Formal and polite — safe with anyone.' },
  { roman: 'hyeon gwan', meaning: 'Entryway', note: 'The spot by the door where shoes come off.' },
  { roman: 'on dol', meaning: 'Underfloor heating', note: 'The heated floors at the heart of Korean homes.' },
  { roman: 'sil nae hwa', meaning: 'Indoor slippers', note: 'Worn inside schools and some homes.' },
  { roman: 'jal meok get seum ni da', meaning: 'I will eat well', note: 'Said before a meal, like “thanks for the food”.' },
  { roman: 'geon bae', meaning: 'Cheers', note: 'Raise your glass!' },
  { roman: 'jeong', meaning: 'Deep affection and bond', note: 'The warm attachment between people over time.' },
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

// Subscribe (front-end only — connect to Jetpack/Mailchimp to collect emails)
document.getElementById('subscribe-form').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('form-msg').textContent = 'Thanks for subscribing — gam sa ham ni da!';
  e.target.reset();
});

document.getElementById('year').textContent = new Date().getFullYear();
