const loadingScreen = document.getElementById('loading-screen');
const progressBarInner = document.getElementById('progress-bar-inner');
const clickToStart = document.getElementById('click-to-start');
const main = document.getElementById('main');
const overlay = document.getElementById('overlay');
const content = document.getElementById('content');
const phraseDiv = document.getElementById('phrase');
const symbolImg = document.getElementById('symbol');
const passButton = document.getElementById('pass-button'); // NEW

const startSound = document.getElementById('startSound');
const bgMusic = document.getElementById('bgMusic');

const phrases = [
    { text: "Depuis la nuit des temps, les pêcheurs étaient méprisés par leurs gestes et leurs actions.", symbol: "assets/symbol1.png" },
    { text: "Pourtant, ils ne cessèrent de prier la lune pour que miséricorde leur soit accordée.", symbol: "assets/symbol2.png" },
    { text: "Car eux seuls avaient compris l'essence même de l'humain.", symbol: "assets/symbol3.png" },
    { text: "Ainsi, au fil des siècles ce sont les pêcheurs qui sont devenus sources de prières.", symbol: "assets/symbol4.png" },
    { text: "Alors priez, priez pour la naissance des 7 pêcheurs et de leurs apôtres, car eux seuls seront votre voie.", symbol: "assets/symbol5.png" }
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

    const fadeDuration = isFirst ? 4000 : 3000;
    const finalOpacity = 0.9;

    if (isFirst) {
        await new Promise(r => setTimeout(r, 2000));
        passButton.classList.add('visible'); // NEW
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

function showFinalState() {
    fadeOut(phraseDiv, 1000);
    fadeOut(symbolImg, 1000);
    fadeOut(content, 1000);

    // Disparition du bouton "Passer"
    passButton.style.transition = 'opacity 0.6s ease';
    passButton.style.opacity = 0;
    passButton.style.pointerEvents = 'none';
    setTimeout(() => {
        passButton.classList.remove('visible');
    }, 600);

    // Disparition du fond noir
    overlay.style.transition = 'opacity 2s ease';
    overlay.style.opacity = 0;

    // Affichage du widget Discord avec fondu
    setTimeout(() => {
        const discordContainer = document.getElementById('discord-widget-container');
        if (discordContainer) {
            discordContainer.classList.add('visible');
        }
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
        overlay.style.opacity = '0.8'; // CHANGÉ de 0.9 à 0.8
    }, 50);

    startSound.volume = 0.6;
    startSound.play().catch(() => { });
    passButton.classList.add('visible');
    setTimeout(() => {
        content.classList.add('visible');
        showPhrase(currentIndex, true);

        bgMusic.volume = 0.3;
        bgMusic.play().catch(() => { });

        main.classList.add('zoomed-in');
    }, 4200);
}

clickToStart.addEventListener('click', () => {
    if (!clickToStart.classList.contains('visible')) return;
    startSite();
});

phraseDiv.addEventListener('click', () => {
    if (!canClick) return;
    currentIndex++;
    if (currentIndex >= phrases.length) {
        showFinalState(); // dernier écran
        return;
    }
    showPhrase(currentIndex);
});

passButton.addEventListener('click', () => {
    
    showFinalState(); // passer directement au fond
});

simulateLoading();
