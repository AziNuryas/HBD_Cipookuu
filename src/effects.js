// ============================================================
// EFFECTS — Parallax, Music, Confetti (Cursor removed)
// ============================================================
import { canvasBurst } from './canvas.js';

// ── Parallax Background ─────────────────────────────────────
const blobs = [
  { el: null, speedX: 0.015, speedY: 0.01 },
  { el: null, speedX: -0.02, speedY: -0.015 },
  { el: null, speedX: 0.025, speedY: -0.02 },
];
const bgGrad = document.getElementById('bg-grad');

let targetMX = 0, targetMY = 0;
let currentMX = 0, currentMY = 0;

export function initParallax() {
  blobs[0].el = document.getElementById('blob1');
  blobs[1].el = document.getElementById('blob2');
  blobs[2].el = document.getElementById('blob3');

  document.addEventListener('mousemove', e => {
    targetMX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Device orientation fallback for mobile parallax
  window.addEventListener("deviceorientation", e => {
    if (e.gamma !== null && e.beta !== null) {
      targetMX = Math.max(-1, Math.min(1, e.gamma / 30));
      targetMY = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
    }
  });

  function parallaxLoop() {
    currentMX += (targetMX - currentMX) * 0.05;
    currentMY += (targetMY - currentMY) * 0.05;

    const px = currentMX * window.innerWidth  * 0.03;
    const py = currentMY * window.innerHeight * 0.03;

    blobs.forEach(b => {
      if (!b.el) return;
      const bx = currentMX * window.innerWidth  * b.speedX * 40;
      const by = currentMY * window.innerHeight * b.speedY * 40;
      b.el.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
    });

    if (bgGrad) {
      bgGrad.style.transform = `translate3d(${px * 0.2}px, ${py * 0.2}px, 0) scale(1.1)`;
    }

    requestAnimationFrame(parallaxLoop);
  }
  parallaxLoop();
}

// ── DOM burst ───────────────────────────────────────────────
const CONF_COLORS  = ['#1d1d1f', '#ff6eb4', '#60a5fa', '#a855f7'];

export function confettiBurst(x, y) {
  canvasBurst(x, y);
  for (let i = 0; i < 12; i++) {
    const el = document.createElement('div');
    el.className = 'dom-confetti';
    const size = Math.random() * 6 + 4;
    el.style.cssText = `
      left:${x}px; top:${y}px;
      background:${CONF_COLORS[Math.floor(Math.random() * CONF_COLORS.length)]};
      width:${size}px; height:${size}px;
      --tx: ${(Math.random() - 0.5) * 150}px;
      --ty: ${(Math.random() - 1.5) * 150}px;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }
}

import { getMusicUrl } from './data.js';

let audioEl = null;
let ytIframe = null;
let musicOn = false;

function extractYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function toggleMusic(btn) {
  const url = getMusicUrl();
  const ytId = extractYouTubeId(url);

  if (musicOn) {
    musicOn = false;
    if (audioEl) audioEl.pause();
    if (ytIframe) ytIframe.src = '';
    if (btn) {
      btn.style.background = 'rgba(255, 255, 255, 0.8)';
      btn.style.color = 'var(--text)';
    }
    return;
  }

  musicOn = true;

  if (ytId) {
    if (audioEl) audioEl.pause();
    if (!ytIframe) {
      ytIframe = document.createElement('iframe');
      ytIframe.id = 'yt-audio-player';
      ytIframe.style.cssText = 'position: fixed; bottom: 0; right: 0; width: 1px; height: 1px; opacity: 0.001; pointer-events: none; z-index: -1;';
      ytIframe.allow = 'autoplay; encrypted-media';
      document.body.appendChild(ytIframe);
    }
    ytIframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&loop=1&playlist=${ytId}&enablejsapi=1`;
    if (btn) {
      btn.style.background = 'var(--text)';
      btn.style.color = '#ffffff';
    }
  } else {
    if (ytIframe) ytIframe.src = '';
    if (!audioEl) {
      audioEl = new Audio();
      audioEl.loop = true;
    }
    if (audioEl.src !== url) {
      audioEl.src = url;
    }
    audioEl.play().then(() => {
      if (btn) {
        btn.style.background = 'var(--text)';
        btn.style.color = '#ffffff';
      }
    }).catch(err => {
      console.warn('Audio play prevented or URL error:', err);
      musicOn = false;
      if (btn) {
        btn.style.background = 'rgba(255, 255, 255, 0.8)';
        btn.style.color = 'var(--text)';
      }
    });
  }
}

export function startMusicAuto(btn) {
  if (musicOn) return;
  toggleMusic(btn);

  const startOnGesture = () => {
    if (!musicOn) {
      toggleMusic(btn);
    }
    window.removeEventListener('click', startOnGesture);
    window.removeEventListener('touchstart', startOnGesture);
  };

  window.addEventListener('click', startOnGesture, { once: true });
  window.addEventListener('touchstart', startOnGesture, { once: true });
}
