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
let sinApotres = {};
let sinMembres = {};

const phrases = [
    { text: "Lors de l'air des huit lunes, l'éclats de leurs volontés glorifiaient la paix et l'entente", symbol: "assets/symbol1.png" },
    { text: "A un moment les tois lunes de La paresse, l'Envie et l'avarice se crachèrent et eclatèrent en mille morceaux", symbol: "assets/symbol2.png" },
    { text: "Leurs derniers morceux furent ramassés par le CEO de la Gang Gang corporation, les pécheurs purent alors gérer plainement leurs sociétés", symbol: "assets/symbol3.png" },
    { text: "L'implosion de la Luxure et de la Gourmandise fut témoins du mariage de deux futurs pécheurs, près à répendre leurs dévotions.", symbol: "assets/symbol4.png" },
    { text: "L'Orgueil et la Colère disparaissent sans laissé trace, derrière laquelle beaucoup tentèrent en vain de les contrôler, les échos de wolfdefender et d'un pigeon se font encore entendre.", symbol: "assets/symbol5.png" },
    { text: "Les apotres prient pour leurs pécheurs et la dernière lune veillent a la stabilités, les péchès n'estompent pas la paix mais rendent la liberté.", symbol: "assets/symbol6.png" }
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
    }, 80); // 0.3s par point → 8 points = 2.4s total
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
    symbolImg = NULL;
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

    rotationAngle += 0.0015; // ⚠️ Plus lent que 0.002

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
    loadAnnonces();
    loadClassement();
    const annoncesContainer = document.getElementById("annonces-container");
    annoncesContainer.classList.remove("hidden");
    setTimeout(() => annoncesContainer.classList.add("visible"), 500);
    showSearchBar();
    if (classementWidget) {
         classementWidget.classList.remove("hidden");
        // petit délai pour déclencher la transition CSS
         setTimeout(() => classementWidget.classList.add("visible"), 500);
    }
    const visualizer = document.getElementById("audio-visualizer");
    setTimeout(() => visualizer.classList.add("visible"), 500);
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
    hideSearchBar();
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
    const annoncesContainer = document.getElementById("annonces-container");
    if (annoncesContainer) {
        annoncesContainer.style.transition = 'opacity 1s ease';
        annoncesContainer.style.opacity = '0';
        annoncesContainer.style.pointerEvents = 'none';
    }
    if (classementWidget) {
         classementWidget.style.transition = 'opacity 1s ease';
         classementWidget.style.opacity = '0';
          classementWidget.style.pointerEvents = 'none';
         classementWidget.classList.remove("visible");
    } 
    const visualizer = document.getElementById("audio-visualizer");
    if (visualizer) {
        visualizer.style.transition = "opacity 1s ease";
        visualizer.style.opacity = "0";
        visualizer.style.pointerEvents = "none"; // si vous ne voulez pas de clics
    }  
    // Après la transition, on montre la vidéo
    setTimeout(() => {
        const ancientMoon = document.getElementById('ancientmoon-bg');
        const ancientVideo = document.getElementById('ancientmoon-video');

        ancientMoon.classList.remove('hidden');
        ancientMoon.style.opacity = '1';
        ancientMoon.style.transform = 'scale(1)';

        // 👉 Nouvelle animation du texte
        const overlay = document.getElementById('ancientmoon-overlay');
        setTimeout(() => overlay.classList.add('visible'), 1200);

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
        discord.style.transition = 'opacity 2.5s ease';
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
    const annoncesContainer = document.getElementById("annonces-container");
    if (annoncesContainer) {
        annoncesContainer.style.transition = 'opacity 1s ease';
        annoncesContainer.style.opacity = '0';
        annoncesContainer.style.pointerEvents = 'none';
    }
    if (classementWidget) {
         classementWidget.style.transition = 'opacity 1s ease';
         classementWidget.style.opacity = '0';
          classementWidget.style.pointerEvents = 'none';
         classementWidget.classList.remove("visible");
    }
    const visualizer = document.getElementById("audio-visualizer");
    if (visualizer) {
        visualizer.style.transition = "opacity 1s ease";
        visualizer.style.opacity = "0";
        visualizer.style.pointerEvents = "none"; // si vous ne voulez pas de clics
    }
    
    const pecheurSection = document.getElementById('pecheur-section');

hideSearchBar();
sinMessage.innerHTML = "";
sinMessage.removeAttribute("class"); // enlève toutes les classes
sinMessage.removeAttribute("style"); // enlève styles inline
pecheurSection.classList.add("hidden");

// --- CAS AVEC REPRÉSENTANT ---
if (representative && representative.name !== "aucun" && representative.name !== "Place vacante") {
    pecheurSection.classList.remove("hidden");
    document.getElementById("pecheur-title").style.display = "block";

    // Important : enlever vacant si jamais défini avant
    sinMessage.classList.remove("vacant");

    sinMessage.innerHTML = `
        <div class="player-card" onclick="openMemberProfile('${representative.name}')">
            <img src="${representative.avatar}" alt="${representative.name}" />
            <div class="player-info">
                <div class="player-name">${representative.name}</div>
            </div>
        </div>
    `;

    sinBackground.innerHTML = `<img id="sin-bg-img" src="assets/${sin.title}.png" alt="${sin.title}" draggable="false">`;
        sinBackground.style.backgroundColor = 'transparent';
        const bgImg = sinBackground.querySelector('img');
        if (bgImg) {
            bgImg.addEventListener('dragstart', e => e.preventDefault());
            bgImg.style.pointerEvents = 'none';
            bgImg.style.userSelect = 'none';
            bgImg.style.width = '100%';
            bgImg.style.height = 'auto';
        }
    const elements = document.querySelectorAll(".section-title");
    elements.forEach(el => {
  el.style.marginTop = "0px";
    });
// --- CAS VACANT ---
} else {
    pecheurSection.classList.remove("hidden");
    document.getElementById("pecheur-title").style.display = "none";

    sinBackground.innerHTML = '';
    sinBackground.style.backgroundColor = 'black';

    // ✅ Réapplique bien le style vacant
    sinMessage.classList.add("vacant");
    sinMessage.textContent = "La lune a cessé d’émettre depuis des millénaires, pourtant son éternel souverain ne s’est pas encore dévoilé.";

    const elements = document.querySelectorAll(".section-title");
    elements.forEach(el => {
  el.style.marginTop = "500px";
    });
}

    // Charger les apôtres pour ce péché
    const apotreSection = document.getElementById("apotre-section");
    const apotreContainer = document.getElementById("apotre-container");
    const apotreTitle = document.getElementById("apotre-title");

    apotreContainer.innerHTML = ""; // reset
    apotreSection.classList.add("hidden");

    // Chercher la liste d'apôtres pour ce péché
    const apotres = sinApotres[sin.title] || [];

    // Si il y en a, on les affiche
    if (apotres.length > 0) {
        apotreSection.classList.remove("hidden");
        apotres.forEach(a => {
            const card = document.createElement("div");
            card.className = "apotre-card";
            card.setAttribute("onclick", `openMemberProfile('${a.name}')`);
            card.innerHTML = `
                <img src="${a.avatar || "assets/default-avatar.png"}" alt="Avatar">
                <div class="apotre-name">${a.name}</div>
            `;
            apotreContainer.appendChild(card);
            });
    }
    // === SECTION MEMBRES ===
    const membresSection = document.getElementById("membres-section");
    const membresContainer = document.getElementById("membres-container");

    // Reset
    membresContainer.innerHTML = "";
    membresSection.classList.add("hidden");

    // Filtrage : Membres → qui ont CE péché → PAS apôtres → PAS pécheurs → PAS "Place vacante"
    const membresFiltres = sinMembres.filter(m => {
        return m.roles.includes(sin.title) &&
            m.roles.includes("Membres") &&
            !m.roles.includes("Apotre") &&
            !m.roles.includes("Pécheurs") &&
            m.name !== "Place vacante";
    });

    // Si au moins un membre trouvé → affichage
    if (membresFiltres.length > 0) {
        membresSection.classList.remove("hidden");

        membresFiltres.forEach(a => {
            const card = document.createElement("div");
            card.className = "apotre-card";
            card.setAttribute("onclick", `openMemberProfile('${a.name}')`);
            card.innerHTML = `
                <img src="${a.avatar}" alt="${a.name}">
                <div class="apotre-name">${a.name}</div>
            `;
            membresContainer.appendChild(card);
        });
    }



    // Empêche le scroll du body (on scrollera à l'intérieur de #sin-page)
    document.body.classList.add('no-scroll');

    // Affichage progressif (comme avant)
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
  <strong>Moon</strong><br>
  La dernière lune subsiste depuis des millénaires,
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
            setTimeout(() => {
                discord.style.opacity = '0.9';
                discord.style.pointerEvents = 'auto';
            }, 600);
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
        document.body.classList.remove('no-scroll');
        const sinBg = document.getElementById('sin-background');
        const sinMsg = document.getElementById('sin-message');
        sinMsg.style.pointerEvents = 'none';
        if (sinBg) sinBg.innerHTML = '';
        if (sinMsg) sinMsg.innerHTML = '';
        const annoncesContainer = document.getElementById("annonces-container");
        if (annoncesContainer) {
            annoncesContainer.classList.remove("hidden");
            setTimeout(() => {
                annoncesContainer.style.opacity = '1';
                annoncesContainer.style.pointerEvents = 'auto';
            }, 600);
        }
        if (classementWidget) {
            classementWidget.classList.remove('hidden');
            setTimeout(() => {
                 classementWidget.style.opacity = '1';
                 classementWidget.style.pointerEvents = 'auto';
                 classementWidget.classList.add('visible');
             }, 600);
        }
        const visualizer = document.getElementById("audio-visualizer");
        showSearchBar();
visualizer.classList.remove("hidden");

setTimeout(() => {
    visualizer.style.opacity = "1";
}, 600);
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
// === ANNONCES ===
function loadAnnonces() {
    fetch("https://siteapi-2.onrender.com/annonces")
        .then(res => res.json())
        .then(data => {
            const annoncesList = document.getElementById("annonces-list");
            annoncesList.innerHTML = "";

            if (data.annonces && data.annonces.length > 0) {
                data.annonces.forEach(a => {
                    const card = document.createElement("div");
                    card.className = "annonce-card";
                    card.innerHTML = `
            <img class="annonce-avatar" src="${a.author_avatar || "assets/default-avatar.png"}" alt="avatar">
            <div class="annonce-body">
              <div class="annonce-name">${a.author_name}</div>
              <div class="annonce-content">${a.content || ""}</div>
            </div>
          `;
                    annoncesList.appendChild(card);
                });
            }
        })
        .catch(err => console.error("Erreur API annonces :", err));
}

fetch("https://siteapi-2.onrender.com/apotres")
    .then(res => res.json())
    .then(data => {
        sinApotres = data.apotres || {};
    })
    .catch(err => console.error("Erreur API apôtres :", err));

fetch("https://siteapi-2.onrender.com/membres")
  .then(res => res.json())
  .then(data => {
      sinMembres = data.membres || [];
  })
  .catch(err => console.error("Erreur API membres :", err));

// Classement
async function loadClassement() {
  try {
    const res = await fetch("https://siteapi-2.onrender.com/classement");
    if (!res.ok) throw new Error("Status " + res.status);
    const data = await res.json();

    const container = document.getElementById("classement-container");
    if (!container) return;
    container.innerHTML = ""; // reset

    const list = data.ClassementPeche || [];
    if (list.length === 0) {
      container.innerHTML = `<div style="padding:12px;color:#bbb">Aucun classement disponible.</div>`;
      return;
    }

    // Création des cartes
    list.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "classement-card";

      // contenu : nom à gauche (prend la largeur), compte à droite
      card.innerHTML = `
        <span class="peche-name">${index + 1}. ${escapeHtml(item.peche)}</span>
        <span class="peche-count">${Number(item.count) || 0} membres</span>
      `;
      container.appendChild(card);
    });

  } catch (err) {
    console.error("[Classement] Erreur:", err);
    const container = document.getElementById("classement-container");
    if (container) container.innerHTML = `<div style="padding:12px;color:#c66">Erreur chargement classement</div>`;
  }
}

async function loadClassementJeux() {
  try {
    const res = await fetch("https://siteapi-2.onrender.com/classement");
    if (!res.ok) throw new Error("Status " + res.status);
    const data = await res.json();

    const container = document.getElementById("classement-container");
    if (!container) return;
    container.innerHTML = ""; // reset

    const list = data.ClassementJeux || [];
    if (list.length === 0) {
      container.innerHTML = `<div style="padding:12px;color:#bbb">Aucun classement disponible.</div>`;
      return;
    }

    // Création des cartes
    list.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "classement-card";

      card.innerHTML = `
        <span class="peche-name">${index + 1}. ${escapeHtml(item.jeu)}</span>
        <span class="peche-count">${Number(item.count) || 0} joueurs</span>
      `;
      container.appendChild(card);
    });

  } catch (err) {
    console.error("[Classement Jeux] Erreur:", err);
    const container = document.getElementById("classement-container");
    if (container) container.innerHTML = `<div style="padding:12px;color:#c66">Erreur chargement classement</div>`;
  }
}


// util pour échapper du texte venant de l'API (sécurité basique)
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


// --- INITIALISATION WIDGET Classement ---
const classementWidget = document.getElementById("classement-widget");
const btnPeches = document.getElementById("btn-classement-peches");
const btnJeux = document.getElementById("btn-classement-jeux");

if (btnJeux) {
  btnJeux.addEventListener("click", () => {
    loadClassementJeux();
    document.querySelectorAll("#classement-nav button").forEach(b => b.classList.remove("active"));
    btnJeux.classList.add("active");
  });
}

if (btnPeches) {
  btnPeches.addEventListener("click", () => {
    loadClassement();
    document.querySelectorAll("#classement-nav button").forEach(b => b.classList.remove("active"));
    btnPeches.classList.add("active");
  });
}


// --- Gestion bouton nav-bar ---
document.getElementById("btn-classement-peches").addEventListener("click", () => {
  // Pour l’instant un seul onglet => juste recharger
  loadClassement();

  // reset les boutons de la mini nav-bar
  document.querySelectorAll("#classement-page .flex button").forEach(btn => btn.classList.remove("active"));
  document.getElementById("btn-classement-peches").classList.add("active");
});

// === HOVER CARD POUR LES MEMBRES ===
const hoverCard = document.createElement("div");
hoverCard.className = "member-hover-card";
document.body.appendChild(hoverCard);

function showMemberCard(member, x, y) {
  if (!member) return;

  const rolesList = [...member.roles] // copie pour ne pas modifier l’original
  .reverse()                        // 🔁 inverse l’ordre
  .map(r => `<div class="role">${r}</div>`)
  .join("");

  hoverCard.innerHTML = `
    <div class="member-hover-top">
      <img src="${member.avatar}" alt="${member.name}">
      <div class="member-info">
        <div class="name">${member.name}</div>
        <div class="realname">${member.realname || ""}</div>
      </div>
    </div>
    <div class="roles">${rolesList}</div>
  `;

  hoverCard.style.left = `${x + 20}px`;
  hoverCard.style.top = `${y}px`;
  hoverCard.classList.add("visible");
}

function moveMemberCard(x, y) {
  hoverCard.style.left = `${x + 20}px`;
  hoverCard.style.top = `${y}px`;
}

function hideMemberCard() {
  hoverCard.classList.remove("visible");
}

// 🔥 Active la carte sur tous les membres et apôtres dynamiques
document.addEventListener("mouseover", (e) => {
  const card = e.target.closest(".apotre-card, .player-card");
  if (!card) return;

  const nameEl = card.querySelector(".apotre-name, .player-name");
  if (!nameEl) return;

  const member = sinMembres.find(m => m.name === nameEl.textContent.trim());
  if (member) showMemberCard(member, e.pageX, e.pageY);
});

document.addEventListener("mousemove", (e) => {
  if (hoverCard.classList.contains("visible")) moveMemberCard(e.pageX, e.pageY);
});

document.addEventListener("mouseout", (e) => {
  if (e.relatedTarget && hoverCard.contains(e.relatedTarget)) return;
  hideMemberCard();
});



const searchContainer = document.getElementById("search-container");
const searchInput = document.getElementById("search-input");
const suggestionsBox = document.getElementById("suggestions");

function showSearchBar() {
  searchContainer.classList.remove("hidden");
  setTimeout(() => {
    searchContainer.classList.add("visible");
  }, 600);
}

function hideSearchBar() {
  searchContainer.classList.remove("visible");
  setTimeout(() => {
    searchContainer.classList.add("hidden");
  }, 800);
}

// 🟡 Fonction utilitaire pour mettre en surbrillance le texte saisi
function highlightMatch(text, query) {
  if (!text || !query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, `<span class="highlight">$1</span>`);
}

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  if (query.length < 2) {
    suggestionsBox.classList.add("hidden");
    return;
  }

  const results = sinMembres.filter(m =>
    m.name.toLowerCase().includes(query) ||
    (m.realname && m.realname.toLowerCase().includes(query)) ||
    (m.roles && m.roles.some(r => r.toLowerCase().includes(query)))
  );

  if (results.length === 0) {
    suggestionsBox.innerHTML = `<div class="suggestion-item">Aucun résultat</div>`;
  } else {
    suggestionsBox.innerHTML = results
      .map(m => {
        const highlightedName = highlightMatch(m.name, query);
        const highlightedRealname = highlightMatch(m.realname || "", query);
        const highlightedRoles = (m.roles || [])
        .slice() // copie pour ne pas modifier le tableau original
        .reverse()
        .map(r => `<div class="suggestion-role">${highlightMatch(r, query)}</div>`)
        .join("");
        
        return `
          <div class="suggestion-item" data-name="${m.name}" onclick="window.open('membre.html?n=${encodeURIComponent(m.name)}', '_blank')">
            <div class="suggestion-header">
              <img class="suggestion-avatar" src="${m.avatar}" alt="avatar">
              <div>
                <div class="suggestion-name">${highlightedName}</div>
                <div class="suggestion-realname">${highlightedRealname}</div>
              </div>
            </div>
            <div class="suggestion-roles">
              ${highlightedRoles}
            </div>
          </div>
        `;
      })
      .join("");
  }

  suggestionsBox.classList.remove("hidden");
});

// 🖱 Clique sur un résultat
suggestionsBox.addEventListener("click", (e) => {
  const item = e.target.closest(".suggestion-item");
  if (!item) return;
  const name = item.getAttribute("data-name");
  searchInput.value = name;
  suggestionsBox.classList.add("hidden");

  const member = sinMembres.find(m => m.name === name);
  if (member) showMemberCard(member, window.innerWidth / 2 - 140, window.innerHeight / 2 - 100);
});

document.addEventListener("click", (e) => {
  if (!searchContainer.contains(e.target)) {
    suggestionsBox.classList.add("hidden");
  }
});

function openMemberProfile(realname) {
  if (!realname) return;
  window.open(`membre.html?n=${encodeURIComponent(realname)}`, "_blank");
}



// Charger les annonces après affichage du contenu principal
setTimeout(() => { loadAnnonces(); loadClassement(); }, 6000);

animateParallax();
simulateLoading();
rotateCircleItems();










// === AUDIO VISUALIZER ===
const audio = bgMusic
const canvas = document.getElementById("audio-visualizer");
const ctx = canvas.getContext("2d");

// Resize dynamique
function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Web Audio API
let audioCtx, analyser, source;

function initAudioVisualizer() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
    } else {
        // si le contexte existe déjà, juste le reprendre
        if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }
    }
}

// Dessin
function draw() {
    if (!analyser) return;
    requestAnimationFrame(draw);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
    }
}

// Lancer après interaction utilisateur
document.body.addEventListener("click", () => {
    initAudioVisualizer();
    draw();
});






