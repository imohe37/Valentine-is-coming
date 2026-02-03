// script.js - handles button behavior and floating hearts
(() => {
  // Elements
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const questionEl = document.getElementById('question');
  const sad = document.getElementById('sadSound');
  const cheer = document.getElementById('cheerSound');
  const heartsContainer = document.querySelector('.hearts');

  // Funny lines to cycle when NO is pressed
  const noLines = [
    "You sure? My chocolate is expensive! 🍫",
    "Oh, I'll just cry into my playlist... 🎧",
    "Is it because of my socks? I can change them. 🧦",
    "But I already bought heart-shaped pancakes 🥞",
    "Fine. More roses for me then. 🌹 (not thrilled)"
  ];
  let noCount = 0;
  let yesScale = 1; // CSS variable --yes-scale

  // helper to set CSS variable
  function setYesScale(s) {
    yesScale = Math.min(s, parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--max-yes-scale') || 2));
    document.documentElement.style.setProperty('--yes-scale', yesScale.toFixed(3));
  }

  // NO behavior
  noBtn.addEventListener('click', () => {
    // play sad sound (user gesture)
    try { sad.currentTime = 0; sad.play(); } catch (e) { /* ignore */ }

    // change question text to a funny line
    const line = noLines[noCount % noLines.length];
    questionEl.textContent = line;
    noCount++;

    // grow YES a bit after each NO
    const newScale = 1 + Math.min(0.12 * noCount, 1.0); // step increases, capped
    setYesScale(newScale);

    // create a small, temporary heart burst from NO button for feedback
    burstSmallHeartsFrom(noBtn, 6);
  });

  // YES behavior
  yesBtn.addEventListener('click', (e) => {
    // play cheer sound and redirect to yay.html after a short delay
    try {
      cheer.currentTime = 0;
      cheer.play();
    } catch (ex) { /* ignore */ }

    // small click feedback
    yesBtn.animate([{ transform: `scale(${yesScale})` }, { transform: `scale(${Math.min(yesScale * 1.14, 2)})` }, { transform: `scale(${yesScale})` }], {
      duration: 420,
      easing: 'ease-out'
    });

    // Redirect after a tiny delay so sound begins playing
    setTimeout(() => {
      window.location.href = 'yay.html';
    }, 350);
  });

  // Floating hearts general spawner
  function spawnHeart() {
    if (!heartsContainer) return;
    const el = document.createElement('span');
    el.className = 'heart';
    el.textContent = '💖';
    el.style.left = (Math.random() * 100) + '%';
    el.style.fontSize = (10 + Math.random() * 36) + 'px';
    el.style.opacity = (0.5 + Math.random() * 0.6).toFixed(2);
    el.style.setProperty('--rand', (Math.random() * 3) + 's');
    // random animation duration
    el.style.animationDuration = (4 + Math.random() * 4) + 's';
    heartsContainer.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  // spawn at a steady rate
  setInterval(spawnHeart, 420);

  // small heart burst util: spawn a few hearts near an element
  function burstSmallHeartsFrom(el, count = 6) {
    const rect = el.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'heart';
      s.textContent = ['💖','💘','💕'][Math.floor(Math.random()*3)];
      // initial position near button
      const left = ((rect.left + rect.right) / 2) + (Math.random()*80 - 40);
      s.style.left = Math.max(6, Math.min(window.innerWidth-6, left)) + 'px';
      s.style.fontSize = (12 + Math.random() * 18) + 'px';
      s.style.opacity = (0.7 + Math.random() * 0.3).toFixed(2);
      s.style.animationDuration = (600 + Math.random() * 1200) + 'ms';
      heartsContainer.appendChild(s);
      s.addEventListener('animationend', () => s.remove());
    }
  }

  // Ensure the first user gesture unlocks audio on some mobile browsers:
  function resumeAudioOnInteract() {
    const tryResume = () => {
      [sad, cheer].forEach(a => {
        if (a && a.paused && a.currentTime === 0) {
          // small silent play to satisfy autoplay policy then pause immediately
          a.play().then(() => a.pause()).catch(()=>{});
        }
      });
      window.removeEventListener('touchstart', tryResume, { passive: true });
      window.removeEventListener('click', tryResume);
    };
    window.addEventListener('touchstart', tryResume, { passive: true });
    window.addEventListener('click', tryResume);
  }
  resumeAudioOnInteract();

  // initialize yesScale (in case CSS variable set differently)
  setYesScale(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--yes-scale')) || 1);
})();
