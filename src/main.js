// ============================================================
// MAIN — entry, routing, diary, timeline, wishes
// ============================================================
import './style.css';
import { getDiaryPages, saveDiaryPages, getBgPhotos, saveBgPhotos, getPhotoboothStrips, savePhotoboothStrips, getMusicUrl, saveMusicUrl, TIMELINE_DATA } from './data.js';
import { initCanvas } from './canvas.js';
import { initParallax, confettiBurst, toggleMusic, startMusicAuto } from './effects.js';

// ── State ────────────────────────────────────────────────────
let DIARY_PAGES = getDiaryPages();
let BG_PHOTOS = getBgPhotos();
let PHOTOBOOTH_STRIPS = getPhotoboothStrips();

// ── Boot ─────────────────────────────────────────────────────
initCanvas();
initParallax();
initDecorations();

// ── Typewriter ───────────────────────────────────────────────
const TW_TEXTS = [
  'Welcome to your special day',
  'May all your dreams come true',
  'You deserve everything beautiful',
];
let twI = 0, twC = 0, twDel = false;
const twEl = document.getElementById('twText');

function typeLoop() {
  if (!twEl) return;
  const cur = TW_TEXTS[twI];
  if (!twDel) {
    twEl.textContent = cur.slice(0, ++twC);
    if (twC === cur.length) { twDel = true; setTimeout(typeLoop, 2500); return; }
    setTimeout(typeLoop, 50);
  } else {
    twEl.textContent = cur.slice(0, --twC);
    if (twC === 0) { twDel = false; twI = (twI + 1) % TW_TEXTS.length; setTimeout(typeLoop, 400); return; }
    setTimeout(typeLoop, 20);
  }
}
setTimeout(typeLoop, 800);

// ── Boot App ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderDiaryPage(0, 1);
  renderPhotoboothStrips();
  renderTimeline();
  renderAdmin();

  // Auto start background music
  const musicBtn = document.getElementById('musicBtn');
  startMusicAuto(musicBtn);
});

// ── Render Dynamic Photobooth Strips ─────────────────────────
function renderPhotoboothStrips() {
  const containers = document.querySelectorAll('[data-photobooth-container]');
  containers.forEach(container => {
    container.innerHTML = PHOTOBOOTH_STRIPS.map((strip, sIdx) => `
      <div class="photobooth-strip">
        ${strip.map(imgUrl => `<img src="${imgUrl}" loading="lazy" onclick="window.__openModal('${imgUrl}', 'Photobooth Memory')" />`).join('')}
      </div>
    `).join('');
  });
}


// ── Routing ───────────────────────────────────────────────────
let activeViewId = 'diary';
document.getElementById('topTabs')?.addEventListener('click', e => {
  const btn = e.target.closest('.dock-btn');
  if (!btn) return;
  if(btn.tagName === 'A') return; // Let links navigate naturally
  
  const nextId = btn.dataset.view;
  if (!nextId || nextId === activeViewId) return;

  const oldView = document.getElementById('view-' + activeViewId);
  const newView = document.getElementById('view-' + nextId);

  oldView.classList.remove('active');
  oldView.classList.add('leaving');
  setTimeout(() => { oldView.classList.remove('leaving'); }, 300);

  setTimeout(() => {
    newView.classList.add('active');
    if (nextId === 'timeline') observeTimeline();
    if (nextId === 'wishes')   observeWishes();
  }, 100);

  document.querySelectorAll('.dock-btn').forEach(t => t.classList.remove('active'));
  if (btn.classList.contains('dock-btn')) btn.classList.add('active');
  activeViewId = nextId;
});

// Admin Button Routing
document.getElementById('adminBtn')?.addEventListener('click', () => {
  if (activeViewId === 'admin') return;
  const oldView = document.getElementById('view-' + activeViewId);
  const newView = document.getElementById('view-admin');

  oldView.classList.remove('active');
  oldView.classList.add('leaving');
  setTimeout(() => { oldView.classList.remove('leaving'); }, 300);

  setTimeout(() => { newView.classList.add('active'); }, 100);

  document.querySelectorAll('.dock-btn').forEach(t => t.classList.remove('active'));
  activeViewId = 'admin';
});

// ── Music ─────────────────────────────────────────────
const musicBtn = document.getElementById('musicBtn');
if (musicBtn) musicBtn.addEventListener('click', () => toggleMusic(musicBtn));

// ── DIARY ─────────────────────────────────────────────────────
let curPage = 0;

function renderDiaryPage(idx, dir) {
  const stage = document.getElementById('pageStage');
  if(!stage) return;

  const old = stage.querySelector('.p-active');
  if (old) {
    old.classList.remove('p-active');
    old.classList.add(dir > 0 ? 'p-exit-left' : 'p-exit-right');
    setTimeout(() => old.remove(), 400);
  }

  const el = document.createElement('div');
  el.className = 'diary-page ' + (dir > 0 ? 'p-enter-right' : 'p-enter-left');
  el.innerHTML = buildPageHTML(DIARY_PAGES[idx]);
  stage.appendChild(el);

  const updateHeight = () => {
    if (el && stage) {
      const h = Math.max(el.scrollHeight, el.offsetHeight, el.getBoundingClientRect().height);
      if (h > 0) stage.style.height = h + 'px';
    }
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.remove('p-enter-right', 'p-enter-left');
      el.classList.add('p-active');
      updateHeight();
      setTimeout(updateHeight, 100);
      setTimeout(updateHeight, 350);
      setTimeout(updateHeight, 750);

      // Recalculate height when images load on mobile
      el.querySelectorAll('img').forEach(img => {
        if (img.complete) updateHeight();
        else img.addEventListener('load', updateHeight, { once: true });
      });
    });
  });

  renderDots(idx);
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (prevBtn) prevBtn.disabled = idx === 0;
  if (nextBtn) nextBtn.disabled = idx === DIARY_PAGES.length - 1;

  const pBar = document.getElementById('osProgressBar');
  if (pBar) pBar.style.width = (idx / (DIARY_PAGES.length - 1) * 100) + '%';
}

function initDecorations() {
  const STICKERS = ['🎀', '🌸', '💖', '🐰', '🍓', '🍭', '👑', '🍑', '🍼', '🐱', '✨', '💕', '🦋'];
  
  const container = document.getElementById('bg-decorations');
  if(!container) return;
  container.innerHTML = '';
  
  // Sistem Grid/Slot Anti-Numpuk (4 Baris x 3 Kolom = 12 Kapling)
  const slots = [];
  for(let r=0; r<4; r++) {
    for(let c=0; c<3; c++) {
      // Lewati kapling tengah tempat buku Diary berada
      if (c === 1 && (r === 1 || r === 2)) continue; 
      slots.push({ r, c });
    }
  }
  // Acak urutan kapling
  slots.sort(() => Math.random() - 0.5);

  let slotIdx = 0;

  // Scatter 4 background polaroids (masing-masing 1 kapling)
  for(let i = 0; i < 4; i++) {
    if(!BG_PHOTOS[i] || slotIdx >= slots.length) continue;
    const s = slots[slotIdx++];
    
    const rot = (Math.random() * 50 - 25) + 'deg';
    const scl = (Math.random() * 0.3 + 0.7);
    const dur = (Math.random() * 3 + 4) + 's'; // 4s to 7s sway duration
    const del = (Math.random() * 0.4) + 's'; // pop-in delay
    const phase = (Math.random() * -5) + 's'; // start sway at different points
    
    // Posisi relatif di dalam kapling grid
    const top = s.r * 25 + (Math.random() * 10 + 5); 
    const left = s.c * 33 + (Math.random() * 15 + 5);
    const isDark = Math.random() > 0.6;
    
    container.innerHTML += `
      <div class="deco-wrap" style="top:${top}%; left:${left}%; animation-delay:${del};">
        <div class="bg-polaroid ${isDark ? 'dark' : ''}" style="--rot:${rot}; --scl:${scl}; --dur:${dur}; animation-delay:${phase};">
          <img src="${BG_PHOTOS[i]}" loading="lazy"/>
        </div>
      </div>
    `;
  }

  // Scatter stiker di kapling yang tersisa (Maks 3 stiker, TIDAK DUPLIKAT)
  let availableStickers = [...STICKERS].sort(() => Math.random() - 0.5);
  for(let i = 0; i < 3; i++) {
    if (slotIdx >= slots.length) break;
    const slot = slots[slotIdx++];
    
    const emoji = availableStickers.pop();
    const rot = (Math.random() * 80 - 40) + 'deg';
    const scl = (Math.random() * 0.5 + 0.7);
    const size = (Math.random() * 30 + 30) + 'px'; // Ukuran normal kecil (30px - 60px)
    const dur = (Math.random() * 2 + 3) + 's';
    const phase = (Math.random() * -5) + 's'; // arah gerak beda-beda
    const del = (Math.random() * 0.5) + 's';
    
    const top = slot.r * 25 + (Math.random() * 10 + 5);
    const left = slot.c * 33 + (Math.random() * 15 + 5);
    
    container.innerHTML += `
      <div class="deco-wrap" style="top:${top}%; left:${left}%; animation-delay:${del};">
        <div class="cute-sticker" style="--rot:${rot}; --scl:${scl}; --size:${size}; --dur:${dur}; animation-delay:${phase};">${emoji}</div>
      </div>
    `;
  }
}

function buildPageHTML(p) {
  const STICKERS = ['🎂', '🕯️', '🎉', '🎈', '🎁', '🍰', '🥳'];
  const sticker = STICKERS[Math.floor(Math.random() * STICKERS.length)];
  
  const photoHTML = p.photos ? `
    <div class="photo-grid">
      ${p.photos.map((ph) => `
        <div class="polaroid" onclick="window.__openModal('${ph.img}','${ph.c}')">
          <img src="${ph.img}" class="pol-img" loading="lazy" />
          <div class="pol-caption">${ph.c}</div>
        </div>`).join('')}
    </div>` : '';

  const isSplit = p.num === '03' || p.num === '05';

  if (isSplit) {
    return `
      <div class="corner-sticker">${sticker}</div>
      <div class="diary-split-layout">
        <div class="diary-text-col">
          <div class="page-meta">
            <span>${p.date}</span>
          </div>
          <div class="page-title">${p.title}</div>
          <div class="page-body">${p.body}</div>
        </div>
        <div class="diary-photo-col">
          ${photoHTML}
        </div>
      </div>
    `;
  }

  return `
    <div class="corner-sticker">${sticker}</div>
    <div class="page-meta">
      <span>${p.date}</span>
    </div>
    <div class="page-title">${p.title}</div>
    <div class="page-body">${p.body}</div>
    ${photoHTML}
  `;
}

function renderDots(active) {
  const wrap = document.getElementById('pageDots');
  if(!wrap) return;
  wrap.innerHTML = '';
  DIARY_PAGES.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot' + (i === active ? ' active' : '');
    d.addEventListener('click', () => { if (i !== curPage) goTo(i); });
    wrap.appendChild(d);
  });
}

function navigate(dir) {
  const next = curPage + dir;
  if (next < 0 || next >= DIARY_PAGES.length) return;
  goTo(next, dir);
}

function goTo(idx, dir) {
  dir = dir ?? (idx > curPage ? 1 : -1);
  curPage = idx;
  renderDiaryPage(idx, dir);
  // Stickers and background photos stay perfectly still!
}

document.getElementById('prevBtn')?.addEventListener('click', () => navigate(-1));
document.getElementById('nextBtn')?.addEventListener('click', () => navigate(1));

// ── SWIPE GESTURES FOR DIARY (DESKTOP DRAG & MOBILE SWIPE) ────
let startX = 0, startY = 0, endX = 0, endY = 0;
let isDragging = false;

const stage = document.getElementById('pageStage');
if (stage) {
  // Touch Events (Mobile Smartphones)
  stage.addEventListener('touchstart', e => {
    startX = e.changedTouches[0].clientX;
    startY = e.changedTouches[0].clientY;
  }, { passive: true });

  stage.addEventListener('touchend', e => {
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;
    evaluateSwipe(true);
  }, { passive: true });

  // Mouse Drag Events (Desktop only - skip if touchscreen active)
  stage.addEventListener('mousedown', e => {
    if ('ontouchstart' in window && window.innerWidth <= 768) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    stage.style.cursor = 'grabbing';
  });

  window.addEventListener('mouseup', e => {
    if (!isDragging) return;
    isDragging = false;
    endX = e.clientX;
    endY = e.clientY;
    stage.style.cursor = '';
    evaluateSwipe(false);
  });
}

function evaluateSwipe(isTouch) {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  // Threshold jauh lebih aman (85px di mobile) agar scrolling vertikal & tap foto tidak kepencet swipe
  const swipeThreshold = isTouch ? 85 : 50;
  
  // Memastikan gerakan memang swipe horizontal murni (deltaX jauh lebih besar dari deltaY)
  if (Math.abs(deltaX) > Math.abs(deltaY) * 2.5 && Math.abs(deltaX) > swipeThreshold) {
    if (deltaX < 0) {
      navigate(1);  // Swipe Kiri -> Halaman Berikutnya
    } else {
      navigate(-1); // Swipe Kanan -> Halaman Sebelumnya
    }
  }
}


// ── TIMELINE ──────────────────────────────────────────────────
function renderTimeline() {
  const list = document.getElementById('tlList');
  if(!list) return;
  list.innerHTML = TIMELINE_DATA.map((item, i) => `
    <div class="tl-item" style="transition-delay:${i * 0.1}s">
      <div class="tl-dot"></div>
      <div class="tl-card">
        <div class="tl-year">${item.year}</div>
        <div class="tl-event">${item.event}</div>
        <div class="tl-desc">${item.desc}</div>
      </div>
    </div>`).join('');
}

function observeTimeline() {
  const items = document.querySelectorAll('.tl-item');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.1 });
  items.forEach(el => obs.observe(el));
  setTimeout(() => items.forEach(el => el.classList.add('in')), 100);
}

// ── WISHES ────────────────────────────────────────────────────
function renderWishes() {
  const list = document.getElementById('wishList');
  if(!list) return;
  list.innerHTML = WISHES_DATA.map((w, i) => `
    <div class="wish-item" style="transition-delay:${i * 0.1}s">
      <img src="${w.avatar}" class="wish-avatar" loading="lazy" />
      <div class="wish-body">
        <div class="wish-name">${w.name}</div>
        <div class="wish-bubble">${w.msg}</div>
        <div class="wish-time">${w.time}</div>
      </div>
    </div>`).join('');
}

function observeWishes() {
  const items = document.querySelectorAll('.wish-item');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.1 });
  items.forEach(el => obs.observe(el));
  setTimeout(() => items.forEach(el => el.classList.add('in')), 100);
}

// ── MODAL ──────────────────────────────────────────────────────
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');

window.__openModal = function (imgUrl, caption) {
  if(!modalBody || !modal) return;
  modalBody.innerHTML = `
    <img src="${imgUrl}" class="modal-img" />
    <div class="modal-ttl">${caption}</div>
  `;
  modal.classList.add('open');
};

function closeModal() {
  if(modal) modal.classList.remove('open');
}

document.getElementById('modalClose')?.addEventListener('click', closeModal);
modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });

// ── ADMIN PANEL ────────────────────────────────────────────────
function renderAdmin() {
  const container = document.getElementById('adminFormContainer');
  if (!container) return;
  container.innerHTML = '';

  DIARY_PAGES.forEach((page, index) => {
    const card = document.createElement('div');
    card.className = 'admin-page-card';
    card.innerHTML = `
      <div class="admin-page-title">Page 0${page.num} - ${page.title}</div>
      
      <div class="admin-input-group">
        <label>Judul Halaman</label>
        <input type="text" id="admin_title_${index}" value="${page.title}" />
      </div>
      
      <div class="admin-input-group">
        <label>Teks Utama (Body)</label>
        <textarea id="admin_body_${index}">${page.body}</textarea>
      </div>

      <div class="admin-photos" id="admin_photos_${index}">
        ${(page.photos || []).map((ph, pIdx) => `
          <div class="admin-photo-card">
            <div class="admin-input-group">
              <label>URL Gambar ${pIdx + 1}</label>
              <input type="text" id="admin_img_${index}_${pIdx}" value="${ph.img}" />
            </div>
            <div class="admin-input-group">
              <label>Caption Foto ${pIdx + 1}</label>
              <input type="text" id="admin_cap_${index}_${pIdx}" value="${ph.c}" />
            </div>
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(card);
  });

  // Background Photos Settings Card
  const bgCard = document.createElement('div');
  bgCard.className = 'admin-page-card';
  bgCard.innerHTML = `
    <div class="admin-page-title">Background Floating Photos</div>
    <div class="admin-photos">
      ${BG_PHOTOS.map((url, i) => `
        <div class="admin-input-group">
          <label>URL Foto Belakang ${i + 1}</label>
          <input type="text" id="admin_bg_${i}" value="${url}" />
        </div>
      `).join('')}
    </div>
  `;
  container.appendChild(bgCard);

  // Photobooth Strips Footer Settings Card
  const pbCard = document.createElement('div');
  pbCard.className = 'admin-page-card';
  pbCard.innerHTML = `
    <div class="admin-page-title">Photobooth Strips (Footer Scrapbook)</div>
    <p style="font-size:12px; color:var(--muted); margin-bottom:12px;">Masukkan URL foto langsung (bisa dari Google Photos klik kanan 'Salin Alamat Gambar'):</p>
    ${PHOTOBOOTH_STRIPS.map((strip, sIdx) => `
      <div style="margin-bottom:16px;">
        <strong style="font-size:13px; color:var(--purple);">Strip Photobooth Kolom ${sIdx + 1}</strong>
        <div class="admin-photos" style="margin-top:8px;">
          ${strip.map((url, pIdx) => `
            <div class="admin-input-group">
              <label>Foto ${pIdx + 1}</label>
              <input type="text" id="admin_pb_${sIdx}_${pIdx}" value="${url}" />
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')}
  `;
  container.appendChild(pbCard);

  // Music Settings Card
  const musicCard = document.createElement('div');
  musicCard.className = 'admin-page-card';
  musicCard.innerHTML = `
    <div class="admin-page-title">Background Music (Lagu Latar)</div>
    <div class="admin-input-group">
      <label>URL Musik (YouTube Link / Link MP3 / File Lokal)</label>
      <input type="text" id="admin_music_url" value="${getMusicUrl()}" placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/... atau /lagu.mp3" />
      <span style="font-size:11px; color:var(--muted); margin-top:4px;">✨ <b>Mendukung Link YouTube langsung!</b> Cukup tempel link video YouTube (misal: <code>https://youtu.be/xxx</code>) atau link MP3 / file lokal <code>/lagu.mp3</code>.</span>
    </div>
  `;
  container.appendChild(musicCard);

  const saveBtn = document.createElement('button');
  saveBtn.className = 'admin-btn-save';
  saveBtn.textContent = 'Save & Reload';
  saveBtn.addEventListener('click', saveAdminData);
  container.appendChild(saveBtn);
}

function saveAdminData() {
  const newPages = JSON.parse(JSON.stringify(DIARY_PAGES)); // Deep copy

  newPages.forEach((page, index) => {
    page.title = document.getElementById(`admin_title_${index}`).value;
    page.body = document.getElementById(`admin_body_${index}`).value;
    
    if (page.photos) {
      page.photos.forEach((ph, pIdx) => {
        ph.img = document.getElementById(`admin_img_${index}_${pIdx}`).value;
        ph.c = document.getElementById(`admin_cap_${index}_${pIdx}`).value;
      });
    }
  });

  saveDiaryPages(newPages);
  
  const newBgPhotos = [];
  for(let i=0; i<4; i++) {
    const el = document.getElementById(`admin_bg_${i}`);
    if (el) newBgPhotos.push(el.value);
  }
  if (newBgPhotos.length === 4) {
    saveBgPhotos(newBgPhotos);
  }

  const newPhotoboothStrips = [];
  for(let s=0; s<3; s++) {
    const strip = [];
    for(let p=0; p<3; p++) {
      const el = document.getElementById(`admin_pb_${s}_${p}`);
      if (el) strip.push(el.value);
    }
    newPhotoboothStrips.push(strip);
  }
  savePhotoboothStrips(newPhotoboothStrips);

  const musicUrlInput = document.getElementById('admin_music_url');
  if (musicUrlInput && musicUrlInput.value) {
    saveMusicUrl(musicUrlInput.value);
  }

  
  // Show success and reload
  const btn = document.querySelector('.admin-btn-save');
  btn.textContent = 'Saved! Reloading...';
  btn.style.background = '#10b981';
  
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}
