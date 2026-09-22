import { initCanvas } from './canvas.js';
import { confettiBurst } from './effects.js';

// Init background effects
initCanvas();

const twText = document.getElementById('twText');
const textStr = "Selamat ulang tahun ya! Ada kejutan buat kamu nih...";
let twIdx = 0;

function typeLoop() {
  if (twIdx < textStr.length) {
    if(twText) twText.textContent += textStr.charAt(twIdx);
    twIdx++;
    setTimeout(typeLoop, 50);
  }
}
setTimeout(typeLoop, 500);

const splashGiftWrap = document.getElementById('splashGiftWrap');
const splashGift = document.getElementById('splashGift');
const splashGiftBar = document.getElementById('splashGiftBar');

let giftClicks = 0;
const MAX_CLICKS = 10;
let isOpening = false;

function spawnWrappingPaper() {
  const container = document.body;
  const colors = ['#ff6eb4', '#ffd700', '#00e5ff', '#ff3d00', '#b388ff'];
  
  for(let i=0; i<30; i++) {
    const paper = document.createElement('div');
    paper.className = 'wrapping-paper';
    
    // Randomize colors, sizes, and starting angles
    const color = colors[Math.floor(Math.random() * colors.length)];
    const width = Math.random() * 20 + 10;
    const height = Math.random() * 20 + 10;
    
    // Randomize explosion trajectory
    const tx = (Math.random() - 0.5) * 500;
    const ty = (Math.random() - 0.8) * 500;
    const rot = Math.random() * 720 - 360;
    const duration = Math.random() * 1.5 + 1.5;
    
    paper.style.cssText = `
      position: fixed;
      left: 50%; top: 50%;
      width: ${width}px; height: ${height}px;
      background: ${color};
      opacity: 1;
      transform: translate(-50%, -50%) rotate(0deg);
      pointer-events: none;
      z-index: 1000;
      clip-path: polygon(${Math.random()*100}% 0%, 100% ${Math.random()*100}%, ${Math.random()*100}% 100%, 0% ${Math.random()*100}%);
      transition: transform ${duration}s cubic-bezier(0.25, 1, 0.5, 1), opacity ${duration}s ease-in;
    `;
    
    container.appendChild(paper);
    
    // Trigger animation next frame
    requestAnimationFrame(() => {
      paper.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${rot}deg)`;
      paper.style.opacity = '0';
    });
    
    // Clean up
    setTimeout(() => paper.remove(), duration * 1000);
  }
}

if (splashGiftWrap) {
  const triggerGift = (e) => {
    if (e && e.cancelable) e.preventDefault();
    if (isOpening) return;
    giftClicks++;
    
    // Animate shake
    splashGift.classList.remove('shake');
    void splashGift.offsetWidth; // trigger reflow
    splashGift.classList.add('shake');
    
    // Update progress bar
    const pct = (giftClicks / MAX_CLICKS) * 100;
    if(splashGiftBar) splashGiftBar.style.width = pct + '%';
    
    if (giftClicks >= MAX_CLICKS) {
      isOpening = true;
      splashGift.textContent = '✨'; // open
      
      // Massive explosion
      confettiBurst(window.innerWidth/2, window.innerHeight/2);
      setTimeout(() => confettiBurst(window.innerWidth/2 - 100, window.innerHeight/2 + 50), 200);
      setTimeout(() => confettiBurst(window.innerWidth/2 + 100, window.innerHeight/2 - 50), 400);
      
      // Wrapping paper effect
      spawnWrappingPaper();
      
      // Redirect to main app
      setTimeout(() => {
        window.location.href = 'app.html';
      }, 2000);
    }
  };
  splashGiftWrap.addEventListener('click', triggerGift);
  splashGiftWrap.addEventListener('touchstart', triggerGift, {passive: false});
}
