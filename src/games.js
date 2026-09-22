// ============================================================
// GAMES — Clean, interactive mini-games with instructions
// ============================================================
import { confettiBurst } from './effects.js';

export function buildGames() {
  const wrap = document.getElementById('gamesContainer');
  if(!wrap) return;
  wrap.innerHTML = `
    <!-- CANDLES -->
    <div class="game-card">
      <div class="g-title">Make a Wish & Tiup Lilin</div>
      <div class="g-desc">Pejamkan mata, ucapkan satu permohonan terbaikmu tahun ini di dalam hati, lalu tap satu per satu lilin di bawah ini untuk meniupnya hingga padam. ✨</div>
      <div class="game-stage">
        <div style="font-size: 72px; margin-bottom: 24px;">🎂</div>
        <div id="candlesRow" style="display:flex; justify-content:center; gap: 20px;"></div>
        <div style="font-weight:600; margin-top:32px; color:var(--text); font-size:15px;" id="candleMsg">Silakan tap lilin...</div>
        <button class="btn-secondary" id="resetCandleBtn" style="margin-top:20px;">Nyalakan Lagi</button>
      </div>
    </div>

    <!-- GIFT GAME (Restored) -->
    <div class="game-card">
      <div class="g-title">Buka Kado Spesial</div>
      <div class="g-desc">Ada hadiah kecil yang disiapkan khusus untukmu! Tap kotak kado ini beberapa kali untuk membongkar isinya. Semangat! 🎁</div>
      <div class="game-stage">
        <div class="gift-box-wrap" id="giftBox" style="font-size: 80px; cursor:pointer; user-select:none; transition:transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.15);">🎁</div>
        <div style="font-weight:600; margin-top:24px; color:var(--text); font-size:15px;" id="giftMsg">Tap kado untuk membuka (0/7)</div>
        <div id="giftReveal" style="opacity:0; transform:scale(0.8) translateY(10px); transition:all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.15); margin-top:16px; font-weight:700; color:var(--pink); font-size:18px;"></div>
        <button class="btn-secondary" id="resetGiftBtn" style="margin-top:20px;">Bungkus Ulang</button>
      </div>
    </div>

    <!-- MEMORY -->
    <div class="game-card">
      <div class="g-title">Memory Match</div>
      <div class="g-desc">Uji ingatanmu! Balikkan kartu untuk menemukan pasangan gambar yang sama. Cari semuanya sampai selesai.</div>
      <div class="memo-board" id="memoBoard" style="margin-top:24px;"></div>
      <div style="font-weight:600; margin-top:32px; color: var(--text); font-size:15px;" id="memoMsg">Mulai mencari...</div>
      <button class="btn-secondary" id="resetMemoBtn" style="margin-top:20px;">Acak Ulang</button>
    </div>
  `;

  initCandles();
  initGift();
  initMemory();
}

// ── CANDLE GAME ─────────────────────────────────────────────
let blown = 0;

function initCandles() {
  blown = 0;
  const row = document.getElementById('candlesRow');
  if(!row) return;
  row.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    row.innerHTML += `
      <div class="candle-wrap" id="cn${i}">
        <div class="css-flame"></div>
        <div class="css-stick"></div>
      </div>`;
  }
  document.getElementById('candleMsg').textContent = 'Tap lilin untuk meniup...';

  for (let i = 0; i < 5; i++) {
    document.getElementById('cn' + i).addEventListener('click', () => blowCandle(i));
  }
  document.getElementById('resetCandleBtn').addEventListener('click', initCandles);
}

function blowCandle(i) {
  const el = document.getElementById('cn' + i);
  if (el.classList.contains('out')) return;
  el.classList.add('out');
  
  blown++;
  if (blown === 5) {
    document.getElementById('candleMsg').innerHTML = 'Yeay! Semua lilin padam!<br>Semoga doamu terkabul. 🌟';
    confettiBurst(window.innerWidth / 2, window.innerHeight / 2);
  } else {
    document.getElementById('candleMsg').textContent = `Sisa ${5 - blown} lilin lagi...`;
  }
}

// ── GIFT GAME ───────────────────────────────────────────────
let giftClicks = 0;

function initGift() {
  giftClicks = 0;
  const box = document.getElementById('giftBox');
  const msg = document.getElementById('giftMsg');
  const reveal = document.getElementById('giftReveal');
  
  if(!box) return;
  box.textContent = '🎁';
  box.style.transform = 'scale(1)';
  msg.textContent = 'Tap kado untuk membuka (0/7)';
  reveal.style.opacity = '0';
  reveal.style.transform = 'scale(0.8) translateY(10px)';
  reveal.textContent = '';
  
  // Clone to remove old listeners safely
  const newBox = box.cloneNode(true);
  box.parentNode.replaceChild(newBox, box);
  
  newBox.addEventListener('click', () => shakeGift(newBox, msg, reveal));
  document.getElementById('resetGiftBtn').addEventListener('click', initGift);
}

function shakeGift(box, msg, reveal) {
  if (giftClicks >= 7) return;
  giftClicks++;
  
  // Shake animation using class
  box.classList.remove('gift-shake');
  void box.offsetWidth; // trigger reflow
  box.classList.add('gift-shake');
  
  msg.textContent = `Tap kado untuk membuka (${giftClicks}/7)`;
  
  if (giftClicks === 4) box.textContent = '🎀'; // Tali kado lepas
  if (giftClicks >= 7) {
    box.textContent = '🎊';
    msg.textContent = 'Terbuka!';
    reveal.innerHTML = '✨ Kebahagiaan Tanpa Batas! ✨<br><span style="font-size:13px; color:#666; font-weight:500;">(Itu kado terbaik yang bisa aku berikan)</span>';
    reveal.style.opacity = '1';
    reveal.style.transform = 'scale(1) translateY(0)';
    confettiBurst(window.innerWidth / 2, window.innerHeight / 2);
  }
}

// ── MEMORY GAME ─────────────────────────────────────────────
const CARDS = ['⭐️', '🌙', '🌸', '🦋'];
let mFlipped = [], mMatched = 0, mBusy = false;

function initMemory() {
  mFlipped = []; mMatched = 0; mBusy = false;
  document.getElementById('memoMsg').textContent = 'Temukan 4 pasang gambar.';

  const pairs = [...CARDS, ...CARDS].sort(() => Math.random() - 0.5);
  const board = document.getElementById('memoBoard');
  if(!board) return;
  board.innerHTML = '';
  pairs.forEach((e) => {
    const c = document.createElement('div');
    c.className = 'memo-card';
    c.dataset.val = e;
    c.innerHTML = `<span class="memo-face">${e}</span>`;
    c.addEventListener('click', () => flipCard(c));
    board.appendChild(c);
  });

  document.getElementById('resetMemoBtn').addEventListener('click', initMemory);
}

function flipCard(card) {
  if (mBusy || card.classList.contains('flip') || card.classList.contains('match')) return;
  card.classList.add('flip');
  mFlipped.push(card);

  if (mFlipped.length === 2) {
    mBusy = true;
    const [a, b] = mFlipped;
    if (a.dataset.val === b.dataset.val) {
      setTimeout(() => {
        a.classList.add('match'); b.classList.add('match');
        mMatched++;
        mFlipped = []; mBusy = false;
        if (mMatched === 4) {
          document.getElementById('memoMsg').textContent = 'Hebat! Ingatanmu luar biasa. 👏';
          confettiBurst(window.innerWidth / 2, window.innerHeight / 2);
        }
      }, 400);
    } else {
      setTimeout(() => {
        a.classList.remove('flip'); b.classList.remove('flip');
        mFlipped = []; mBusy = false;
      }, 800);
    }
  }
}
