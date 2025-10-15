// membre.js — version Astral Lune

const urlParams = new URLSearchParams(window.location.search);
const targetRealName = urlParams.get('n');
const container = document.getElementById('profile-container');

if (!targetRealName) {
  container.innerHTML = "<p>Aucun membre spécifié.</p>";
}

fetch("https://siteapi-2.onrender.com/membres")
  .then(res => res.json())
  .then(data => {
    const membres = data.membres || [];
    const membre = membres.find(m => m.name === targetRealName);

    if (!membre) {
      container.innerHTML = "<p>Membre introuvable.</p>";
      return;
    }

    container.innerHTML = `
      <div class="profile-card-astral">
        <img class="profile-avatar" src="${membre.avatar}" alt="${membre.name}">
        <div class="profile-info">
          <h1 class="profile-name">${membre.name}</h1>
          <p class="profile-realname">${membre.realname}</p>
          <div class="profile-roles">
            ${membre.roles.map(r => `<span class="role-tag">${r}</span>`).join("")}
          </div>
        </div>
      </div>
    `;
  })
  .catch(() => {
    container.innerHTML = "<p>Erreur lors du chargement.</p>";
  });

