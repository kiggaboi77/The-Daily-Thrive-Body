/* 리그 탐색: 나라 → 구단 → 선수단(포메이션 그림) → 선수 카드. 모든 그림은 코드로 그리는 만화 캐릭터(실제 얼굴·공식 엠블럼과 무관) */
const FLAG_SPECIAL = {en: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', sct: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', wls: '🏴󠁧󠁢󠁷󠁬󠁳󠁿'};
const flagOf = c => FLAG_SPECIAL[c] || (/^[a-z]{2}$/.test(c) ? String.fromCodePoint(...[...c.toUpperCase()].map(ch => 127397 + ch.charCodeAt(0))) : '🌍');
const NATION = {en:'잉글랜드',sct:'스코틀랜드',es:'스페인',fr:'프랑스',de:'독일',it:'이탈리아',pt:'포르투갈',nl:'네덜란드',br:'브라질',ar:'아르헨티나',uy:'우루과이',be:'벨기에',hr:'크로아티아',ch:'스위스',kr:'대한민국',jp:'일본',sn:'세네갈',ma:'모로코',no:'노르웨이',se:'스웨덴',dk:'덴마크',pl:'폴란드',cm:'카메룬',ci:'코트디부아르',gh:'가나',ng:'나이지리아',co:'콜롬비아',ec:'에콰도르',us:'미국',mx:'멕시코',at:'오스트리아',cz:'체코',sk:'슬로바키아',rs:'세르비아',gr:'그리스',ua:'우크라이나',tr:'튀르키예',ge:'조지아',ie:'아일랜드',am:'아르메니아',eg:'이집트',dz:'알제리',cl:'칠레',gm:'감비아',bf:'부르키나파소',tn:'튀니지',gn:'기니',xk:'코소보',si:'슬로베니아',me:'몬테네그로',hu:'헝가리',al:'알바니아',ba:'보스니아',au:'호주',ve:'베네수엘라',ro:'루마니아',mk:'북마케도니아',fi:'핀란드',ca:'캐나다',ru:'러시아',ga:'가봉',ml:'말리',tg:'토고',nz:'뉴질랜드',gw:'기니비사우',ao:'앙골라',is:'아이슬란드',cg:'콩고'};
const FOOT = {R: '오른발', L: '왼발', B: '양발'};
const ROLE = {
  GK: '골문을 지키고 후방에서 빌드업을 시작하는 마지막 방어선',
  RB: '오른쪽 측면 수비와 오버래핑 공격 가담', LB: '왼쪽 측면 수비와 오버래핑 공격 가담',
  CB: '상대 공격수를 막고 공중볼을 따내는 수비의 중심', DM: '수비 라인 앞에서 공을 끊고 공격으로 연결',
  CM: '공수 균형을 맞추며 경기 흐름을 조율', AM: '최전방 바로 뒤에서 결정적인 패스와 슛을 노림',
  RW: '오른쪽 측면에서 돌파와 크로스, 안으로 파고드는 슛', LW: '왼쪽 측면에서 돌파와 크로스, 안으로 파고드는 슛',
  CF: '공격의 중심에서 연계와 마무리', ST: '골문 앞에서 득점을 책임지는 최전방 공격수'
};
// 4-3-3 슬롯 (x, y %) — 입력 순서와 동일
const SLOTS = [[50, 91], [86, 72], [64, 76], [36, 76], [14, 72], [50, 54], [72, 42], [28, 42], [82, 18], [50, 12], [18, 18]];
const SLOT_POS = ['GK', 'RB', 'CB', 'CB', 'LB', 'DM', 'CM', 'CM', 'RW', 'ST', 'LW'];

const hash = s => { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const pick = (arr, h, shift) => arr[(h >>> shift) % arr.length];
const lum = hex => { const n = parseInt(hex.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };
const ink = hex => lum(hex) > 0.6 ? '#1b1b1b' : '#ffffff';
const OUT = '#222';

/* ----- 선수 만화 얼굴 ----- */
const SKINS = ['#ffd9b3', '#f5c297', '#e0a574', '#c68642', '#a1683a', '#7a4a2a'];
const HAIRC = ['#1c1410', '#3b2414', '#6b4423', '#c9a24a', '#8a8a8a', '#b5361e'];
function hairSVG(style, c) {
  const st = `fill="${c}" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"`;
  switch (style) {
    case 0: return `<path d="M23 44 Q21 14 50 14 Q79 14 77 44 Q66 28 50 29 Q34 28 23 44Z" ${st}/>`;
    case 1: return `<path d="M30 22 Q50 14 70 22" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".55"/>`;
    case 2: return `<g ${st}><circle cx="26" cy="36" r="12"/><circle cx="34" cy="22" r="13"/><circle cx="50" cy="17" r="13"/><circle cx="66" cy="22" r="13"/><circle cx="74" cy="36" r="12"/></g><path d="M30 38 Q50 26 70 38 L70 32 Q50 22 30 32Z" fill="${c}"/>`;
    case 3: return `<path d="M22 70 Q18 14 50 14 Q82 14 78 70 L70 70 Q72 38 66 34 Q50 26 34 34 Q28 38 30 70Z" ${st}/>`;
    case 4: return `<path d="M24 42 L26 22 L36 30 L42 12 L50 26 L58 12 L64 30 L74 22 L76 42 Q64 30 50 31 Q36 30 24 42Z" ${st}/>`;
    case 5: return `<circle cx="50" cy="12" r="9" ${st}/><path d="M23 44 Q21 16 50 16 Q79 16 77 44 Q66 30 50 31 Q34 30 23 44Z" ${st}/>`;
    default: return `<path d="M22 46 Q18 12 52 13 Q82 14 78 46 Q74 30 58 26 Q40 34 22 46Z" ${st}/>`;
  }
}
function cartoonPlayer(seed, c1, c2, pos) {
  const h = hash(seed), skin = pick(SKINS, h, 3), hc = pick(HAIRC, h, 7), hs = (h >>> 11) % 7, eye = (h >>> 15) % 3, mouth = (h >>> 18) % 3, brow = (h >>> 21) % 2;
  const gk = pos === 'GK', jersey = gk ? '#38b24d' : c1, trim = gk ? '#fff' : c2;
  const eyes = eye === 0 ? `<circle cx="40" cy="50" r="4" fill="#222"/><circle cx="60" cy="50" r="4" fill="#222"/><circle cx="41.5" cy="48.5" r="1.4" fill="#fff"/><circle cx="61.5" cy="48.5" r="1.4" fill="#fff"/>`
    : eye === 1 ? `<ellipse cx="40" cy="50" rx="4.5" ry="5.5" fill="#fff" stroke="${OUT}" stroke-width="2"/><ellipse cx="60" cy="50" rx="4.5" ry="5.5" fill="#fff" stroke="${OUT}" stroke-width="2"/><circle cx="41" cy="51" r="2.6" fill="#222"/><circle cx="61" cy="51" r="2.6" fill="#222"/>`
    : `<path d="M35 51 Q40 45 45 51" fill="none" stroke="#222" stroke-width="3" stroke-linecap="round"/><path d="M55 51 Q60 45 65 51" fill="none" stroke="#222" stroke-width="3" stroke-linecap="round"/>`;
  const mo = mouth === 0 ? `<path d="M41 62 Q50 71 59 62" fill="#fff" stroke="${OUT}" stroke-width="2.5" stroke-linejoin="round"/>`
    : mouth === 1 ? `<path d="M42 63 Q50 68 58 63" fill="none" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/>`
    : `<ellipse cx="50" cy="64" rx="4.5" ry="3.5" fill="#8a2b2b" stroke="${OUT}" stroke-width="2.5"/>`;
  const bw = brow ? `<path d="M34 42 L45 44 M66 42 L55 44" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/>` : '';
  const hair = hairSVG(hs, hc);
  const back = hs === 3 ? hair : '';
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6 100 Q8 76 34 74 L66 74 Q92 76 94 100Z" fill="${jersey}" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M38 74 L50 86 L62 74" fill="${trim}" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>
    <rect x="43" y="64" width="14" height="14" rx="4" fill="${skin}" stroke="${OUT}" stroke-width="3"/>
    ${back}
    <ellipse cx="50" cy="48" rx="27" ry="25" fill="${skin}" stroke="${OUT}" stroke-width="3"/>
    <ellipse cx="23.5" cy="50" rx="4" ry="6" fill="${skin}" stroke="${OUT}" stroke-width="3"/><ellipse cx="76.5" cy="50" rx="4" ry="6" fill="${skin}" stroke="${OUT}" stroke-width="3"/>
    ${hs === 3 ? '' : hair}
    ${bw}${eyes}
    <circle cx="33" cy="58" r="4" fill="#ff7b7b" opacity=".35"/><circle cx="67" cy="58" r="4" fill="#ff7b7b" opacity=".35"/>
    ${mo}</svg>`;
}

/* ----- 구단 만화 엠블럼 ----- */
function cartoonCrest(en, c1, c2) {
  const h = hash(en), p = h % 5, t = ink(c1);
  const abbr = en.replace(/^(FC|AC|AS|SS|RC|RB|VfB|VfL|SC|TSG|CA|RCD|AJ|SSC|OGC|1\.)\s+/i, '').replace(/[^A-Za-zÀ-ÿ ]/g, '').split(' ')[0].slice(0, 3).toUpperCase();
  const clip = 'M12 8 H88 V50 Q88 84 50 97 Q12 84 12 50Z';
  const pat = [
    `<rect x="12" y="8" width="76" height="92" fill="${c1}"/><g fill="${c2}"><rect x="28" y="8" width="11" height="92"/><rect x="61" y="8" width="11" height="92"/></g>`,
    `<rect x="12" y="8" width="38" height="92" fill="${c1}"/><rect x="50" y="8" width="38" height="92" fill="${c2}"/>`,
    `<rect x="12" y="8" width="76" height="92" fill="${c1}"/><rect x="12" y="46" width="76" height="20" fill="${c2}"/>`,
    `<rect x="12" y="8" width="76" height="92" fill="${c1}"/><path d="M12 30 L70 8 H88 V18 L30 100 H12Z" fill="${c2}" opacity=".9"/>`,
    `<rect x="12" y="8" width="76" height="92" fill="${c1}"/><path d="M12 56 L50 30 L88 56 V70 L50 46 L12 70Z" fill="${c2}"/>`
  ][p];
  return `<svg viewBox="0 0 100 106" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><clipPath id="cp${h}"><path d="${clip}"/></clipPath></defs>
    <g clip-path="url(#cp${h})">${pat}</g><path d="${clip}" fill="none" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M12 8 H88" stroke="${OUT}" stroke-width="4"/>
    <circle cx="50" cy="40" r="15" fill="#fff" stroke="${OUT}" stroke-width="3.5"/>
    <path d="M50 30 L58 36 L55 46 H45 L42 36Z" fill="${OUT}"/><path d="M50 25 V30 M58 36 L64 33 M55 46 L60 52 M45 46 L40 52 M42 36 L36 33" stroke="${OUT}" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="22" y="62" width="56" height="20" rx="6" fill="#fff" stroke="${OUT}" stroke-width="3.5"/>
    <text x="50" y="77" text-anchor="middle" font-size="15" font-weight="900" font-family="system-ui,sans-serif" fill="${OUT}">${abbr}</text>
    <path d="M50 -1 l3 7 7 .5 -5.5 4.5 2 7 -6.5 -4 -6.5 4 2 -7 -5.5 -4.5 7 -.5z" transform="translate(0 0) scale(.9) translate(5 -1)" fill="#ffd54a" stroke="${OUT}" stroke-width="2" stroke-linejoin="round"/></svg>`;
}

/* ----- 데이터 파싱 ----- */
const LG = LEAGUES.map(c => ({
  ...c, flagEmoji: flagOf(c.flag),
  clubs: c.raw.trim().split('\n').map((line, ci) => {
    const [ko, en, c1, c2, sq] = line.split(';');
    const players = sq.split(',').map((tok, si) => {
      if (tok === '-') return null;
      const [name, pos, foot, nat] = tok.split('/');
      return {id: `${c.code}-${ci}-${si}`, name, pos, foot, nat, flag: flagOf(nat), slot: si, club: ko, clubEn: en, c1, c2};
    });
    return {id: `${c.code}-${ci}`, ko, en, c1, c2, players, country: c.ko};
  })
}));

/* ----- 화면 ----- */
const lgState = {country: null, club: null, apiPlayers: {}};
const lgFind = {country: code => LG.find(c => c.code === code), club: id => LG.flatMap(c => c.clubs).find(c => c.id === id)};

function playerBadge(p) { return `<div class="av">${cartoonPlayer(p.name + p.clubEn, p.c1, p.c2, p.pos)}</div>`; }

function pitchSVG(club) {
  const pl = club.players.map((p, i) => {
    const [x, y] = SLOTS[i];
    if (!p) return `<div class="pp empty" style="left:${x}%;top:${y}%"><div class="av dashed">?</div><span class="pn">미등록</span><span class="pt">${SLOT_POS[i]}</span></div>`;
    return `<div class="pp" data-lp="${p.id}" style="left:${x}%;top:${y}%">${playerBadge(p)}<span class="pn">${esc(p.name)}</span><span class="pt">${esc(p.pos)}</span></div>`;
  }).join('');
  return `<div class="pitch"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <rect width="100" height="100" fill="#3c9d4a"/>${[0, 2, 4, 6, 8].map(i => `<rect y="${i * 10 + 0}" width="100" height="10" fill="#43a851"/>`).join('')}
    <g fill="none" stroke="#fff" stroke-width=".7" opacity=".9"><rect x="3" y="2" width="94" height="96"/><path d="M3 50H97"/><circle cx="50" cy="50" r="9"/>
    <rect x="25" y="2" width="50" height="16"/><rect x="38" y="2" width="24" height="6"/><rect x="25" y="82" width="50" height="16"/><rect x="38" y="92" width="24" height="6"/></g></svg>${pl}</div>`;
}

function renderLeague() {
  const side = LG.map(c => `<button class="ctry ${lgState.country === c.code ? 'on' : ''}" data-lc="${c.code}"><span class="fl">${c.flagEmoji}</span><span>${c.ko}<small>${c.league.replace(/\s*\(.*$/, '')}</small></span><em>${c.clubs.length}</em></button>`).join('');
  let main;
  if (lgState.club) main = clubView(lgFind.club(lgState.club));
  else if (lgState.country) main = countryView(lgFind.country(lgState.country));
  else main = `<div class="hero"><h2>나라를 골라보세요 ⚽</h2><p>왼쪽(모바일은 위쪽)에서 나라를 누르면 구단이 나오고,<br>구단을 누르면 선수 명단과 포지션 그림, 선수 카드를 볼 수 있어요.</p>
    <div class="ctry-big">${LG.map(c => `<button data-lc="${c.code}"><span>${c.flagEmoji}</span>${c.ko}</button>`).join('')}</div></div>`;
  $('#view').innerHTML = `<div class="lg"><aside>${side}</aside><section class="lgmain">${main}</section></div>`;
}

function countryBanner(c) {
  const h = hash(c.code), g1 = ['#2e7d32', '#1565c0', '#6a1b9a', '#c62828', '#00838f', '#ef6c00'][h % 6];
  return `<div class="banner" style="--g:${g1}"><svg viewBox="0 0 600 140" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <rect width="600" height="140" fill="${g1}"/><circle cx="470" cy="40" r="26" fill="#ffd54a" stroke="#222" stroke-width="4"/>
    <path d="M0 110 Q150 70 300 100 T600 90 V140 H0Z" fill="#43a851" stroke="#222" stroke-width="4"/>
    <path d="M330 118 L350 78 H450 L470 118Z" fill="#fff" stroke="#222" stroke-width="4" stroke-linejoin="round"/><path d="M345 118 L360 90 H440 L455 118Z" fill="#43a851" stroke="#222" stroke-width="3"/>
    <circle cx="520" cy="112" r="14" fill="#fff" stroke="#222" stroke-width="4"/><path d="M520 104 l7 5 -3 8 h-8 l-3 -8z" fill="#222"/></svg>
    <div class="bn-t"><span>${c.flagEmoji}</span><div><h2>${c.ko}</h2><p>${c.league} · 구단 ${c.clubs.length}개</p></div></div></div>`;
}
function countryView(c) {
  return `${countryBanner(c)}<p class="sub">구단과 대표 선수 이름이 한눈에 보여요 · 구단을 누르면 포메이션 그림과 선수 카드가 열립니다</p>
  <div class="crests">${c.clubs.map(cl => {
    const names = cl.players.filter(Boolean);
    return `<button class="crest" data-lclub="${cl.id}">${cartoonCrest(cl.en, cl.c1, cl.c2)}<b>${esc(cl.ko)}</b><small>${esc(cl.en)}</small>
      <div class="names">${names.length ? names.map(p => `<span><em>${esc(p.pos)}</em>${esc(p.name)}</span>`).join('') : '<i>선수 정보 준비 중</i>'}</div></button>`;
  }).join('')}</div>`;
}

function clubView(cl) {
  const c = lgFind.country(cl.id.split('-')[0]);
  const list = cl.players.filter(Boolean);
  const api = lgState.apiPlayers[cl.id];
  return `<div class="crumb"><button data-lback="country">← ${c.ko}</button></div>
  <div class="chead" style="--c1:${cl.c1};--c2:${cl.c2}"><div class="cr">${cartoonCrest(cl.en, cl.c1, cl.c2)}</div><div><h2>${esc(cl.ko)}</h2><p>${esc(cl.en)} · ${c.flagEmoji} ${c.ko}</p></div></div>
  <h3 class="sec2">포메이션 4-3-3</h3>${pitchSVG(cl)}
  <p class="hint">선수를 누르면 카드가 열려요. 점선 칸은 아직 등록되지 않은 자리입니다.</p>
  <h3 class="sec2">선수 명단 (${list.length}명)</h3>
  ${list.length ? `<div class="roster">${list.map(p => `<div class="rrow" data-lp="${p.id}">${playerBadge(p)}<div><b>${esc(p.name)}</b><small>${p.flag} ${POSITIONS[p.pos] || p.pos}</small></div><span class="pos">${esc(p.pos)}</span><span class="ft">${FOOT[p.foot] || '-'}</span></div>`).join('')}</div>` : '<p class="hint">등록된 선수가 없어요. 아래 버튼으로 API에서 불러올 수 있어요.</p>'}
  <div class="panel"><h3>API로 선수단 불러오기</h3><p>TheSportsDB에서 이 구단의 선수 목록을 가져와 만화 카드로 보여줍니다. (인터넷 필요)</p>
    <button class="pri" data-lapi="${cl.id}">불러오기</button><div id="apisq">${api ? apiRoster(api) : ''}</div></div>`;
}

function apiRoster(list) {
  if (!list.length) return '<p class="hint">결과가 없어요</p>';
  return `<div class="roster">${list.map(p => `<div class="rrow" data-lp="${p.id}">${playerBadge(p)}<div><b>${esc(p.name)}</b><small>${p.flag} ${POSITIONS[p.pos] || p.pos}</small></div><span class="pos">${esc(p.pos)}</span><span class="ft">${FOOT[p.foot] || '-'}</span></div>`).join('')}</div>`;
}

async function loadApiSquad(id) {
  const cl = lgFind.club(id), box = $('#apisq');
  box.innerHTML = '<p class="hint">불러오는 중…</p>';
  try {
    const t = await api('searchteams.php?t=' + encodeURIComponent(cl.en.replace(/\s+/g, '_')));
    const team = (t.teams || []).find(x => x.strSport === 'Soccer');
    if (!team) throw new Error('구단을 찾지 못했어요');
    const r = await api('lookup_all_players.php?id=' + team.idTeam);
    lgState.apiPlayers[id] = (r.player || []).map(x => ({
      id: 'api-' + x.idPlayer, name: x.strPlayer, pos: mapPos(x.strPosition), foot: x.strSide === 'Left' ? 'L' : x.strSide === 'Right' ? 'R' : '',
      nat: '', flag: '🌍', nation: x.strNationality, born: (x.dateBorn || '').slice(0, 4), club: cl.ko, clubEn: cl.en, c1: cl.c1, c2: cl.c2, rawPos: x.strPosition
    }));
    box.innerHTML = apiRoster(lgState.apiPlayers[id]);
  } catch (e) { box.innerHTML = `<p class="hint">불러오기 실패: ${esc(e.message)}</p>`; }
}

/* ----- 선수 카드 ----- */
const lgPlayerById = id => LG.flatMap(c => c.clubs).flatMap(c => c.players).find(x => x && x.id === id) || Object.values(lgState.apiPlayers).flat().find(x => x.id === id);
function openLgPlayer(id) {
  const p = lgPlayerById(id);
  if (!p) return;
  delete $('#dlg').dataset.prof;
  const foot = p.foot, role = ROLE[p.pos] || '';
  $('#dlg').innerHTML = `<div class="lcard" style="--c1:${p.c1};--c2:${p.c2}">
    <button class="x" aria-label="닫기">×</button>
    <div class="lc-top"><span class="lc-pos">${esc(p.pos)}</span><span class="lc-flag">${p.flag}</span></div>
    <div class="lc-art">${cartoonPlayer(p.name + p.clubEn, p.c1, p.c2, p.pos)}</div>
    <div class="lc-name">${esc(p.name)}</div>
    <div class="lc-club">${esc(p.club)}</div>
    <div class="lc-info">
      <div><small>포지션</small><b>${POSITIONS[p.pos] || p.pos}</b></div>
      <div><small>주발</small><b>${FOOT[foot] || '정보 없음'}</b></div>
      <div><small>국적</small><b>${p.flag} ${esc(p.nation || NATION[p.nat] || p.nat || '-')}</b></div>
      ${p.born ? `<div><small>출생</small><b>${esc(p.born)}년</b></div>` : ''}
    </div>
    <div class="feet"><span class="${foot === 'L' || foot === 'B' ? 'hl' : ''}">왼발</span><span class="${foot === 'R' || foot === 'B' ? 'hl' : ''}">오른발</span></div>
    <div class="lc-role"><small>역할</small>${role}</div>
    <button class="pri prof-btn" data-prof="${esc(p.id)}">📋 선수 프로파일 보기</button>
    <p class="lc-note">만화 캐릭터는 실제 모습과 무관한 일러스트입니다.</p></div>`;
  if (!$('#dlg').open) $('#dlg').showModal();
}

/* ----- 이벤트 ----- */
document.addEventListener('click', e => {
  const t = e.target;
  let el;
  if ((el = t.closest('[data-lc]'))) { lgState.country = el.dataset.lc; lgState.club = null; if (tab === 'league') renderLeague(); window.scrollTo({top: 0}); }
  else if ((el = t.closest('[data-lclub]'))) { lgState.club = el.dataset.lclub; renderLeague(); window.scrollTo({top: 0}); }
  else if ((el = t.closest('[data-lback]'))) { lgState.club = null; renderLeague(); }
  else if ((el = t.closest('[data-lapi]'))) loadApiSquad(el.dataset.lapi);
  else if ((el = t.closest('[data-lp]'))) openLgPlayer(el.dataset.lp);
});
