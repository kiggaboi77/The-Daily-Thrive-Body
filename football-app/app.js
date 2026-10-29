const $ = s => document.querySelector(s);
const store = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const norm = s => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const TYPE = {loan: '임대', youth: '유스'};
const GRAY = '#6b7280';

/* ---------- 상태 ---------- */
let apiKey = store.get('fc.key', '3');
let sync = store.get('fc.sync', {});      // 선수id → API 최신 정보
let wikiCache = store.get('fc.wiki', {}); // 선수id → 위키 사진 URL
let custom = store.get('fc.custom', []);  // API 검색으로 추가한 선수
let tab = 'league';
let byId = {};

function clubFor(name) {
  if (!name || name.startsWith('_')) { CLUBS.retired = CLUBS.retired || {name: '은퇴/무소속', country: '-', color: GRAY}; return 'retired'; }
  const id = 'api-' + norm(name).replace(/[^a-z0-9]+/g, '-');
  CLUBS[id] = CLUBS[id] || {name, country: '-', color: GRAY};
  return id;
}
function rebuild() {
  for (let i = PLAYERS.length - 1; i >= 0; i--) if (PLAYERS[i].custom) PLAYERS.splice(i, 1);
  custom.forEach(c => { clubFor(c.clubName); PLAYERS.push(c); });
  byId = Object.fromEntries(PLAYERS.map(p => [p.id, p]));
}
rebuild();

/* ---------- 도우미 ---------- */
const cur = p => p.careers.find(c => c.to === null) || p.careers[p.careers.length - 1];
const span = c => c.from ? `${c.from}–${c.to ?? '현재'}` : '현재';
const initials = p => p.name.replace(/\s/g, '').slice(0, 2);
const photoOf = p => p.photo || sync[p.id]?.photo || wikiCache[p.id] || '';
const money = n => n >= 1000 ? `€${(n / 1000).toFixed(2)}B` : `€${n}M`;
const feeLabel = c => c.type === 'loan' ? '임대' : c.fee === 0 ? '자유이적' : c.fee > 0 ? `약 ${money(c.fee)}` : null;
const sorted = p => [...p.careers].sort((a, b) => (a.from || 0) - (b.from || 0));
const esc = s => String(s ?? '').replace(/[&<>"]/g, m => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[m]));

$('#pos').innerHTML += Object.entries(POSITIONS).map(([k, v]) => `<option value="${k}">${k} · ${v}</option>`).join('');

/* ---------- 사진 ---------- */
const tried = new Set();
function paint(id) {
  const p = byId[id], url = p && photoOf(p);
  if (!url) return;
  document.querySelectorAll(`.avatar[data-id="${CSS.escape(id)}"]`).forEach(el => {
    el.style.backgroundImage = `url("${url}")`; el.classList.add('img');
  });
}
async function loadWiki(p) {
  if (!p.wiki || photoOf(p) || tried.has(p.id) || !navigator.onLine) return;
  tried.add(p.id);
  try {
    const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(p.wiki)}`);
    if (!r.ok) return;
    const j = await r.json();
    if (j.thumbnail?.source) { wikiCache[p.id] = j.thumbnail.source; store.set('fc.wiki', wikiCache); paint(p.id); }
  } catch {}
}
const hydrate = () => PLAYERS.forEach(p => { paint(p.id); loadWiki(p); });

/* ---------- 카드 ---------- */
function cardHTML(p) {
  const c = cur(p), club = CLUBS[c.club], url = photoOf(p);
  return `<div class="card ${p.retired ? 'retired' : ''}" data-p="${esc(p.id)}" style="--c:${club.color}">
    <div class="top"><div><div class="ovr">${p.rating ?? '–'}</div><div class="p">${p.pos}</div></div><div class="flag">${p.flag}</div></div>
    <div class="avatar ${url ? 'img' : ''}" data-id="${esc(p.id)}" ${url ? `style="background-image:url('${esc(url)}')"` : ''}>${esc(initials(p))}</div>
    <div class="nm">${esc(p.name)}</div>
    <div class="cl">${p.retired ? '은퇴 · ' : ''}${esc(club.name)}</div></div>`;
}

/* ---------- 탭 ---------- */
function render() {
  $('#filters').style.display = tab === 'players' ? '' : 'none';
  ({league: renderLeague, players: renderPlayers, clubs: renderClubs, market: renderMarket, api: renderApi})[tab]();
  if (tab !== 'league') hydrate();
}
function renderPlayers() {
  const q = $('#q').value.trim().toLowerCase(), pos = $('#pos').value, active = $('#active').checked;
  const list = PLAYERS.filter(p => {
    const hay = [p.name, p.en, p.nat, ...p.careers.map(c => CLUBS[c.club].name)].join(' ').toLowerCase();
    return (!q || hay.includes(q)) && (!pos || p.pos === pos || p.careers.some(c => c.pos === pos)) && (!active || !p.retired);
  });
  $('#view').innerHTML = list.length ? `<div class="grid">${list.map(cardHTML).join('')}</div>` : '<div class="empty">검색 결과가 없어요</div>';
}
function renderClubs() {
  $('#view').innerHTML = `<div class="clubs">${Object.entries(CLUBS).map(([id, c]) => {
    const n = PLAYERS.filter(p => p.careers.some(x => x.club === id)).length;
    return n ? `<div class="club" data-c="${esc(id)}" style="--c:${c.color}"><b>${esc(c.name)}</b><br><small>${esc(c.country)} · 등록 선수 ${n}명</small></div>` : '';
  }).join('')}</div>`;
}
function transfers() {
  const out = [];
  PLAYERS.forEach(p => {
    const st = sorted(p);
    st.forEach((c, i) => { if (i && c.fee !== undefined) out.push({p, c, from: st[i - 1].club}); });
  });
  return out;
}
function renderMarket() {
  const all = transfers(), paid = all.filter(t => t.c.type !== 'loan' && t.c.fee > 0).sort((a, b) => b.c.fee - a.c.fee);
  const free = all.filter(t => t.c.fee === 0 && t.c.type !== 'loan').sort((a, b) => b.c.from - a.c.from);
  const max = paid[0]?.c.fee || 1;
  const row = (t, bar) => `<div class="row" data-p="${esc(t.p.id)}"><div><b>${esc(t.p.name)}</b><small>${esc(CLUBS[t.from].name)} → ${esc(CLUBS[t.c.club].name)} · ${t.c.from}</small></div>
    <div class="r">${feeLabel(t.c)}${bar ? `<div class="bar" style="width:${Math.max(8, t.c.fee / max * 100)}%;margin-left:auto"></div>` : ''}</div></div>`;
  $('#view').innerHTML = `<div class="panel"><h3>이적료 순위 (${paid.length}건)</h3><p>등록된 선수 이적만 집계한 대략치입니다. 클릭하면 선수 상세로 이동해요.</p>${paid.map(t => row(t, true)).join('')}</div>
  <div class="panel"><h3>자유이적 (${free.length}건)</h3>${free.map(t => row(t, false)).join('')}</div>`;
}

/* ---------- 가족 ---------- */
function familyOf(id) {
  const out = [];
  for (const [a, rel, b] of FAMILY) {
    if (a === id) out.push([{father: '아들', brother: '형제', spouse: '배우자'}[rel], b]);
    if (b === id) out.push([{father: '아버지', brother: '형제', spouse: '배우자'}[rel], a]);
  }
  return out;
}

/* ---------- 상세 ---------- */
function openPlayer(id) {
  const p = byId[id], fam = familyOf(id), st = sorted(p), s = sync[id];
  const posHist = st.filter((c, i) => i === 0 || st[i - 1].pos !== c.pos).map(c => `${c.pos} <small>(${c.from || '현재'}~)</small>`).join(' → ');
  const paid = st.filter(c => c.type !== 'loan' && c.fee > 0), total = paid.reduce((a, c) => a + c.fee, 0), top = paid.reduce((m, c) => !m || c.fee > m.fee ? c : m, null);
  const tl = st.map(c => {
    const f = feeLabel(c);
    return `<li style="--c:${CLUBS[c.club].color}"><b data-c="${esc(c.club)}">${esc(CLUBS[c.club].name)}</b>
      <span class="tag">${span(c)}</span>${TYPE[c.type] && c.type !== 'loan' ? `<span class="tag">${TYPE[c.type]}</span>` : ''}${f ? `<span class="tag fee">${f}</span>` : ''}
      <div>포지션 <b style="text-decoration:none;cursor:default">${c.pos}</b> · ${POSITIONS[c.pos]}</div></li>`;
  }).join('');
  const famHTML = fam.map(([rel, fid]) => {
    const pl = byId[fid], pe = PEOPLE[fid];
    return pl ? `<div class="chip link" data-p="${esc(fid)}"><small>${rel}</small>${esc(pl.name)}</div>`
              : `<div class="chip"><small>${rel}</small>${esc(pe.name)}<small>${esc(pe.note)}</small></div>`;
  }).join('');
  $('#dlg').innerHTML = `<div class="dh">${cardHTML(p).replace(/data-p="[^"]*"/, '')}
    <div><h2>${esc(p.name)}</h2><p>${esc(p.en)}</p><p>${esc(p.nat)} · ${p.born || '?'}년생 · ${p.retired ? '은퇴' : '현역'}</p>
    <p>주 포지션 ${p.pos} · ${POSITIONS[p.pos]}${p.num ? ` · 등번호 ${p.num}` : ''}</p>
    ${paid.length ? `<div class="sum"><span class="tag fee">누적 이적료 약 ${money(total)}</span><span class="tag fee">최고 약 ${money(top.fee)} (${esc(CLUBS[top.club].name)}, ${top.from})</span></div>` : ''}</div>
    <button class="x" aria-label="닫기">×</button></div>
  ${s ? `<div class="api">🌐 API 최신(${new Date(s.at).toLocaleDateString('ko-KR')}): <b>${esc(s.team || '-')}</b> · ${esc(s.pos || '-')}${s.num ? ' · #' + esc(s.num) : ''}</div>` : ''}
  <div class="sec"><h3>포지션 변천</h3><div>${posHist}</div></div>
  <div class="sec"><h3>소속 · 이적 이력</h3><ul class="tl">${tl}</ul></div>
  <div class="sec"><h3>가족 관계</h3>${fam.length ? `<div class="fam">${famHTML}</div>` : '<span class="empty" style="padding:0">등록된 가족 정보가 없어요</span>'}</div>
  ${p.custom ? `<div class="sec"><button class="btn" data-act="del" data-id="${esc(p.id)}">내 목록에서 삭제</button></div>` : ''}`;
  $('#dlg').showModal(); paint(id);
}
function openClub(id) {
  const c = CLUBS[id];
  const rows = PLAYERS.flatMap(p => p.careers.filter(x => x.club === id).map(x => ({p, x})))
    .sort((a, b) => (b.x.to === null) - (a.x.to === null) || (b.x.from || 0) - (a.x.from || 0));
  const row = ({p, x}) => `<div data-p="${esc(p.id)}"><span class="pos">${x.pos}</span>${p.flag} ${esc(p.name)}<small>${span(x)}${TYPE[x.type] ? ' · ' + TYPE[x.type] : ''}${feeLabel(x) && x.type !== 'loan' ? ' · ' + feeLabel(x) : ''}</small></div>`;
  const now = rows.filter(r => r.x.to === null), past = rows.filter(r => r.x.to !== null), none = '<span class="empty" style="padding:0">없음</span>';
  $('#dlg').innerHTML = `<div class="dh" style="border-left:8px solid ${c.color}"><div><h2>${esc(c.name)}</h2><p>${esc(c.country)}</p></div><button class="x" aria-label="닫기">×</button></div>
  <div class="sec"><h3>현재 소속 선수 (${now.length})</h3><div class="squad">${now.map(row).join('') || none}</div></div>
  <div class="sec"><h3>거쳐 간 선수 (${past.length})</h3><div class="squad">${past.map(row).join('') || none}</div></div>`;
  $('#dlg').showModal();
}

/* ---------- 외부 API (TheSportsDB) ---------- */
async function api(path) {
  const r = await fetch(`https://www.thesportsdb.com/api/v1/json/${encodeURIComponent(apiKey)}/${path}`);
  if (!r.ok) throw new Error(r.status === 429 ? '요청 한도 초과(잠시 후 다시)' : `HTTP ${r.status}`);
  return r.json();
}
const searchApi = async name => ((await api('searchplayers.php?p=' + encodeURIComponent(name.trim().replace(/\s+/g, '_')))).player || []).filter(x => x.strSport === 'Soccer');
let syncing = false;
async function syncAll() {
  if (syncing) return; syncing = true;
  const st = $('#syncst'), log = $('#synclist');
  log.innerHTML = '';
  for (const [i, p] of PLAYERS.entries()) {
    st.textContent = `갱신 중 ${i + 1}/${PLAYERS.length} · ${p.en}`;
    try {
      const list = await searchApi(p.en);
      const hit = list.find(x => norm(x.strPlayer) === norm(p.en)) || list[0];
      if (hit) {
        sync[p.id] = {team: hit.strTeam, pos: hit.strPosition, num: hit.strNumber, photo: hit.strCutout || hit.strThumb || '', at: Date.now()};
        store.set('fc.sync', sync); paint(p.id);
        log.innerHTML += `<div class="row" data-p="${esc(p.id)}"><div><b>${esc(p.name)}</b><small>${esc(CLUBS[cur(p).club].name)}</small></div><div class="r">API: ${esc(hit.strTeam)}<small>${esc(hit.strPosition)}</small></div></div>`;
      } else log.innerHTML += `<div class="row"><div><b>${esc(p.name)}</b><small>API 결과 없음</small></div></div>`;
    } catch (e) {
      log.innerHTML += `<div class="row"><div><b>${esc(p.name)}</b><small>실패: ${esc(e.message)}</small></div></div>`;
      if (/한도|Failed|fetch/i.test(e.message)) break;
    }
    await sleep(2100); // 무료 키: 분당 30회
  }
  st.textContent = '완료'; syncing = false;
}
const POSMAP = [[/goalkeeper/i, 'GK'], [/centre.?back|defender/i, 'CB'], [/right.?back/i, 'RB'], [/left.?back/i, 'LB'], [/defensive/i, 'DM'], [/attacking/i, 'AM'],
  [/midfield/i, 'CM'], [/right.?wing/i, 'RW'], [/left.?wing|winger/i, 'LW'], [/second|centre.?forward/i, 'CF'], [/forward|striker/i, 'ST']];
const mapPos = s => (POSMAP.find(([re]) => re.test(s || '')) || [0, 'CM'])[1];
let found = [];
async function doSearch() {
  const q = $('#aq').value.trim(), box = $('#ares');
  if (!q) return;
  box.innerHTML = '<p>검색 중…</p>';
  try {
    found = await searchApi(q);
    box.innerHTML = found.length ? found.slice(0, 15).map((x, i) => {
      const has = byId['api' + x.idPlayer];
      return `<div class="row">${x.strCutout || x.strThumb ? `<img src="${esc(x.strCutout || x.strThumb)}" alt="" loading="lazy">` : '<div class="th"></div>'}
        <div><b>${esc(x.strPlayer)}</b><small>${esc(x.strTeam || '-')} · ${esc(x.strPosition || '-')} · ${esc(x.strNationality || '')}</small></div>
        <div class="r"><button class="pri" data-act="add" data-i="${i}" ${has ? 'disabled' : ''}>${has ? '추가됨' : '추가'}</button></div></div>`;
    }).join('') : '<p>결과가 없어요</p>';
  } catch (e) { box.innerHTML = `<p>검색 실패: ${esc(e.message)}</p>`; }
}
function addFound(i) {
  const x = found[i]; if (!x) return;
  const club = clubFor(x.strTeam);
  custom.push({id: 'api' + x.idPlayer, custom: true, name: x.strPlayer, en: x.strPlayer, nat: x.strNationality || '-', flag: '🌍',
    born: +(x.dateBorn || '').slice(0, 4) || null, pos: mapPos(x.strPosition), num: +x.strNumber || null, rating: null,
    retired: club === 'retired', photo: x.strCutout || x.strThumb || '', clubName: x.strTeam,
    careers: [{club, from: null, to: null, type: 'senior', pos: mapPos(x.strPosition)}]});
  store.set('fc.custom', custom); rebuild(); doSearch();
}
function renderApi() {
  $('#view').innerHTML = `<div class="panel"><h3>API 설정</h3><p>TheSportsDB 무료 키는 <b>3</b> (분당 30회 제한). 후원 키가 있으면 바꿔 넣으세요.</p>
    <input id="key" value="${esc(apiKey)}"> <button data-act="savekey">저장</button></div>
  <div class="panel"><h3>전체 선수 최신화</h3><p>등록된 선수의 현재 팀·포지션·사진을 가져와 상세 화면에 표시합니다. (선수당 약 2초)</p>
    <button class="pri" data-act="sync">갱신 시작</button> <span id="syncst"></span><div id="synclist"></div></div>
  <div class="panel"><h3>선수 검색해서 추가</h3><p>영문 이름으로 검색하세요. 추가한 선수는 이 기기에 저장됩니다.</p>
    <input id="aq" placeholder="예: Lamine Yamal"> <button class="pri" data-act="asearch">검색</button><div id="ares"></div></div>`;
}

/* ---------- 이벤트 ---------- */
document.addEventListener('click', e => {
  const t = e.target;
  if (t.matches('nav button')) {
    tab = t.dataset.tab;
    document.querySelectorAll('nav button').forEach(b => b.classList.toggle('on', b === t));
    return render();
  }
  const act = t.closest('[data-act]');
  if (act) {
    const a = act.dataset.act;
    if (a === 'savekey') { apiKey = $('#key').value.trim() || '3'; store.set('fc.key', apiKey); act.textContent = '저장됨'; }
    else if (a === 'sync') syncAll();
    else if (a === 'asearch') doSearch();
    else if (a === 'add') addFound(+act.dataset.i);
    else if (a === 'del') { custom = custom.filter(c => c.id !== act.dataset.id); store.set('fc.custom', custom); rebuild(); $('#dlg').close(); render(); }
    return;
  }
  if (t.closest('.x') || t === $('#dlg')) return $('#dlg').close();
  const pl = t.closest('[data-p]'), cl = t.closest('[data-c]');
  if (pl && pl.dataset.p) { if ($('#dlg').open) $('#dlg').close(); openPlayer(pl.dataset.p); }
  else if (cl) { if ($('#dlg').open) $('#dlg').close(); openClub(cl.dataset.c); }
});
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'aq') doSearch(); });
['#q', '#pos', '#active'].forEach(s => $(s).addEventListener('input', render));

/* ---------- 오프라인 표시 · PWA ---------- */
const netState = () => { $('#net').textContent = navigator.onLine ? '온라인' : '오프라인 (저장된 데이터 표시 중)'; };
addEventListener('online', () => { netState(); hydrate(); }); addEventListener('offline', netState); netState();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});

render();
