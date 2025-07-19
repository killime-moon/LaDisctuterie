const loadingScreen = document.getElementById('loading-screen');
const progressBarInner = document.getElementById('progress-bar-inner');
const clickToStart = document.getElementById('click-to-start');
const main = document.getElementById('main');
const overlay = document.getElementById('overlay');
const content = document.getElementById('content');
const phraseDiv = document.getElementById('phrase');
const symbolImg = document.getElementById('symbol');
const passButton = document.getElementById('pass-button');

const startSound = document.getElementById('startSound');
const bgMusic = document.getElementById('bgMusic');
const appSound = document.getElementById('appSound');

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const closeButton = document.querySelector('.close-button');

let currentIndex = 0;
let canClick = false;
let currentZoomTarget = null;
let mainContentActive = false;

const phrases = [
    { text: "Depuis la nuit des temps, les pêcheurs étaient méprisés par leurs gestes et leurs actions.", symbol: "assets/symbol1.png" },
    { text: "Pourtant, ils ne cessèrent de prier la lune pour que miséricorde leur soit accordée.", symbol: "assets/symbol2.png" },
    { text: "Car eux seuls avaient compris l'essence même de l'humain.", symbol: "assets/symbol3.png" },
    { text: "Ainsi, au fil des siècles ce sont les pêcheurs qui sont devenus sources de prières.", symbol: "assets/symbol4.png" },
    { text: "Alors priez, priez pour la naissance des 7 pêcheurs et de leurs apôtres, car eux seuls seront votre voie.", symbol: "assets/symbol5.png" }
];

const sins = [
    {
        title: "Gourmandise",
        description: "Le désir excessif de nourriture ou de boisson, jusqu’à l’oubli de l’essentiel."
    },
    {
        title: "Luxure",
        description: "La recherche excessive des plaisirs charnels au détriment de l’amour véritable."
    },
    {
        title: "Colère",
        description: "Une rage incontrôlée, destructrice pour soi et pour les autres."
    },
    {
        title: "Orgueil",
        description: "Se croire supérieur aux autres, oubliant sa propre condition humaine."
    },
    {
        title: "Avarice",
        description: "Le refus de partager, l’accumulation matérielle comme seul objectif."
    },
    {
        title: "Envie",
        description: "Le mal de voir autrui posséder ce que l’on n’a pas."
    },
    {
        title: "Paresse",
        description: "Le rejet de l’effort, l’abandon de sa propre élévation."
    }
];

// Stockage des représentants depuis l’API
let sinRepresentatives = {};

function simulateLoading() {
    let width = 0;
    const interval = setInterval(() => {
        width += 2;
        progressBarInner.style.width = width + '%';
        if (width >= 100) {
            clearInterval(interval);
            clickToStart.classList.add('visible');
            clickToStart.classList.remove('hidden');
        }
    }, 30);
}

function fadeOut(element, duration = 1000) {
    return new Promise(resolve => {
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = 0;
        setTimeout(() => resolve(), duration);
    });
}

function fadeIn(element, duration = 1000, targetOpacity = 0.9) {
    return new Promise(resolve => {
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = targetOpacity;
        setTimeout(() => resolve(), duration);
    });
}

async function showPhrase(index, isFirst = false) {
  canClick = false;
  phraseDiv.classList.remove('clickable');

  if (!isFirst) {
    await Promise.all([
      fadeOut(phraseDiv, 1000),
      fadeOut(symbolImg, 1000),
    ]);
  }

  phraseDiv.textContent = phrases[index].text;
  symbolImg.src = phrases[index].symbol;

  const fadeDuration = isFirst ? 4000 : 3000;
  const finalOpacity = 0.9;

  if (isFirst) {
    await new Promise(r => setTimeout(r, 2000));
    passButton.classList.add('visible');
  }

  await Promise.all([
    fadeIn(phraseDiv, fadeDuration, finalOpacity),
    fadeIn(symbolImg, fadeDuration, finalOpacity),
  ]);

  // ⬇️ Rend le texte cliquable plus rapidement
  setTimeout(() => {
    canClick = true;
    phraseDiv.classList.add('clickable');
  }, 500);
}

function showFinalState() {
    fadeOut(phraseDiv, 1000);
    fadeOut(symbolImg, 1000);
    fadeOut(content, 1000);

    passButton.style.transition = 'opacity 0.6s ease';
    passButton.style.opacity = 0;
    passButton.style.pointerEvents = 'none';
    setTimeout(() => {
        passButton.classList.remove('visible');
    }, 600);

    overlay.style.transition = 'opacity 2s ease';
    overlay.style.opacity = 0;

    setTimeout(() => {
        const discordContainer = document.getElementById('discord-widget-container');
        if (discordContainer) {
            discordContainer.classList.add('visible');
        }
    }, 2000);
    setTimeout(() => {
        showMainContent();
    }, 2000);
}

function startSite() {
    loadingScreen.classList.add('hidden');
    main.classList.remove('hidden');

    main.style.transform = 'scale(1.5)';
    main.style.transition = 'none';
    overlay.style.opacity = '1';
    overlay.style.transition = 'none';

    setTimeout(() => {
        main.style.transition = 'transform 4s ease';
        main.style.transform = 'scale(1)';
        overlay.style.transition = 'opacity 4s ease';
        overlay.style.opacity = '0.8';
    }, 50);

    startSound.volume = 0.6;
    startSound.play().catch(() => { });
    passButton.classList.add('visible');

    setTimeout(() => {
        content.classList.add('visible');
        showPhrase(currentIndex, true);

        bgMusic.volume = 0.5;
        bgMusic.play().catch(() => { });

        main.classList.add('zoomed-in');
    }, 4200);
}

function positionCircleItems() {
    const items = document.querySelectorAll('.circle-item');
    const container = document.getElementById('circle-container');
    const radius = 280;
    const centerX = container.offsetWidth / 2;
    const centerY = container.offsetHeight / 2;

    items.forEach((item, index) => {
        const angle = (index / items.length) * (2 * Math.PI) - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle) - item.offsetWidth / 2;
        const y = centerY + radius * Math.sin(angle) - item.offsetHeight / 2;
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
    });
}

function showMainContent() {
  const mainContent = document.getElementById('main-content');
  const centerImage = document.getElementById('center-image');
  const items = document.querySelectorAll('.circle-item');

  positionCircleItems();

  mainContent.classList.remove('hidden');
  mainContent.classList.add('visible');
  mainContentActive = true; // ← activé ici

  centerImage.style.opacity = '0';
  centerImage.style.transition = 'opacity 2500ms ease';
  setTimeout(() => {
    centerImage.style.opacity = '1';
  }, 50);

  items.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transition = 'opacity 2500ms ease';

    const delay = 800 + i * 350;
    setTimeout(() => {
      appSound.volume = 0.0;
      appSound.playbackRate = 3;
      appSound.play().catch(() => { });
      item.style.opacity = '1';
      item.classList.add('activated'); // ← activation pointer-events
    }, delay);
  });
}

// Gestion du clic sur "Démarrer"
clickToStart.addEventListener('click', () => {
    if (!clickToStart.classList.contains('visible')) return;
    startSite();
});

phraseDiv.addEventListener('click', () => {
    if (!canClick) return;
    currentIndex++;
    if (currentIndex >= phrases.length) {
        showFinalState();
        return;
    }
    showPhrase(currentIndex);
});

passButton.addEventListener('click', () => {
    showFinalState();
});

// Clic sur les 7 cercles
document.querySelectorAll('.circle-item').forEach((item, index) => {
    item.addEventListener('click', () => {
        if (!mainContentActive) return;
        const sin = sins[index];
        const rep = sinRepresentatives[sin.title] || "(représentant inconnu)";
        const mainContent = document.getElementById('main-content');
        const mainBackground = document.getElementById('main');

        currentZoomTarget = item;

        const rect = item.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const deltaX = rect.left + rect.width / 2 - centerX;
        const deltaY = rect.top + rect.height / 2 - centerY;

        mainContent.style.transition = 'transform 0.8s ease';
        mainContent.style.transformOrigin = 'center center';
        mainContent.style.transform = `translate(-50%, -50%) scale(2)`;

        mainBackground.style.transition = 'transform 1s ease';
        mainBackground.style.transform = 'scale(1.2)';

        setTimeout(() => {
            modalTitle.textContent = sin.title;
            modalDescription.textContent = `${sin.description}\n\nReprésentant : ${rep}`;
            modal.classList.remove('hidden');
            modal.style.opacity = '1';
        }, 800);
    });
});

// Fermeture de la modale
closeButton.addEventListener('click', () => {
    modal.style.opacity = '0';

    const mainContent = document.getElementById('main-content');
    const mainBackground = document.getElementById('main');

    mainContent.style.transition = 'transform 0.8s ease';
    mainContent.style.transform = `translate(-50%, -50%) scale(1)`;

    mainBackground.style.transition = 'transform 1s ease';
    mainBackground.style.transform = 'scale(1)';
    setTimeout(() => {
        modal.classList.add('hidden');
        currentZoomTarget = null;
    }, 500);
});

// Parallax
const mainDiv = document.getElementById('main');
const centerImage = document.getElementById('center-image');
const circleItems = document.querySelectorAll('.circle-item');

let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;
const maxTranslate = 15;

window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
});

function animateParallax() {
    currentX += (mouseX * maxTranslate - currentX) * 0.1;
    currentY += (mouseY * maxTranslate - currentY) * 0.1;

    mainDiv.style.backgroundPosition = `calc(50% + ${currentX}px) calc(50% + ${currentY}px)`;
    centerImage.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;

    circleItems.forEach((item) => {
        const factor = 0.5;
        const offsetX = currentX * factor;
        const offsetY = currentY * factor;

        const isHovered = item.matches(':hover');
        const scale = isHovered ? 1.3 : 1;
        item.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    });

    requestAnimationFrame(animateParallax);
}

// Charger les noms des représentants
fetch("https://siteapi-2.onrender.com/owner")
    .then(res => res.json())
    .then(data => {
        sinRepresentatives = data;
    })
    .catch(err => {
        console.error("Erreur API représentants :", err);
    });

// Initialisation
animateParallax();
simulateLoading();
