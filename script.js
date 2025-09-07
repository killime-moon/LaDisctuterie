// ... (toutes les variables initiales sont inchangées)
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
const souffle2Sound = document.getElementById('souffle2Sound');

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
    { title: "Gourmandise", description: "Le désir excessif de nourriture ou de boisson, jusqu’à l’oubli de l’essentiel." },
    { title: "Luxure", description: "La recherche excessive des plaisirs charnels au détriment de l’amour véritable." },
    { title: "Colère", description: "Une rage incontrôlée, destructrice pour soi et pour les autres." },
    { title: "Orgueil", description: "Se croire supérieur aux autres, oubliant sa propre condition humaine." },
    { title: "Avarice", description: "Le refus de partager, l’accumulation matérielle comme seul objectif." },
    { title: "Envie", description: "Le mal de voir autrui posséder ce que l’on n’a pas." },
    { title: "Paresse", description: "Le rejet de l’effort, l’abandon de sa propre élévation." }
];

let sinRepresentatives = {};

function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function simulateLoading() {
    const dots = document.querySelectorAll('#loading-circle .dot');
    let index = 0;
    const interval = setInterval(() => {
        if (index < dots.length) {
            dots[index].classList.add('active');
            index++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                clickToStart.classList.add('visible');
                clickToStart.classList.remove('hidden');
            }, 500);
        }
    }, 130); // 0.3s par point → 8 points = 2.4s total
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
        // fade-out des anciens texte et symbole
        phraseDiv.style.transition = 'opacity 1000ms ease';
        symbolImg.style.transition = 'opacity 1000ms ease';
        phraseDiv.style.opacity = 0;
        symbolImg.style.opacity = 0;

        await new Promise(r => setTimeout(r, 1000)); // attend la fin du fade-out
    }

    // Met le texte et symbole nouveaux
    phraseDiv.textContent = phrases[index].text;
    symbolImg.src = phrases[index].symbol;

    // Assure qu'ils commencent invisibles
    phraseDiv.style.opacity = 0;
    symbolImg.style.opacity = 0;

    if (isFirst) {
        await new Promise(r => setTimeout(r, 1000));
        passButton.classList.add('visible');
    }

    canClick = true;
    phraseDiv.classList.add('clickable');

    // fade-in avec durées originales
    phraseDiv.style.transition = `opacity ${isFirst ? 4000 : 3000}ms ease`;
    symbolImg.style.transition = `opacity ${isFirst ? 4000 : 3000}ms ease`;
    phraseDiv.style.opacity = 0.9;
    symbolImg.style.opacity = 0.9;
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

function positionCircleItemsStatic() {
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

let rotationAngle = 0;

function rotateCircleItems() {
    const items = document.querySelectorAll('.circle-item');
    const container = document.getElementById('circle-container');
    const radius = 280;
    const centerX = container.offsetWidth / 2;
    const centerY = container.offsetHeight / 2;
    const totalItems = items.length;

    rotationAngle += 0.00025; // ⚠️ Plus lent que 0.002

    items.forEach((item, index) => {
        const angle = (index / totalItems) * (2 * Math.PI) + rotationAngle;
        const x = centerX + radius * Math.cos(angle) - item.offsetWidth / 2;
        const y = centerY + radius * Math.sin(angle) - item.offsetHeight / 2;

        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
    });

    requestAnimationFrame(rotateCircleItems);
}

function showMainContent() {
    const mainContent = document.getElementById('main-content');
    const centerImage = document.getElementById('center-image');
    const items = document.querySelectorAll('.circle-item');

    positionCircleItemsStatic();

    mainContent.classList.remove('hidden');
    mainContent.classList.add('visible');
    mainContentActive = true;

    centerImage.style.opacity = '0';
    centerImage.style.transition = 'opacity 2500ms ease';
    setTimeout(() => {
        centerImage.style.opacity = '1';
    }, 50);
    const centerMoon = document.getElementById('center-moon');
    centerMoon.style.opacity = '0';
    centerMoon.style.transition = 'opacity 2500ms ease';
    centerMoon.style.pointerEvents = 'auto';
    setTimeout(() => {
        centerMoon.style.opacity = '1';
    }, 50); // légèrement après center.png

    items.forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transition = 'opacity 2500ms ease';

        const delay = 800 + i * 450;
        setTimeout(() => {
            appSound.volume = 0.0;
            appSound.playbackRate = 3;
            appSound.play().catch(() => { });
            item.style.opacity = '1';
            item.classList.add('activated');
        }, delay);
    });
}

loadingScreen.addEventListener('click', () => {
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

const centerMoon = document.getElementById('center-moon');
let hasEnteredAncientMoon = false;

centerMoon.addEventListener('click', () => {
    if (!mainContentActive || hasEnteredAncientMoon) return;
    hasEnteredAncientMoon = true;

    // Sons
    souffle2Sound.currentTime = 0;
    souffle2Sound.play().catch(() => { });

    // Récupération des éléments
    const main = document.getElementById('main');
    const mainContent = document.getElementById('main-content');
    const discord = document.getElementById('discord-widget-container');
    const footer = document.getElementById('footer-text');
    const circleItems = document.querySelectorAll('.circle-item');
    const centerMoon = document.getElementById('center-moon');
    const centerImage = document.getElementById('center-image');

    // Masquer toutes les tooltips et désactiver leur logique
    tooltipEnabled = false;
    document.querySelectorAll('.sin-tooltip').forEach(tip => {
        tip.style.display = 'none';
    });

    // Masquer tout le contenu de la scène centrale
    main.style.transition = 'transform 1.5s ease, opacity 1.5s ease';
    main.style.transform = 'scale(0.1)';
    main.style.opacity = '0';
    main.style.pointerEvents = 'none';

    mainContent.style.transition = 'transform 1.5s ease, opacity 1.5s ease';
    mainContent.style.transform = 'translate(-50%, -50%) scale(0.1)';
    mainContent.style.opacity = '0';
    mainContent.style.pointerEvents = 'none';
    centerMoon.style.pointerEvents = 'none';
    // Supprimer toute interaction sur les éléments
    centerMoon.style.pointerEvents = 'none';
    centerImage.style.pointerEvents = 'none';
    circleItems.forEach(item => {
        item.style.pointerEvents = 'none';
    });
    centerMoonTooltip.style.display = 'none';
    // Masquer Discord et footer proprement
    if (discord) {
        discord.style.transition = 'opacity 1s ease';
        discord.style.opacity = '0';
        discord.style.pointerEvents = 'none';
    }

    if (footer) {
        footer.style.transition = 'opacity 1s ease';
        footer.style.opacity = '0';
    }

    // Après la transition, on montre la vidéo
    setTimeout(() => {
        const ancientMoon = document.getElementById('ancientmoon-bg');
        const ancientVideo = document.getElementById('ancientmoon-video');

        ancientMoon.classList.remove('hidden');
        ancientMoon.style.opacity = '1';
        ancientMoon.style.transform = 'scale(1)';
        setTimeout(() => {
            returnButton.classList.remove('hidden', 'exit-zoom');
            returnButton.classList.add('visible');
            returnButton.style.transform = 'scale(1)';
        }, 1800);
    }, 1600);
});

document.querySelectorAll('.circle-item').forEach((item, index) => {
    item.addEventListener('click', () => {
        enterSinPage(index);
    });
});

function enterSinPage(index) {
    if (!mainContentActive) return;

    const sin = sins[index];
    const normalizedTitle = normalizeString(sin.title);

    souffle2Sound.currentTime = 0;
    souffle2Sound.play().catch(() => { });

    const sinPage = document.getElementById('sin-page');
    const sinBackground = document.getElementById('sin-background');
    const sinMessage = document.getElementById('sin-message');

    const main = document.getElementById('main');
    const mainContent = document.getElementById('main-content');
    const discord = document.getElementById('discord-widget-container');
    const footer = document.getElementById('footer-text');
    const circleItems = document.querySelectorAll('.circle-item');
    const centerMoon = document.getElementById('center-moon');
    const centerImage = document.getElementById('center-image');

    // Bloque toute interaction
    tooltipEnabled = false;
    mainContentActive = false;

    main.style.transition = 'transform 1.5s ease, opacity 1.5s ease';
    main.style.transform = 'scale(0.1)';
    main.style.opacity = '0';
    main.style.pointerEvents = 'none';

    mainContent.style.transition = 'transform 1.5s ease, opacity 1.5s ease';
    mainContent.style.transform = 'translate(-50%, -50%) scale(0.1)';
    mainContent.style.opacity = '0';
    mainContent.style.pointerEvents = 'none';

    centerMoon.style.pointerEvents = 'none';
    centerImage.style.pointerEvents = 'none';
    circleItems.forEach(item => item.style.pointerEvents = 'none');

    if (discord) {
        discord.style.transition = 'opacity 1s ease';
        discord.style.opacity = '0';
        discord.style.pointerEvents = 'none';
    }

    if (footer) {
        footer.style.transition = 'opacity 1s ease';
        footer.style.opacity = '0';
    }

    // Prépare fond et représentant
    let representative = null;
    for (const [key, value] of Object.entries(sinRepresentatives)) {
        if (normalizeString(key) === normalizedTitle) {
            representative = value; // objet { name, avatar }
            break;
        }
    }

    if (representative && representative.name !== "aucun" && representative.name !== "Place vacante") {
        sinBackground.style.backgroundImage = `url('assets/${sin.title}.png')`;
        sinBackground.style.backgroundColor = 'transparent';

        sinMessage.innerHTML = `
            <div class="player-card">
                <img src="${representative.avatar || "assets/default-avatar.png"}" alt="Avatar">
                <div class="player-info">
                    <div class="player-name">${representative.name}</div>
                </div>
            </div>
        `;
    } else {
        sinBackground.style.backgroundImage = 'none';
        sinBackground.style.backgroundColor = 'black';
        sinMessage.textContent = "La lune a cessé d’émettre depuis des millénaires, pourtant son éternel souverain ne s’est pas encore dévoilé.";
    }

    // Affichage progressif
    setTimeout(() => {
        sinPage.classList.add('visible');
        sinPage.style.opacity = '1';
        sinPage.style.transform = 'scale(1)';
        setTimeout(() => {
            returnButton.classList.remove('hidden', 'exit-zoom');
            returnButton.classList.add('visible');
            returnButton.style.transform = 'scale(1)';
        }, 1800);
    }, 1600);
}



// Tooltip pour la lune centrale
const centerMoonTooltip = document.createElement('div');
centerMoonTooltip.className = 'sin-tooltip';
centerMoonTooltip.innerHTML = `
  <strong>Lune Centrale</strong><br>
  La dernière lune subsiste depuis des millénaires,<br>
  vénérée et acclamée à chaque coucher du Soleil.
`;
document.body.appendChild(centerMoonTooltip);
centerMoonTooltip.style.display = 'none';

centerMoon.addEventListener('mouseenter', () => {
    if (!mainContentActive || !tooltipEnabled) return;
    centerMoonTooltip.style.display = 'block';
});

centerMoon.addEventListener('mousemove', (e) => {
    if (!tooltipEnabled) return;
    centerMoonTooltip.style.left = `${e.pageX + 15}px`;
    centerMoonTooltip.style.top = `${e.pageY + 15}px`;
});

centerMoon.addEventListener('mouseleave', () => {
    centerMoonTooltip.style.display = 'none';
});


const returnButton = document.getElementById('return-button');
const ancientMoonBG = document.getElementById('ancientmoon-bg');

returnButton.addEventListener('click', () => {
    souffle2Sound.currentTime = 0;
    souffle2Sound.play().catch(() => { });

    // Applique le zoom de la vidéo
    ancientMoonBG.style.transition = 'opacity 1.2s ease, transform 1.5s ease';
    ancientMoonBG.style.transform = 'scale(5)';
    ancientMoonBG.style.opacity = '0';

    // Applique le zoom + déplacement gauche sur le bouton
    returnButton.classList.add('exit-zoom');

    // Récupération des éléments du site
    const main = document.getElementById('main');
    const mainContent = document.getElementById('main-content');
    const discord = document.getElementById('discord-widget-container');
    const footer = document.getElementById('footer-text');
    const video = document.getElementById('ancientmoon-video');
    const sinPage = document.getElementById('sin-page');
    if (sinPage.classList.contains('visible')) {
        sinPage.style.transition = 'opacity 1.2s ease, transform 1.5s ease';
        sinPage.style.transform = 'scale(5)';
    }
    sinPage.classList.remove('visible');
    sinPage.style.transform = 'scale(2)';
    sinPage.style.opacity = '0';
    setTimeout(() => {
        // Réinitialiser la vidéo et la scène
        ancientMoonBG.classList.remove('visible');
        ancientMoonBG.classList.add('hidden');
        ancientMoonBG.style.transform = 'scale(2)';

        // Cacher le bouton de retour
        returnButton.classList.remove('exit-zoom', 'visible');
        returnButton.classList.add('hidden');
        returnButton.style.transform = 'scale(1)';

        // RÉAFFICHER LE CONTENU CENTRAL
        const main = document.getElementById('main');
        const mainContent = document.getElementById('main-content');
        const discord = document.getElementById('discord-widget-container');
        const footer = document.getElementById('footer-text');
        const centerMoon = document.getElementById('center-moon');
        const centerImage = document.getElementById('center-image');
        const circleItems = document.querySelectorAll('.circle-item');

        // Montre les blocs principaux
        main.classList.remove('hidden');
        main.style.opacity = '1';
        main.style.transform = 'scale(1)';
        main.style.pointerEvents = 'auto';

        mainContent.classList.remove('hidden');
        mainContent.classList.add('visible');
        mainContent.style.opacity = '1';
        mainContent.style.transform = 'translate(-50%, -50%) scale(1)';
        mainContent.style.pointerEvents = 'auto';

        // Lune centrale
        centerMoon.style.opacity = '1';
        centerMoon.style.pointerEvents = 'auto';

        // Image centrale
        centerImage.style.opacity = '1';
        centerImage.style.pointerEvents = 'none';

        // Réactiver les cercles
        circleItems.forEach(item => {
            item.style.opacity = '1';
            item.style.pointerEvents = 'auto';
        });

        // Discord
        if (discord) {
            discord.classList.add('visible');
            discord.style.opacity = '0.9';
            discord.style.pointerEvents = 'auto';
        }

        // Footer
        if (footer) {
            footer.style.opacity = '0.4';
        }
        centerMoonTooltip.style.display = 'none';
        // RÉACTIVER LA LOGIQUE
        tooltipEnabled = true;
        hasEnteredAncientMoon = false;
        mainContentActive = true;
    }, 1300);
});

let centerRotation = 0;
function animateParallax() {

    requestAnimationFrame(animateParallax);
}

let tooltipEnabled = true; // Nouveau flag global

fetch("https://siteapi-2.onrender.com/owner")
    .then(res => res.json())
    .then(data => {
        sinRepresentatives = data;

        document.querySelectorAll('.circle-item').forEach((item, index) => {
            const sin = sins[index];
            const normalizedTitle = normalizeString(sin.title);

            // Trouver le représentant
            let representativeName = "(représentant inconnu)";
            for (const [key, value] of Object.entries(sinRepresentatives)) {
                if (normalizeString(key) === normalizedTitle) {
                    representativeName = value.name; // ✅ utiliser name ici
                    break;
                }
            }

            // Créer la tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'sin-tooltip';
            tooltip.innerHTML = `
                <strong>${sin.title}</strong><br>
                ${sin.description}<br><br>
                <em>Représentant : ${representativeName}</em>
            `;
            document.body.appendChild(tooltip);
            tooltip.style.display = 'none';

            // Événements de survol
            item.addEventListener('mouseenter', () => {
                if (!mainContentActive || !tooltipEnabled) return;
                tooltip.style.display = 'block';
            });

            item.addEventListener('mousemove', (e) => {
                if (!tooltipEnabled) return;
                tooltip.style.left = `${e.pageX + 15}px`;
                tooltip.style.top = `${e.pageY + 15}px`;
            });

            item.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
        });
    })
    .catch(err => {
        console.error("Erreur API représentants :", err);
    });



animateParallax();
simulateLoading();
rotateCircleItems();
