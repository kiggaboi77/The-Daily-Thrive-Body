const UI = {
  ko: { title: "미국 낚시 배 예약", region: "지역 선택", season: "시즌", fishBtn: "물고기 고르기", boatType: "배 종류", boats: "배 목록", reports: "최근 피싱 리포트",
    reportNote: "검색으로 확인된 리포트만 출처 링크와 함께 표시합니다. '작년' 표시는 올해 자료가 없어 계절 참고용입니다. 출항 전 업체에 확인하세요.",
    all: "전체", noBoat: "조건에 맞는 배가 없습니다.", perPerson: "인당", perBoat: "배 전체", info: "배 정보", book: "예약하기", source: "출처",
    length: "길이", cap: "정원", ft: "ft", people: "명", amen: "시설/장비", reviews: "리뷰", call: "전화", mail: "이메일", bookTitle: "예약 문의",
    bookHint: "전화나 이메일로 날짜·인원을 문의하세요.", port: "항구", fishes: "대상 어종", trips: "출항 시간 · 가격", seasonal: "작년 자료", sample: "샘플 데이터",
    footer: "배·가격·연락처·리뷰는 샘플 데이터입니다. 실제 업체 정보로 교체 후 사용하세요.",
    k: { half: "반나절", full: "종일", ext: "연장/숙박", night: "야간" },
    a: { rod: "낚싯대 대여", bait: "미끼 제공", galley: "매점", cabin: "선실", ice: "얼음/쿨러", ac: "에어컨" } },
  en: { title: "US Fishing Boat Booking", region: "Region", season: "Season", fishBtn: "Pick a fish", boatType: "Boat type", boats: "Boats", reports: "Recent fishing reports",
    reportNote: "Only reports found via search are shown, with source links. “Last year” means no current data was found and it is seasonal reference. Confirm with the operator before you go.",
    all: "All", noBoat: "No boats match.", perPerson: "per person", perBoat: "whole boat", info: "Boat info", book: "Book now", source: "Source",
    length: "Length", cap: "Capacity", ft: "ft", people: "people", amen: "Amenities", reviews: "Reviews", call: "Call", mail: "Email", bookTitle: "Book this trip",
    bookHint: "Call or email to ask about dates and group size.", port: "Port", fishes: "Target fish", trips: "Trip times · prices", seasonal: "Last year", sample: "Sample data",
    footer: "Boats, prices, contacts and reviews are sample data. Replace with real operator info before use.",
    k: { half: "Half day", full: "Full day", ext: "Extended / overnight", night: "Night" },
    a: { rod: "Rod rental", bait: "Bait included", galley: "Galley", cabin: "Cabin", ice: "Ice / cooler", ac: "A/C" } },
  es: { title: "Reserva de barcos de pesca EE.UU.", region: "Región", season: "Temporada", fishBtn: "Elige un pez", boatType: "Tipo de barco", boats: "Barcos", reports: "Reportes de pesca recientes",
    reportNote: "Solo se muestran reportes encontrados en la búsqueda, con enlace a la fuente. “Año pasado” es referencia estacional. Confirma con el operador antes de ir.",
    all: "Todos", noBoat: "No hay barcos que coincidan.", perPerson: "por persona", perBoat: "barco completo", info: "Info del barco", book: "Reservar", source: "Fuente",
    length: "Eslora", cap: "Capacidad", ft: "pies", people: "personas", amen: "Servicios", reviews: "Reseñas", call: "Llamar", mail: "Correo", bookTitle: "Reservar este viaje",
    bookHint: "Llama o escribe para consultar fechas y número de personas.", port: "Puerto", fishes: "Especies", trips: "Horarios · precios", seasonal: "Año pasado", sample: "Datos de ejemplo",
    footer: "Barcos, precios, contactos y reseñas son datos de ejemplo. Sustituye por datos reales antes de usar.",
    k: { half: "Medio día", full: "Día completo", ext: "Extendido / noche", night: "Nocturno" },
    a: { rod: "Alquiler de caña", bait: "Carnada incluida", galley: "Cafetería", cabin: "Camarote", ice: "Hielo / nevera", ac: "A/C" } }
};

function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} }
const $ = id => document.getElementById(id);
const state = { lang: store("lang") || "ko", region: "east", season: seasonOf(new Date()), fish: null, type: null };
function seasonOf(d) { const m = d.getMonth() + 1; return Object.keys(DATA.seasons).find(s => DATA.seasons[s].m.includes(m)); }
const t = () => UI[state.lang];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const stars = n => "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));
const fishName = f => f[state.lang];
const chip = (label, on, attr, extra = "") => `<button class="chip ${extra} ${on ? "on" : ""}" ${attr}>${label}</button>`;

function render() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll("[data-i]").forEach(el => el.textContent = t()[el.dataset.i]);
  $("lang").innerHTML = [["ko", "한국어"], ["en", "English"], ["es", "Español"]].map(([c, n]) => `<button class="${state.lang === c ? "on" : ""}" data-lang="${c}">${n}</button>`).join("");
  $("regions").innerHTML = Object.keys(DATA.regions).map(r => chip(DATA.regions[r][state.lang], state.region === r, `data-region="${r}"`)).join("");
  $("seasons").innerHTML = Object.keys(DATA.seasons).map(s => chip(DATA.seasons[s][state.lang], state.season === s, `data-season="${s}"`)).join("");

  const inSeason = DATA.fish.filter(f => (f.s[state.region] || []).includes(state.season));
  if (state.fish && !inSeason.some(f => f.id === state.fish)) state.fish = null;
  $("fish").innerHTML = chip(t().all, !state.fish, `data-fish=""`) + inSeason.map(f => chip(`<span class="e">${f.e}</span>${fishName(f)}`, state.fish === f.id, `data-fish="${f.id}"`, "fish")).join("");
  $("types").innerHTML = chip(t().all, !state.type, `data-type=""`) + Object.keys(DATA.types).map(k => chip(DATA.types[k][state.lang], state.type === k, `data-type="${k}"`)).join("");

  const boats = DATA.boats.filter(b => b.region === state.region && (!state.type || b.type === state.type) &&
    (state.fish ? b.fish.includes(state.fish) : b.fish.some(id => inSeason.some(f => f.id === id))));
  $("boats").innerHTML = boats.length ? boats.map(boatCard).join("") : `<p class="muted">${t().noBoat}</p>`;

  $("reports").innerHTML = DATA.reports.filter(r => r.region === state.region).map(r => `
    <div class="card rep"><div class="muted">${r.date}${r.seasonal ? ` · <b>${t().seasonal}</b>` : ""}</div>
    <div>${esc(r[state.lang])}</div><div class="muted">${t().source}: <a href="${r.url}" target="_blank" rel="noopener">${esc(r.src)}</a></div></div>`).join("");
}

function boatCard(b) {
  const unitFor = b.type === "charter" ? t().perBoat : t().perPerson;
  return `<div class="card"><h3>${esc(b.name)}</h3>
    <div class="muted">📍 ${esc(b.port)} · <span class="stars">${stars(b.rating)}</span> ${b.rating} (${b.reviews.length})</div>
    <div>${DATA.types[b.type][state.lang]}</div>
    <div>${b.fish.map(id => `<span class="tag">${fishName(DATA.fish.find(f => f.id === id))}</span>`).join("")}</div>
    <table>${b.trips.map(x => `<tr><td>${t().k[x.k]} · ${x.t}</td><td>$${x.p} <span class="muted">${unitFor}</span></td></tr>`).join("")}</table>
    <div class="btns"><button class="act info" data-info="${b.id}">${t().info}</button><button class="act book" data-book="${b.id}">${t().book}</button></div></div>`;
}

function openModal(html) { $("mbody").innerHTML = html; $("modal").classList.add("open"); }

function showInfo(b) {
  openModal(`<h2>${esc(b.name)}</h2><p class="muted">📍 ${esc(b.port)} · ${t().sample}</p>
    <p>${t().length}: ${b.length} ${t().ft} · ${t().cap}: ${b.cap} ${t().people}</p>
    <p><b>${t().amen}</b><br>${b.amen.map(a => `<span class="tag">${t().a[a]}</span>`).join("")}</p>
    <p><b>${t().fishes}</b><br>${b.fish.map(id => `<span class="tag">${fishName(DATA.fish.find(f => f.id === id))}</span>`).join("")}</p>
    <p><b>${t().reviews}</b> <span class="stars">${stars(b.rating)}</span> ${b.rating}</p>
    ${b.reviews.map(r => `<div class="review"><b>${esc(r.n)}</b> <span class="stars">${stars(r.s)}</span> <span class="muted">${r.d}</span><br>${esc(r.t)}</div>`).join("")}
    <div class="btns" style="margin-top:12px"><button class="act book" data-book="${b.id}">${t().book}</button></div>`);
}

function showBook(b) {
  const tel = b.phone.replace(/[^+\d]/g, "");
  openModal(`<h2>${t().bookTitle}</h2><h3>${esc(b.name)}</h3><p class="muted">${t().bookHint}</p>
    <div class="contact"><div>📞 ${t().call}</div><a href="tel:${tel}">${esc(b.phone)}</a>
    <div>✉️ ${t().mail}</div><a href="mailto:${esc(b.email)}?subject=${encodeURIComponent(b.name)}">${esc(b.email)}</a></div>
    <p class="muted">${t().sample}</p>`);
}

document.addEventListener("click", e => {
  const d = e.target.closest("button, .modal"); if (!d) return;
  const ds = d.dataset || {};
  if (d.id === "modal" || d.id === "close") return $("modal").classList.remove("open");
  if (ds.lang) { state.lang = ds.lang; store("lang", ds.lang); }
  else if (ds.region) { state.region = ds.region; state.fish = null; }
  else if (ds.season) { state.season = ds.season; }
  else if ("fish" in ds) { state.fish = ds.fish || null; }
  else if ("type" in ds) { state.type = ds.type || null; }
  else if (ds.info) return showInfo(DATA.boats.find(b => b.id === ds.info));
  else if (ds.book) return showBook(DATA.boats.find(b => b.id === ds.book));
  else return;
  render();
});
render();
