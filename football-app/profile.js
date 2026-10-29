/* 선수 프로파일: 왼쪽 사진 · 오른쪽 출신/소개/이력/가족
   대표 선수는 직접 쓴 정보(data.js/extra.js), 나머지는 Wikipedia·Wikidata 검색 결과(동명이인 가능) */
const STAR_ALIAS = {'Mbappé': 'mbappe', 'Vinícius Jr.': 'vini', 'Bellingham': 'jude', 'Haaland': 'haaland', 'Salah': 'salah', 'De Bruyne': 'debruyne',
  'Modrić': 'modric', 'Kim Min-jae': 'kimminjae', 'Lee Kang-in': 'leekangin', 'M. Thuram': 'marcus', 'K. Thuram': 'khephren'};
let profCache = null;
const pc = () => profCache || (profCache = store.get('fc.prof', {}));
const enc = encodeURIComponent;
const WIKI_API = 'https://en.wikipedia.org/w/api.php', WD_API = 'https://www.wikidata.org/w/api.php';
async function jget(url) { const r = await fetch(url); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }
const claimIds = (cl, prop) => (cl[prop] || []).map(c => c.mainsnak?.datavalue?.value?.id).filter(Boolean);
const claimYear = (c, prop) => { const t = c.qualifiers?.[prop]?.[0]?.datavalue?.value?.time; return t ? +t.slice(1, 5) : null; };

async function fetchWikiProfile(p) {
  const q = `${p.name} ${p.clubEn} footballer`;
  const hit = (await jget(`${WIKI_API}?action=query&list=search&srsearch=${enc(q)}&srlimit=1&format=json&origin=*`)).query?.search?.[0]?.title;
  if (!hit) throw new Error('위키백과에서 찾지 못했어요');
  const pg = Object.values((await jget(`${WIKI_API}?action=query&titles=${enc(hit)}&prop=pageprops|pageimages|extracts&ppprop=wikibase_item&piprop=thumbnail&pithumbsize=600&exintro=1&explaintext=1&exsentences=3&format=json&origin=*`)).query?.pages || {})[0] || {};
  const out = {title: hit, photo: pg.thumbnail?.source || '', intro: pg.extract || '', introLang: 'en', careers: [], family: []};
  const qid = pg.pageprops?.wikibase_item;
  if (!qid) return out;
  const ent = (await jget(`${WD_API}?action=wbgetentities&ids=${qid}&props=claims|sitelinks&format=json&origin=*`)).entities?.[qid];
  const cl = ent?.claims || {};
  const koTitle = ent?.sitelinks?.kowiki?.title;
  const born = cl.P569?.[0]?.mainsnak?.datavalue?.value?.time;
  if (born) out.born = born.slice(1, 11);
  const teams = (cl.P54 || []).map(c => ({id: c.mainsnak?.datavalue?.value?.id, from: claimYear(c, 'P580'), to: claimYear(c, 'P582')})).filter(t => t.id);
  const fam = [['P22', '아버지'], ['P25', '어머니'], ['P3373', '형제자매'], ['P26', '배우자'], ['P40', '자녀']].flatMap(([k, rel]) => claimIds(cl, k).map(id => ({id, rel})));
  const place = claimIds(cl, 'P19')[0], nat = claimIds(cl, 'P27')[0];
  const ids = [...new Set([place, nat, ...teams.map(t => t.id), ...fam.map(f => f.id)].filter(Boolean))], label = {};
  for (let i = 0; i < ids.length; i += 50) {
    const ls = (await jget(`${WD_API}?action=wbgetentities&ids=${ids.slice(i, i + 50).join('|')}&props=labels&languages=ko|en&format=json&origin=*`)).entities || {};
    for (const [k, v] of Object.entries(ls)) label[k] = v.labels?.ko?.value || v.labels?.en?.value || '';
  }
  out.birthplace = label[place] || ''; out.nation = label[nat] || '';
  out.careers = teams.sort((a, b) => (a.from || 0) - (b.from || 0)).map(t => ({club: label[t.id] || '', from: t.from, to: t.to})).filter(t => t.club);
  out.family = fam.map(f => ({rel: f.rel, name: label[f.id]})).filter(f => f.name);
  if (koTitle) {
    try {
      const ko = await jget(`https://ko.wikipedia.org/api/rest_v1/page/summary/${enc(koTitle)}`);
      if (ko.extract) { out.intro = ko.extract; out.introLang = 'ko'; out.title = koTitle; out.koUrl = true; }
      if (!out.photo && ko.thumbnail?.source) out.photo = ko.thumbnail.source;
    } catch {}
  }
  return out;
}

function starData(star, p) {
  const bio = BIO[star.id] || {};
  const fam = familyOf(star.id).map(([rel, id]) => ({rel, name: byId[id]?.name || PEOPLE[id]?.name, note: PEOPLE[id]?.note})).filter(f => f.name);
  return {photo: photoOf(star), born: star.born ? `${star.born}년` : '', birthplace: bio.origin, nation: star.nat, intro: bio.intro, introLang: 'local',
    careers: [...star.careers].sort((a, b) => (a.from || 0) - (b.from || 0)).map(c => ({club: CLUBS[c.club].name, from: c.from, to: c.to, tag: c.type === 'loan' ? '임대' : c.type === 'youth' ? '유스' : '', fee: feeLabel(c)})),
    family: fam, local: true};
}

function profHTML(p, d, state) {
  const art = cartoonPlayer(p.name + p.clubEn, p.c1, p.c2, p.pos);
  const photo = d?.photo ? `<img class="pf-img" src="${esc(d.photo)}" alt="${esc(p.name)}" referrerpolicy="no-referrer">` : art;
  const facts = [['포지션', POSITIONS[p.pos] || p.pos], ['주발', FOOT[p.foot] || '정보 없음'], ['소속', p.club],
    ['국적', `${p.flag} ${p.nation || NATION[p.nat] || d?.nation || '-'}`], ...(d?.born ? [['생년월일', d.born]] : [])];
  const intro = d?.intro || `${ROLE[p.pos] || ''}`;
  const introTag = d?.introLang === 'local' ? '' : d?.introLang ? `<span class="tag">${d.introLang === 'ko' ? '위키백과(한국어)' : 'Wikipedia(영문)'}</span>` : '<span class="tag">포지션 기본 설명</span>';
  const careers = d?.careers?.length ? `<ul class="tl">${d.careers.map(c => `<li><b style="text-decoration:none;cursor:default">${esc(c.club)}</b>
      <span class="tag">${c.from ? `${c.from}–${c.to ?? '현재'}` : '현재'}</span>${c.tag ? `<span class="tag">${c.tag}</span>` : ''}${c.fee ? `<span class="tag fee">${c.fee}</span>` : ''}</li>`).join('')}</ul>`
    : `<p class="hint">${state === 'loading' ? '불러오는 중…' : '이력 정보를 찾지 못했어요'}</p>`;
  const fam = d?.family?.length ? `<div class="fam">${d.family.map(f => `<div class="chip"><small>${esc(f.rel)}</small>${esc(f.name)}${f.note ? `<small>${esc(f.note)}</small>` : ''}</div>`).join('')}</div>`
    : `<p class="hint">${state === 'loading' ? '불러오는 중…' : '알려진 가족 정보가 없어요'}</p>`;
  const src = d?.local ? '정보: 앱에 직접 입력한 요약' : d?.title ? `출처: <a href="https://en.wikipedia.org/wiki/${enc(d.title.replace(/ /g, '_'))}" target="_blank" rel="noopener">Wikipedia · ${esc(d.title)}</a> / Wikidata — 자동 검색 결과라 동명이인일 수 있어요.` : '';
  return `<div class="prof" style="--c1:${p.c1};--c2:${p.c2}"><button class="x" aria-label="닫기">×</button>
  <aside class="pf-side"><div class="pf-photo">${photo}</div><h2>${esc(p.name)}</h2><p class="pf-sub">${p.flag} ${esc(p.club)}</p>
    <dl>${facts.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
    <button class="btn2" data-lp="${esc(p.id)}">← 선수 카드</button></aside>
  <div class="pf-main">
    <section><h3>출신</h3><p>${esc(d?.birthplace || (state === 'loading' ? '불러오는 중…' : '정보 없음'))}</p></section>
    <section><h3>선수 소개 ${introTag}</h3><p>${esc(intro)}</p></section>
    <section><h3>이력</h3>${careers}</section>
    <section><h3>가족</h3>${fam}</section>
    ${state === 'error' ? `<p class="hint">온라인 정보를 가져오지 못했어요: ${esc(d?.err || '')}</p>` : ''}<p class="src">${src}</p></div></div>`;
}

async function openProfile(id) {
  const p = lgPlayerById(id); if (!p) return;
  const dlg = $('#dlg'), key = p.id;
  const star = STAR_ALIAS[p.name] && byId[STAR_ALIAS[p.name]];
  const draw = (d, st) => { if (dlg.open && dlg.dataset.prof === key) { dlg.innerHTML = profHTML(p, d, st); } };
  dlg.dataset.prof = key; dlg.innerHTML = profHTML(p, null, 'loading'); if (!dlg.open) dlg.showModal();
  if (star) {
    const d = starData(star, p); draw(d, 'ok');
    if (!d.photo) { await loadWiki(star); const d2 = starData(star, p); if (d2.photo) draw(d2, 'ok'); }
    return;
  }
  if (pc()[key]) return draw(pc()[key], 'ok');
  try {
    const d = await fetchWikiProfile(p);
    profCache[key] = d; store.set('fc.prof', profCache); draw(d, 'ok');
  } catch (e) { draw({err: e.message}, 'error'); }
}

document.addEventListener('click', e => { const el = e.target.closest('[data-prof]'); if (el) openProfile(el.dataset.prof); });
document.addEventListener('error', e => {
  if (e.target.classList?.contains('pf-img')) { // 사진 로드 실패 → 만화 캐릭터로 대체
    const dlg = $('#dlg'), p = lgPlayerById(dlg.dataset.prof);
    if (p) e.target.parentElement.innerHTML = cartoonPlayer(p.name + p.clubEn, p.c1, p.c2, p.pos);
  }
}, true);
