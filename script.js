const loadingScreen = document.getElementById('loading-screen');
const progressBarInner = document.getElementById('progress-bar-inner');
const clickToStart = document.getElementById('click-to-start');
const main = document.getElementById('main');
const overlay = document.getElementById('overlay');
const content = document.getElementById('content');
const phraseDiv = document.getElementById('phrase');
const symbolImg = document.getElementById('symbol');

const startSound = document.getElementById('startSound');
const bgMusic = document.getElementById('bgMusic');

const phrases = [
    { text: "La lune n'a cessé de prier", symbol: "assets/symbol1.png" },
    { text: "L'homme en colère chuta", symbol: "assets/symbol2.png" }
];

let currentIndex = 0;
let canClick = false;

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

    const fadeDuration = isFirst ? 4000 : 1500;
    const finalOpacity = 0.9;

    if (isFirst) {
        await new Promise(r => setTimeout(r, 2000));
    }

    await Promise.all([
        fadeIn(phraseDiv, fadeDuration, finalOpacity),
        fadeIn(symbolImg, fadeDuration, finalOpacity),
    ]);

    setTimeout(() => {
        canClick = true;
        phraseDiv.classList.add('clickable');
    }, 1000);
}

function startSite() {
    loadingScreen.classList.add('hidden');
    main.classList.remove('hidden');

    // Setup zoom initial sans transition
    main.style.transform = 'scale(1.5)';
    main.style.transition = 'none';
    overlay.style.opacity = '1';
    overlay.style.transition = 'none';

    setTimeout(() => {
        // Transition zoom 1.5 → 1 en 4s
        main.style.transition = 'transform 4s ease';
        main.style.transform = 'scale(1)';

        overlay.style.transition = 'opacity 4s ease';
        overlay.style.opacity = '0.9';
    }, 50);

    // Jouer son souffle au démarrage du zoom
    startSound.volume = 0.6;
    startSound.play().catch(() => { });

    // Après zoom initial fini, lancer contenu + animation zoom en boucle
    setTimeout(() => {
        content.classList.add('visible');
        showPhrase(currentIndex, true);

        bgMusic.volume = 0.3;
        bgMusic.play().catch(() => { });

        main.classList.add('looping');
    }, 4200); // délai > 4s transition zoom initial
}

clickToStart.addEventListener('click', () => {
    if (!clickToStart.classList.contains('visible')) return;
    startSite();
});

phraseDiv.addEventListener('click', () => {
    if (!canClick) return;
    currentIndex++;
    if (currentIndex >= phrases.length) currentIndex = 0;
    showPhrase(currentIndex);
});

simulateLoading();
