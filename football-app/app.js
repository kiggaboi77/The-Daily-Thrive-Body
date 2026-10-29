const $ = s => document.querySelector(s);
const byId = Object.fromEntries(PLAYERS.map(p => [p.id, p]));
const cur = p => p.careers.find(c => c.to === null) || p.careers[p.careers.length - 1];
const span = c => `${c.from}–${c.to ?? '현재'}`;
const TYPE = {loan: '임대', youth: '유스'};
const initials = p => p.name.replace(/\s/g, '').slice(0, 2);
let tab = 'players';

$('#pos').innerHTML += Object.entries(POSITIONS).map(([k, v]) => `<option value="${k}">${k} · ${v}</option>`).join('');

function cardHTML(p) {
  const c = cur(p), club = CLUBS[c.club];
  return `<div class="card ${p.retired ? 'retired' : ''}" data-p="${p.id}" style="--c:${club.color}">
    <div class="top"><div><div class="ovr">${p.rating}</div><div class="p">${p.pos}</div></div><div class="flag">${p.flag}</div></div>
    <div class="avatar">${initials(p)}</div>
    <div class="nm">${p.name}</div>
    <div class="cl">${p.retired ? '은퇴 · ' : ''}${club.name}</div></div>`;
}

function render() {
  const q = $('#q').value.trim().toLowerCase(), pos = $('#pos').value, active = $('#active').checked;
  $('#filters').style.display = tab === 'players' ? '' : 'none';
  if (tab === 'players') {
    const list = PLAYERS.filter(p => {
      const hay = [p.name, p.en, p.nat, ...p.careers.map(c => CLUBS[c.club].name)].join(' ').toLowerCase();
      return (!q || hay.includes(q)) && (!pos || p.pos === pos || p.careers.some(c => c.pos === pos)) && (!active || !p.retired);
    });
    $('#view').innerHTML = list.length ? `<div class="grid">${list.map(cardHTML).join('')}</div>` : '<div class="empty">검색 결과가 없어요</div>';
  } else {
    $('#view').innerHTML = `<div class="clubs">${Object.entries(CLUBS).map(([id, c]) => {
      const n = PLAYERS.filter(p => p.careers.some(x => x.club === id)).length;
      return n ? `<div class="club" data-c="${id}" style="--c:${c.color}"><b>${c.name}</b><br><small>${c.country} · 등록 선수 ${n}명</small></div>` : '';
    }).join('')}</div>`;
  }
}

function familyOf(id) {
  const out = [];
  for (const [a, rel, b] of FAMILY) {
    if (a === id) out.push([{father: '아들', brother: '형제', spouse: '배우자'}[rel], b]);
    if (b === id) out.push([{father: '아버지', brother: '형제', spouse: '배우자'}[rel], a]);
  }
  return out;
}

function openPlayer(id) {
  const p = byId[id], fam = familyOf(id);
  const stints = [...p.careers].sort((a, b) => a.from - b.from);
  const moves = [];
  stints.forEach((c, i) => {
    moves.push(`<li style="--c:${CLUBS[c.club].color}"><b data-c="${c.club}">${CLUBS[c.club].name}</b>
      <span class="tag">${span(c)}</span>${TYPE[c.type] ? `<span class="tag">${TYPE[c.type]}</span>` : ''}
      <div>포지션 <b style="text-decoration:none;cursor:default">${c.pos}</b> · ${POSITIONS[c.pos]}</div></li>`);
  });
  const posHist = stints.filter((c, i) => i === 0 || stints[i - 1].pos !== c.pos)
    .map(c => `${c.pos} <small>(${c.from}~)</small>`).join(' → ');
  const famHTML = fam.map(([rel, fid]) => {
    const pl = byId[fid], pe = PEOPLE[fid];
    return pl ? `<div class="chip link" data-p="${fid}"><small>${rel}</small>${pl.name}</div>`
              : `<div class="chip"><small>${rel}</small>${pe.name}<small>${pe.note}</small></div>`;
  }).join('');
  $('#dlg').innerHTML = `<div class="dh">${cardHTML(p).replace(/data-p="[^"]*"/, '')}
    <div><h2>${p.name}</h2><p>${p.en}</p><p>${p.nat} · ${p.born}년생 · ${p.retired ? '은퇴' : '현역'}</p>
    <p>주 포지션 ${p.pos} · ${POSITIONS[p.pos]}${p.num ? ` · 등번호 ${p.num}` : ''}</p></div>
    <button class="x" aria-label="닫기">×</button></div>
  <div class="sec"><h3>포지션 변천</h3><div>${posHist}</div></div>
  <div class="sec"><h3>소속 · 이적 이력</h3><ul class="tl">${moves.join('')}</ul></div>
  <div class="sec"><h3>가족 관계</h3>${fam.length ? `<div class="fam">${famHTML}</div>` : '<span class="empty" style="padding:0">등록된 가족 정보가 없어요</span>'}</div>`;
  $('#dlg').showModal();
}

function openClub(id) {
  const c = CLUBS[id];
  const rows = PLAYERS.flatMap(p => p.careers.filter(x => x.club === id).map(x => ({p, x})))
    .sort((a, b) => (b.x.to === null) - (a.x.to === null) || b.x.from - a.x.from);
  const row = ({p, x}) => `<div data-p="${p.id}"><span class="pos">${x.pos}</span>${p.flag} ${p.name}<small>${span(x)}${TYPE[x.type] ? ' · ' + TYPE[x.type] : ''}</small></div>`;
  const now = rows.filter(r => r.x.to === null), past = rows.filter(r => r.x.to !== null);
  $('#dlg').innerHTML = `<div class="dh" style="border-left:8px solid ${c.color}"><div><h2>${c.name}</h2><p>${c.country}</p></div><button class="x" aria-label="닫기">×</button></div>
  <div class="sec"><h3>현재 소속 선수 (${now.length})</h3><div class="squad">${now.map(row).join('') || '<span class="empty" style="padding:0">없음</span>'}</div></div>
  <div class="sec"><h3>거쳐 간 선수 (${past.length})</h3><div class="squad">${past.map(row).join('') || '<span class="empty" style="padding:0">없음</span>'}</div></div>`;
  $('#dlg').showModal();
}

document.addEventListener('click', e => {
  const t = e.target;
  if (t.matches('nav button')) {
    tab = t.dataset.tab;
    document.querySelectorAll('nav button').forEach(b => b.classList.toggle('on', b === t));
    return render();
  }
  if (t.closest('.x') || t === $('#dlg')) return $('#dlg').close();
  const pl = t.closest('[data-p]'), cl = t.closest('[data-c]');
  if (pl && pl.dataset.p) openPlayer(pl.dataset.p);
  else if (cl) { $('#dlg').open && $('#dlg').close(); openClub(cl.dataset.c); }
});
['#q', '#pos', '#active'].forEach(s => $(s).addEventListener('input', render));
render();
