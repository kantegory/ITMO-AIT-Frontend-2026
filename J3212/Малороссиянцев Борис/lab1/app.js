'use strict';

const Store = {
  get(k, fb = null) {
    try { const r = localStorage.getItem('wl_' + k); return r !== null ? JSON.parse(r) : fb; }
    catch { return fb; }
  },
  set(k, v) { try { localStorage.setItem('wl_' + k, JSON.stringify(v)); } catch {} },
  push(k, item, fb = []) { const a = this.get(k, fb); a.unshift(item); this.set(k, a); return a; },
  remove(k, pred) { const a = this.get(k, []).filter(x => !pred(x)); this.set(k, a); return a; },
};

const UNS = 'https://images.unsplash.com/photo-';
const DESTINATIONS = [
  { id: 'paris',      emoji: '🗼', name: 'Париж',      country: 'Франция',          continent: 'Европа',  type: 'city',   typeLabel: 'Город',   days: '7 дней',  daysNum: 7,  price: '€80/д',  priceNum: 8000,  rating: 4.9, reviews: 2341, photo: UNS + '1502602898657-3e91760cbb34?w=600&h=400&fit=crop&auto=format&q=80',  tags: ['Культура', 'Романтика'] },
  { id: 'tokyo',      emoji: '🗾', name: 'Токио',       country: 'Япония',           continent: 'Азия',    type: 'city',   typeLabel: 'Город',   days: '9 дней',  daysNum: 9,  price: '€85/д',  priceNum: 8500,  rating: 4.9, reviews: 3654, photo: UNS + '1540959733332-eab4deabeeaf?w=600&h=400&fit=crop&auto=format&q=80',  tags: ['Технологии', 'Кухня'] },
  { id: 'maldives',   emoji: '🌊', name: 'Мальдивы',    country: 'Мальдивы',         continent: 'Азия',    type: 'beach',  typeLabel: 'Пляж',    days: '8 дней',  daysNum: 8,  price: '€200/д', priceNum: 20000, rating: 5.0, reviews: 3201, photo: UNS + '1514282401047-d79a71a590e8?w=600&h=400&fit=crop&auto=format&q=80',  tags: ['Пляж', 'Дайвинг'] },
  { id: 'patagonia',  emoji: '🏔', name: 'Патагония',   country: 'Чили / Аргентина', continent: 'Америка', type: 'nature', typeLabel: 'Природа', days: '14 дней', daysNum: 14, price: '€50/д',  priceNum: 5000,  rating: 4.9, reviews: 934,  photo: UNS + '1501854140801-50d01698950b?w=600&h=400&fit=crop&auto=format&q=80',  tags: ['Трекинг', 'Горы'] },
  { id: 'bali',       emoji: '🏖', name: 'Бали',         country: 'Индонезия',        continent: 'Азия',    type: 'beach',  typeLabel: 'Пляж',    days: '12 дней', daysNum: 12, price: '€40/д',  priceNum: 4000,  rating: 4.8, reviews: 4201, photo: UNS + '1537996194471-e657df975ab4?w=600&h=400&fit=crop&auto=format&q=80',  tags: ['Пляж', 'Серфинг'] },
  { id: 'iceland',    emoji: '🌋', name: 'Исландия',     country: 'Исландия',         continent: 'Европа',  type: 'nature', typeLabel: 'Природа', days: '7 дней',  daysNum: 7,  price: '€120/д', priceNum: 12000, rating: 4.9, reviews: 1543, photo: UNS + '1476610182048-b716b8518aae?w=600&h=400&fit=crop&auto=format&q=80',  tags: ['Северное сияние', 'Природа'] },
  { id: 'rome',       emoji: '🏛', name: 'Рим',           country: 'Италия',           continent: 'Европа',  type: 'city',   typeLabel: 'Город',   days: '5 дней',  daysNum: 5,  price: '€90/д',  priceNum: 9000,  rating: 4.7, reviews: 2109, photo: UNS + '1552832230-c0197dd311b5?w=600&h=400&fit=crop&auto=format&q=80',  tags: ['История', 'Кухня'] },
  { id: 'kenya',      emoji: '🦁', name: 'Кения',         country: 'Кения',            continent: 'Африка',  type: 'nature', typeLabel: 'Природа', days: '10 дней', daysNum: 10, price: '€150/д', priceNum: 15000, rating: 4.9, reviews: 876,  photo: UNS + '1516426122078-c23e76319801?w=600&h=400&fit=crop&auto=format&q=80',  tags: ['Сафари', 'Животные'] },
  { id: 'santorini',  emoji: '🌅', name: 'Санторини',     country: 'Греция',           continent: 'Европа',  type: 'beach',  typeLabel: 'Пляж',    days: '6 дней',  daysNum: 6,  price: '€100/д', priceNum: 10000, rating: 4.8, reviews: 2987, photo: UNS + '1533105079780-92b9be482077?w=600&h=400&fit=crop&auto=format&q=80',  tags: ['Пляж', 'Романтика'] },
  { id: 'cappadocia', emoji: '🎈', name: 'Каппадокия',    country: 'Турция',           continent: 'Азия',    type: 'nature', typeLabel: 'Природа', days: '4 дня',   daysNum: 4,  price: '€50/д',  priceNum: 5000,  rating: 4.9, reviews: 2234, photo: UNS + '1541432901042-2d8bd64b4a9b?w=600&h=400&fit=crop&auto=format&q=80',  tags: ['Воздушные шары', 'Фото'] },
];

const filters = { type: 'all', query: '', maxBudget: 50000, sort: 'popular' };

function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
const MON = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
function todayShort() { const d = new Date(); return `${d.getDate()} ${MON[d.getMonth()]}`; }
function fmtDate(s) { if (!s) return ''; return new Date(s).toLocaleDateString('ru', {day:'numeric',month:'short'}); }

function showToast(msg, type = 'success') {
  let box = document.getElementById('toastBox');
  if (!box) {
    box = document.createElement('div'); box.id = 'toastBox';
    box.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:.5rem;';
    document.body.appendChild(box);
  }
  const C = {
    success: { bg:'#f0fdf4', brd:'#bbf7d0', ic:'✓', col:'#16a34a' },
    error:   { bg:'#fef2f2', brd:'#fecaca', ic:'✕', col:'#dc2626' },
    info:    { bg:'#f0f9ff', brd:'#bae6fd', ic:'i', col:'#0284c7' },
  };
  const c = C[type] || C.info;
  if (!document.getElementById('toastCSS')) {
    const s = document.createElement('style'); s.id = 'toastCSS';
    s.textContent = '@keyframes tIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@keyframes tOut{to{opacity:0;transform:translateY(8px)}}';
    document.head.appendChild(s);
  }
  const t = document.createElement('div');
  t.style.cssText = `background:${c.bg};border:1px solid ${c.brd};color:${c.col};padding:.6rem 1rem;border-radius:10px;font-size:.875rem;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:.5rem;min-width:200px;box-shadow:0 4px 16px rgba(0,0,0,.08);animation:tIn .22s ease forwards;`;
  t.innerHTML = `<span style="font-weight:700;">${c.ic}</span>${msg}`;
  box.appendChild(t);
  setTimeout(() => { t.style.animation = 'tOut .22s ease forwards'; setTimeout(() => t.remove(), 230); }, 2600);
}

function togglePassword(id, btn) {
  const el = document.getElementById(id); if (!el) return;
  const s = el.type === 'password'; el.type = s ? 'text' : 'password';
  const i = btn.querySelector('i') || btn;
  i.className = s ? i.className.replace('bi-eye','bi-eye-slash') : i.className.replace('bi-eye-slash','bi-eye');
}

function updateStrength(input, barId, labelId) {
  const bar = document.getElementById(barId), lbl = document.getElementById(labelId); if (!bar || !lbl) return;
  const v = input.value; let s = 0;
  if (v.length >= 8) s++; if (/[A-Z]/.test(v)) s++; if (/[0-9]/.test(v)) s++; if (/[^A-Za-z0-9]/.test(v)) s++;
  const L = [{w:'0%',c:'transparent',t:''},{w:'25%',c:'#ef4444',t:'Слабый'},{w:'50%',c:'#f97316',t:'Средний'},{w:'75%',c:'#eab308',t:'Хороший'},{w:'100%',c:'#22c55e',t:'Отличный'}];
  bar.style.width = L[s].w; bar.style.background = L[s].c; lbl.textContent = L[s].t;
}

function initStarRating(id) {
  const box = document.getElementById(id); if (!box) return;
  const stars = [...box.querySelectorAll('span')]; let sel = 0;
  const hl = u => stars.forEach((s,i) => { s.textContent = i <= u ? '★' : '☆'; s.style.color = i <= u ? '#f59e0b' : '#d1d5db'; });
  stars.forEach((s, i) => { s.addEventListener('mouseover', () => hl(i)); s.addEventListener('mouseout', () => hl(sel-1)); s.addEventListener('click', () => { sel = i+1; hl(i); box.dataset.rating = sel; }); });
}
function initTooltips() { document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el)); }
function initChips() {
  document.querySelectorAll('[data-chips-group]').forEach(g => {
    const multi = g.dataset.chipsGroup === 'multi';
    g.querySelectorAll('.filter-chip').forEach(c => c.addEventListener('click', () => {
      if (!multi) g.querySelectorAll('.filter-chip').forEach(x => x.classList.remove('active','selected'));
      c.classList.toggle('active'); c.classList.toggle('selected');
    }));
  });
}
function copyToClipboard(text, btn) {
  navigator.clipboard?.writeText(text).then(() => {
    const o = btn.innerHTML; btn.innerHTML = '<i class="bi bi-check2"></i>';
    setTimeout(() => btn.innerHTML = o, 2000); showToast('Ссылка скопирована!');
  });
}

function initLoginPage() {
  document.querySelectorAll('.password-toggle').forEach(btn => btn.addEventListener('click', () => togglePassword(btn.dataset.target, btn)));
  
}

function initRegisterPage() {
  document.querySelectorAll('.password-toggle').forEach(btn => btn.addEventListener('click', () => togglePassword(btn.dataset.target, btn)));
  const pi = document.getElementById('regPassword');
  pi?.addEventListener('input', () => updateStrength(pi, 'strengthBar', 'strengthLabel'));
  
}

function initDashboardPage() {
  renderNotes();
  document.getElementById('saveNoteBtn')?.addEventListener('click', () => {
    const title = document.getElementById('noteTitle')?.value.trim();
    const text  = document.getElementById('noteText')?.value.trim();
    const dest  = document.getElementById('noteDestination')?.value || '';
    if (!title) { showToast('Введите заголовок', 'error'); return; }
    Store.push('notes', { id: Date.now(), title, text, dest, date: todayShort() }, []);
    renderNotes(); showToast('Заметка сохранена!');
    document.getElementById('noteTitle').value = ''; document.getElementById('noteText').value = '';
    bootstrap.Modal.getInstance(document.getElementById('noteModal'))?.hide();
  });
}

const DEMO_NOTES_HTML = `
  <div class="note-item">
    <div class="d-flex justify-content-between mb-1">
      <strong style="font-size:.875rem;">🗼 Лучший вид на Эйфелеву башню</strong>
      <span style="font-size:.75rem;color:var(--text-light);">12 июня</span>
    </div>
    <p style="font-size:.82rem;color:var(--text-muted);margin:0;">Трокадеро на рассвете — никаких толп, золотой свет...</p>
  </div>
  <div class="note-item" style="border-left-color:var(--warm);">
    <div class="d-flex justify-content-between mb-1">
      <strong style="font-size:.875rem;">🍜 Рамэн в Киото</strong>
      <span style="font-size:.75rem;color:var(--text-light);">15 сент.</span>
    </div>
    <p style="font-size:.82rem;color:var(--text-muted);margin:0;">Ippudo на Каварамати — тонкоцу рамэн, топ...</p>
  </div>
  <div class="note-item">
    <div class="d-flex justify-content-between mb-1">
      <strong style="font-size:.875rem;">💡 Лайфхак: аэропорт CDG</strong>
      <span style="font-size:.75rem;color:var(--text-light);">10 июня</span>
    </div>
    <p style="font-size:.82rem;color:var(--text-muted);margin:0;">Терминал 2E зал L — тихий, есть душевые...</p>
  </div>`;

function renderNotes() {
  const list = document.getElementById('notesList'); if (!list) return;
  const notes = Store.get('notes', []);
  if (!notes.length) { list.innerHTML = DEMO_NOTES_HTML; return; }
  list.innerHTML = notes.map(n => `
    <div class="note-item">
      <div class="d-flex justify-content-between align-items-start mb-1">
        <strong style="font-size:.875rem;">✏️ ${esc(n.title)}</strong>
        <div class="d-flex align-items-center gap-2">
          <span style="font-size:.75rem;color:var(--text-light);">${n.date}</span>
          <button onclick="deleteNote(${n.id})" style="background:none;border:none;color:var(--text-light);cursor:pointer;padding:0;font-size:.9rem;line-height:1;"><i class="bi bi-x"></i></button>
        </div>
      </div>
      ${n.dest ? `<div style="font-size:.75rem;color:var(--accent);margin-bottom:.2rem;">${esc(n.dest)}</div>` : ''}
      ${n.text ? `<p style="font-size:.82rem;color:var(--text-muted);margin:0;">${esc(n.text)}</p>` : ''}
    </div>`).join('') + `<button class="btn-ghost-custom w-100 mt-2" style="font-size:.8rem;justify-content:center;">Все заметки (${notes.length})</button>`;
}
function deleteNote(id) { Store.remove('notes', n => n.id === id); renderNotes(); showToast('Заметка удалена', 'info'); }

function initSearchPage() {
  renderDestinations();
  const inp = document.getElementById('mainSearch');
  inp?.addEventListener('input', () => { filters.query = inp.value.toLowerCase().trim(); renderDestinations(); });
  const sl = document.getElementById('budgetSlider'), ve = document.getElementById('budgetVal');
  sl?.addEventListener('input', () => { filters.maxBudget = +sl.value; if (ve) ve.textContent = Number(sl.value).toLocaleString('ru') + ' ₽'; renderDestinations(); });
  document.querySelectorAll('[data-type-chip]').forEach(c => c.addEventListener('click', () => {
    document.querySelectorAll('[data-type-chip]').forEach(x => x.classList.remove('active','selected'));
    c.classList.add('active','selected'); filters.type = c.dataset.typeChip; renderDestinations();
  }));
  document.getElementById('sortSelect')?.addEventListener('change', function() { filters.sort = this.value; renderDestinations(); });
  document.getElementById('resetFilters')?.addEventListener('click', () => {
    filters.type = 'all'; filters.query = ''; filters.maxBudget = 50000; filters.sort = 'popular';
    if (inp) inp.value = ''; if (sl) { sl.value = 50000; if (ve) ve.textContent = '50 000 ₽'; }
    const ss = document.getElementById('sortSelect'); if (ss) ss.value = 'popular';
    document.querySelectorAll('[data-type-chip]').forEach((c,i) => { c.classList.toggle('active',i===0); c.classList.toggle('selected',i===0); });
    renderDestinations(); showToast('Фильтры сброшены', 'info');
  });
}

function renderDestinations() {
  const grid = document.getElementById('destGrid'), countEl = document.getElementById('destCount'); if (!grid) return;
  let list = DESTINATIONS.filter(d => {
    
    const effectiveType = d.type === 'beach' ? 'nature' : d.type;
    if (filters.type !== 'all' && effectiveType !== filters.type) return false;
    if (filters.query) { const q = filters.query; if (![d.name,d.country,d.continent||'',...d.tags].some(x => x.toLowerCase().includes(q))) return false; }
    if (d.priceNum > filters.maxBudget) return false;
    return true;
  });
  switch (filters.sort) {
    case 'price_asc':     list = [...list].sort((a,b) => a.priceNum - b.priceNum); break;
    case 'price_desc':    list = [...list].sort((a,b) => b.priceNum - a.priceNum); break;
    case 'rating':        list = [...list].sort((a,b) => b.rating   - a.rating);   break;
    case 'duration_asc':  list = [...list].sort((a,b) => a.daysNum  - b.daysNum);  break;
    case 'duration_desc': list = [...list].sort((a,b) => b.daysNum  - a.daysNum);  break;
    default: list = [...list].sort((a,b) => b.reviews - a.reviews);
  }
  if (countEl) countEl.textContent = list.length;
  if (!list.length) {
    grid.innerHTML = `<div class="col-12 text-center py-5" style="color:var(--text-muted);"><div style="font-size:2.5rem;margin-bottom:1rem;opacity:.3;">🔍</div><p>Ничего не найдено — попробуйте изменить фильтры</p><button class="btn-ghost-custom mt-2" style="margin:auto;" onclick="document.getElementById('resetFilters').click()">Сбросить</button></div>`;
    return;
  }
  const saved = Store.get('savedRoutes', []);
  grid.innerHTML = list.map(d => {
    const sv = saved.includes(d.id);
    return `<div class="col-sm-6 col-xl-4">
      <div class="dest-card" onclick="location.href='destination.html'">
        <div class="dest-card-img">
          <img src="${d.photo}" alt="${d.name}" loading="lazy" onerror="this.style.display='none'" />
          <div class="dest-card-overlay"></div>
          <div class="dest-card-badge"><span class="tag tag-dark" style="font-size:.72rem;">★ ${d.rating.toFixed(1)}</span></div>
        </div>
        <div class="dest-card-body">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <strong style="font-size:.95rem;">${d.name}</strong>
              <div style="font-size:.78rem;color:var(--text-muted);">${d.country}</div>
            </div>
            <div style="text-align:right;flex-shrink:0;">
              <div style="font-size:.82rem;color:var(--accent);font-weight:600;">${d.price}</div>
              <div style="font-size:.72rem;color:var(--text-light);">${d.days}</div>
            </div>
          </div>
          <div class="d-flex gap-1 flex-wrap">${[d.typeLabel,...d.tags].map(t => `<span class="tag" style="font-size:.7rem;">${t}</span>`).join('')}</div>
          <div class="d-flex gap-2 mt-1">
            <button class="btn-primary-custom flex-1" style="font-size:.78rem;padding:.35rem .5rem;justify-content:center;" onclick="event.stopPropagation();location.href='destination.html'">Открыть</button>
            <button class="${sv ? 'btn-primary-custom' : 'btn-outline-custom'}" style="font-size:.78rem;padding:.35rem .6rem;" onclick="event.stopPropagation();toggleSave(this,'${d.id}','${d.name}')" title="${sv ? 'Убрать' : 'Сохранить'}"><i class="bi bi-bookmark${sv ? '-fill' : ''}"></i></button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

function toggleSave(btn, id, name) {
  let saved = Store.get('savedRoutes', []);
  if (saved.includes(id)) { saved = saved.filter(x => x !== id); btn.className = 'btn-outline-custom'; btn.innerHTML = '<i class="bi bi-bookmark"></i>'; showToast(`${name} убран`, 'info'); }
  else { saved.push(id); btn.className = 'btn-primary-custom'; btn.innerHTML = '<i class="bi bi-bookmark-fill"></i>'; showToast(`${name} сохранён!`); }
  Store.set('savedRoutes', saved);
}
function searchByTag(tag) { const i = document.getElementById('mainSearch'); if (i) { i.value = tag; filters.query = tag.toLowerCase(); } renderDestinations(); document.getElementById('destGrid')?.scrollIntoView({behavior:'smooth',block:'start'}); }

function initDestinationPage() {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active'); document.getElementById(btn.dataset.tab)?.classList.add('active');
  }));
  document.querySelectorAll('[data-attr-filter]').forEach(c => c.addEventListener('click', () => {
    document.querySelectorAll('[data-attr-filter]').forEach(x => x.classList.remove('active','selected'));
    c.classList.add('active','selected');
    document.querySelectorAll('.attraction-item').forEach(i => i.style.display = (c.dataset.attrFilter === 'all' || i.dataset.type === c.dataset.attrFilter) ? '' : 'none');
  }));
  initStarRating('starRatingModal');
}
function highlightMapPin(name) { document.querySelectorAll('.map-pin').forEach(p => { const a = p.dataset.name === name; p.style.fontSize = a ? '2rem' : '1.5rem'; p.style.filter = a ? 'drop-shadow(0 0 6px #2c5f4a)' : ''; p.style.transition = 'all .3s'; }); }

const DEFAULT_TASKS = [
  {id:1,text:'Купить авиабилеты',done:true},{id:2,text:'Забронировать отель',done:false},
  {id:3,text:'Организовать трансфер',done:false},{id:4,text:'Оформить страховку',done:true},{id:5,text:'Записаться на дайвинг',done:false},
];

function initCollabPage() {
  const ci = document.getElementById('chatInput');
  document.getElementById('sendChatBtn')?.addEventListener('click', sendChat);
  ci?.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } });
  loadTasks();
  document.getElementById('taskList')?.addEventListener('change', e => { if (e.target.classList.contains('task-checkbox')) { saveTasks(); updateTaskProgress(); } });
  document.getElementById('addTaskBtn')?.addEventListener('click', () => {
    const inp = document.getElementById('newTaskInput'); if (!inp?.value.trim()) { showToast('Введите название задачи', 'error'); return; }
    addTask(inp.value.trim()); inp.value = ''; bootstrap.Modal.getInstance(document.getElementById('addTaskModal'))?.hide(); showToast('Задача добавлена!');
  });
  document.getElementById('saveStopBtn')?.addEventListener('click', () => {
    const name = document.getElementById('stopName')?.value.trim(); if (!name) { showToast('Введите название точки', 'error'); return; }
    addStop({ name, date: document.getElementById('stopDate')?.value, note: document.getElementById('stopNote')?.value });
    ['stopName','stopDate','stopNote'].forEach(id => { if (document.getElementById(id)) document.getElementById(id).value = ''; });
    bootstrap.Modal.getInstance(document.getElementById('addStopModal'))?.hide(); showToast('Точка добавлена!');
  });
  document.getElementById('copyLinkBtn')?.addEventListener('click', function() { copyToClipboard('wanderlust.app/trip/maldives-2025-x7k', this); });
}

function loadTasks() {
  const tasks = Store.get('collab_tasks', DEFAULT_TASKS), list = document.getElementById('taskList'); if (!list) return;
  list.innerHTML = ''; tasks.forEach(t => appendTask(list, t)); updateTaskProgress();
}
function saveTasks() {
  const list = document.getElementById('taskList'); if (!list) return;
  Store.set('collab_tasks', [...list.querySelectorAll('[data-tid]')].map(el => ({ id: +el.dataset.tid, text: el.querySelector('.task-text').textContent, done: el.querySelector('input').checked })));
}
function addTask(text) {
  const tasks = Store.get('collab_tasks', DEFAULT_TASKS); const t = {id:Date.now(),text,done:false}; tasks.push(t); Store.set('collab_tasks', tasks);
  const list = document.getElementById('taskList'); if (list) { appendTask(list, t); updateTaskProgress(); }
}
function appendTask(list, task) {
  const w = document.createElement('label'); w.dataset.tid = task.id; w.style.cssText = 'display:flex;align-items:center;gap:.5rem;cursor:pointer;font-size:.875rem;padding:.25rem 0;';
  w.innerHTML = `<input type="checkbox" class="task-checkbox" ${task.done ? 'checked' : ''}><span class="task-text" style="${task.done ? 'text-decoration:line-through;color:var(--text-light);' : ''}">${esc(task.text)}</span><button onclick="removeTask(${task.id},this)" style="margin-left:auto;background:none;border:none;color:var(--text-light);cursor:pointer;padding:0;font-size:.9rem;" title="Удалить"><i class="bi bi-x"></i></button>`;
  w.querySelector('input').addEventListener('change', function() { const s = w.querySelector('.task-text'); s.style.textDecoration = this.checked ? 'line-through' : ''; s.style.color = this.checked ? 'var(--text-light)' : ''; });
  list.appendChild(w);
}
function removeTask(id, btn) { Store.remove('collab_tasks', t => t.id === id); btn.closest('[data-tid]')?.remove(); updateTaskProgress(); showToast('Задача удалена', 'info'); }
function updateTaskProgress() {
  const all = document.querySelectorAll('.task-checkbox'), done = document.querySelectorAll('.task-checkbox:checked');
  const bar = document.getElementById('taskProgressBar'), lbl = document.getElementById('taskProgressLabel'); if (!bar || !all.length) return;
  bar.style.width = Math.round(done.length / all.length * 100) + '%'; if (lbl) lbl.textContent = `${done.length} / ${all.length} выполнено`;
}
function sendChat() {
  const inp = document.getElementById('chatInput'), area = document.getElementById('chatMessages'); if (!inp?.value.trim()) return;
  const d = document.createElement('div'); d.className = 'd-flex flex-column gap-1 mt-2'; d.style.alignItems = 'flex-end';
  d.innerHTML = `<div style="font-size:.72rem;color:var(--text-light);">Вы · сейчас</div><div class="chat-msg chat-msg-out">${esc(inp.value)}</div>`;
  area.appendChild(d); inp.value = ''; area.scrollTop = area.scrollHeight;
}
function addStop({name, date, note}) {
  const tl = document.getElementById('timeline'); if (!tl) return;
  const item = document.createElement('div'); item.className = 'timeline-item';
  item.innerHTML = `<div class="timeline-dot-wrap"><div class="timeline-dot"></div><div class="timeline-line"></div></div><div><div style="font-size:.75rem;color:var(--text-light);">${date ? fmtDate(date) : 'Дата не указана'}</div><strong style="font-size:.875rem;">📍 ${esc(name)}</strong>${note ? `<p style="font-size:.8rem;color:var(--text-muted);margin:.2rem 0 0;">${esc(note)}</p>` : ''}<span class="tag tag-green mt-1" style="font-size:.7rem;">Добавлено ✓</span></div>`;
  tl.appendChild(item);
}

document.addEventListener('DOMContentLoaded', () => {
  initTooltips(); initChips();
  const p = document.body.dataset.page;
  if      (p === 'login')       initLoginPage();
  else if (p === 'register')    initRegisterPage();
  else if (p === 'dashboard')   initDashboardPage();
  else if (p === 'search')      initSearchPage();
  else if (p === 'destination') initDestinationPage();
  else if (p === 'collab')      initCollabPage();
});