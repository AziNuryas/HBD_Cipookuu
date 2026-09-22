// ============================================================
// CANVAS — High DPI resolution
// ============================================================

const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let W, H;

export function initCanvas() {
  resize();
  window.addEventListener('resize', resize);
}

function resize() {
  const dpr = window.devicePixelRatio || 1;
  W = window.innerWidth;
  H = window.innerHeight;

  canvas.width = W * dpr;
  canvas.height = H * dpr;

  ctx.scale(dpr, dpr);
}

// ── Canvas confetti burst ──────────────────────
const CBURST_COLORS = ['#1d1d1f', '#86868b', '#d2d2d7', '#ff6eb4', '#60a5fa'];
const cbursts = [];

export function canvasBurst(x, y) {
  for (let i = 0; i < 24; i++) {
    cbursts.push({
      x, y,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 1.2) * 10,
      gravity: 0.3,
      size: Math.random() * 6 + 4,
      color: CBURST_COLORS[Math.floor(Math.random() * CBURST_COLORS.length)],
      life: 1,
    });
  }
  if (!isLooping) loop();
}

let isLooping = false;
function loop() {
  if (cbursts.length === 0) {
    isLooping = false;
    ctx.clearRect(0, 0, W, H);
    return;
  }
  isLooping = true;
  ctx.clearRect(0, 0, W, H);

  for (let i = cbursts.length - 1; i >= 0; i--) {
    const p = cbursts[i];
    p.x += p.vx; p.y += p.vy; p.vy += p.gravity;
    p.life -= 0.02;
    if (p.life <= 0) { cbursts.splice(i, 1); continue; }

    ctx.save();
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  requestAnimationFrame(loop);
}
