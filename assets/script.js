const store = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
  },
};

const todayKey = new Date().toISOString().slice(0, 10);

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

// Tip of the day
const tips = [
  { text: 'Take a 10-minute walk after your biggest meal — it helps steady blood sugar.', tag: 'Move' },
  { text: 'Get outside within an hour of waking. Morning light helps set your sleep clock.', tag: 'Rest' },
  { text: 'Add a palm-sized portion of protein to every meal to stay full longer.', tag: 'Nourish' },
  { text: 'Try box breathing: in for 4, hold 4, out for 4, hold 4. Repeat four times.', tag: 'Mind' },
  { text: 'Stand up and stretch for two minutes every hour you sit.', tag: 'Move' },
  { text: 'Keep a glass of water by your bed and drink it first thing in the morning.', tag: 'Nourish' },
  { text: 'Put your phone away 30 minutes before bed. Read something on paper instead.', tag: 'Rest' },
  { text: 'Write down three things that went well today. It takes one minute.', tag: 'Mind' },
  { text: 'Eat one more serving of vegetables than you did yesterday.', tag: 'Nourish' },
  { text: 'Do 10 bodyweight squats while the kettle boils.', tag: 'Move' },
];
const dayIndex = Math.floor(Date.now() / 86400000) % tips.length;
let tipIndex = dayIndex;
function showTip() {
  const tip = tips[tipIndex];
  document.getElementById('tip-text').textContent = tip.text;
  document.getElementById('tip-tag').textContent = `Pillar: ${tip.tag}`;
}
document.getElementById('tip-date').textContent = new Date().toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric',
});
document.getElementById('next-tip').addEventListener('click', () => {
  tipIndex = (tipIndex + 1) % tips.length;
  showTip();
});
showTip();

// Water tracker (resets each day)
const glassesEl = document.getElementById('glasses');
let water = store.get('water', {});
if (water.date !== todayKey) water = { date: todayKey, count: 0 };
function renderWater() {
  glassesEl.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const b = document.createElement('button');
    b.className = 'glass' + (i < water.count ? ' full' : '');
    b.setAttribute('aria-label', `Glass ${i + 1}`);
    b.addEventListener('click', () => {
      water.count = i < water.count ? i : i + 1;
      store.set('water', water);
      renderWater();
    });
    glassesEl.appendChild(b);
  }
  document.getElementById('water-count').textContent = water.count;
}
renderWater();

// 7-day challenge
const challenge = [
  'Walk 7,000 steps',
  'Drink 8 glasses of water',
  'Eat protein at breakfast',
  'In bed 30 minutes earlier',
  '5 minutes of deep breathing',
  '15-minute bodyweight workout',
  'A full day without sugary drinks',
];
const listEl = document.getElementById('challenge-list');
let done = store.get('challenge', []);
function renderChallenge() {
  listEl.innerHTML = '';
  challenge.forEach((task, i) => {
    const li = document.createElement('li');
    li.className = done.includes(i) ? 'done' : '';
    li.innerHTML = `<label><input type="checkbox" ${done.includes(i) ? 'checked' : ''}>
      <span class="day">Day ${i + 1}</span><span class="task">${task}</span></label>`;
    li.querySelector('input').addEventListener('change', (e) => {
      done = e.target.checked ? [...done, i] : done.filter((d) => d !== i);
      store.set('challenge', done);
      renderChallenge();
    });
    listEl.appendChild(li);
  });
  document.getElementById('hero-progress').textContent = done.length;
  document.querySelector('.ring').style.setProperty('--p', (done.length / 7) * 100);
}
document.getElementById('reset-challenge').addEventListener('click', () => {
  done = [];
  store.set('challenge', done);
  renderChallenge();
});
renderChallenge();

// Articles
const articles = [
  { tag: 'Move', title: 'The 20-minute strength routine you can do at home', excerpt: 'Five moves, no equipment, three rounds. Here is how to start.', read: 5 },
  { tag: 'Nourish', title: 'How much protein do you really need?', excerpt: 'A simple way to estimate your daily target — and hit it.', read: 6 },
  { tag: 'Rest', title: 'Why the same bedtime matters more than more sleep', excerpt: 'Consistency is the underrated key to feeling rested.', read: 4 },
  { tag: 'Mind', title: 'Three breathing techniques for stressful moments', excerpt: 'Quick tools to calm your nervous system in under two minutes.', read: 4 },
  { tag: 'Move', title: 'Walking: the most underrated exercise', excerpt: 'What the research says about daily steps and long-term health.', read: 7 },
  { tag: 'Nourish', title: 'Build a better plate in 30 seconds', excerpt: 'Half veggies, a quarter protein, a quarter carbs. That is it.', read: 3 },
];
const gridEl = document.getElementById('article-grid');
function renderArticles(filter) {
  gridEl.innerHTML = '';
  articles
    .filter((a) => filter === 'all' || a.tag === filter)
    .forEach((a) => {
      const el = document.createElement('article');
      el.className = 'article';
      el.innerHTML = `<span class="tag">${a.tag}</span><h3>${a.title}</h3><p>${a.excerpt}</p><span class="meta">${a.read} min read</span>`;
      gridEl.appendChild(el);
    });
}
document.getElementById('filters').addEventListener('click', (e) => {
  if (!e.target.dataset.filter) return;
  document.querySelectorAll('.chip').forEach((c) => c.classList.toggle('active', c === e.target));
  renderArticles(e.target.dataset.filter);
});
renderArticles('all');

// Subscribe (front-end only for now)
document.getElementById('subscribe-form').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('form-msg').textContent = "Thanks! You're on the list. 🌿";
  e.target.reset();
});

document.getElementById('year').textContent = new Date().getFullYear();
