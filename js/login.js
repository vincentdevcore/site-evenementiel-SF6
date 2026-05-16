const adminCard = document.querySelector(".admin-card");
let isResetting = false;

/* =========================
   STORAGE
========================= */

async function getRequests() {
  try {
    const response = await fetch("./api/getRequests.php", {
      credentials: "same-origin",
      cache: "no-store",
    });

    return await response.json();
  } catch (error) {
    console.error("Impossible de lire les demandes :", error);

    return [];
  }
}
async function saveRequests(requests) {
  try {
    await fetch("./api/saveRequests.php", {
      method: "POST",

      credentials: "same-origin",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(requests),
    });
  } catch (error) {
    console.error("Impossible de sauvegarder les demandes :", error);
  }
}

async function getPlayers() {
  try {
    const response = await fetch("./api/getPlayers.php", {
      credentials: "same-origin",
      cache: "no-store",
    });

    return await response.json();
  } catch (error) {
    console.error("Impossible de lire les joueurs :", error);

    return [];
  }
}

async function savePlayers(players) {
  try {
    await fetch("./api/savePlayers.php", {
      method: "POST",

      credentials: "same-origin",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(players),
    });
  } catch (error) {
    console.error("Impossible de sauvegarder les joueurs :", error);
  }
}

/* =========================
   ADMIN PANEL
========================= */

async function renderAdminPanel() {
  adminCard.classList.add("dashboard-mode");

  adminCard.innerHTML = `
    <header class="admin-dashboard-header">

      <h1>
        Gestion du tournoi
      </h1>

      <div class="admin-actions">

        <button class="btn-admin">
        Retour
        </button>

        <button id="resetBtn">
          Reset tournoi
        </button>

        <button id="clearPlayersBtn">
          Reset inscriptions
        </button>

        <button id="logoutBtn">
          Se déconnecter
        </button>

      </div>

    </header>

    <div class="admin-body">

      <section class="admin-requests">

        <h2>
          Demandes d'inscription
        </h2>

        <div
          class="requests-grid"
          id="requestsGrid"
        ></div>

      </section>

      <section class="admin-players">

        <h2>
          Joueurs
        </h2>

        <div
          class="players-grid"
          id="playersGrid"
        ></div>

      </section>
      <section class="admin-waiting">

  <h2>
    En attente
  </h2>

  <div
    class="waiting-grid"
    id="waitingGrid"
  ></div>

</section>

    </div>
  `;
  document.getElementById("logoutBtn").addEventListener("click", () => {
    window.location.href = "./logout.php";
  });

  document
    .getElementById("resetBtn")
    .addEventListener("click", resetTournament);

  document
    .getElementById("clearPlayersBtn")
    .addEventListener("click", resetRegistrations);

  await renderRequests();

  await renderPlayers();

  await renderWaitingPlayers();
  const returnBtn = document.querySelector(".btn-admin");

  returnBtn.addEventListener("click", () => {
    window.location.href = "./index.html";
  });
}

/* =========================
   REQUESTS
========================= */

async function renderRequests() {
  const requests = await getRequests();

  const grid = document.getElementById("requestsGrid");

  if (!grid) return;

  grid.replaceChildren();

  if (requests.length === 0) {
    const empty = document.createElement("p");

    empty.classList.add("admin-empty");

    empty.textContent = "Aucune demande pour le moment.";

    grid.appendChild(empty);

    return;
  }

  requests.forEach((req) => {
    const card = document.createElement("div");

    card.classList.add("request-card");

    const body = document.createElement("div");

    body.classList.add("request-card__body");

    const top = document.createElement("div");

    top.classList.add("request-card__top");

    const badge = document.createElement("span");

    badge.classList.add("badge");

    badge.textContent = req.rank;

    const status = document.createElement("span");

    status.classList.add("request-status");

    status.textContent = req.status;

    top.appendChild(badge);

    top.appendChild(status);

    const title = document.createElement("h3");

    title.textContent = req.name;

    const meta = document.createElement("p");

    meta.classList.add("request-card__meta");

    meta.textContent = req.character;

    const actions = document.createElement("div");

    actions.classList.add("request-card__actions");

    const acceptBtn = document.createElement("button");

    acceptBtn.classList.add("admin-btn", "admin-btn--accept");

    acceptBtn.textContent = "Accepter";

    acceptBtn.addEventListener("click", () => {
      handleRequestAction(req.id, "accept");
    });

    const rejectBtn = document.createElement("button");

    rejectBtn.classList.add("admin-btn", "admin-btn--reject");

    rejectBtn.textContent = "Refuser";

    rejectBtn.addEventListener("click", () => {
      handleRequestAction(req.id, "reject");
    });

    actions.appendChild(acceptBtn);

    actions.appendChild(rejectBtn);

    body.appendChild(top);

    body.appendChild(title);

    body.appendChild(meta);

    body.appendChild(actions);

    card.appendChild(body);

    grid.appendChild(card);
  });
}

/* =========================
   PLAYERS
========================= */

async function renderPlayers() {
  const players = await getPlayers();

  const grid = document.getElementById("playersGrid");

  if (!grid) return;

  grid.replaceChildren();

  const quarterPlayers = players.filter(
    (p) => p.stage === "quarter" && !p.eliminated,
  );

  const semiPlayers = players.filter(
    (p) => p.stage === "semi" && !p.eliminated,
  );

  const finalPlayers = players.filter(
    (p) => p.stage === "final" && !p.eliminated,
  );

  const champion = players.find((p) => p.stage === "champion");

  /* =========================
     QUARTERS
  ========================= */

  if (quarterPlayers.length > 0) {
    const quarterTitle = document.createElement("h2");

    quarterTitle.classList.add("stage-title");

    quarterTitle.textContent = "Quarts de finale";

    grid.appendChild(quarterTitle);

    for (let i = 0; i < quarterPlayers.length; i += 2) {
      const p1 = quarterPlayers[i];
      const p2 = quarterPlayers[i + 1];

      if (!p1 || !p2) continue;

      grid.appendChild(createMatchCard(p1, p2));
    }
  }

  /* =========================
     SEMIS
  ========================= */

  if (semiPlayers.length > 0) {
    const semiTitle = document.createElement("h2");

    semiTitle.classList.add("stage-title");

    semiTitle.textContent = "Demi-finales";

    grid.appendChild(semiTitle);

    for (let i = 0; i < semiPlayers.length; i += 2) {
      const p1 = semiPlayers[i];
      const p2 = semiPlayers[i + 1];

      if (!p1 || !p2) continue;

      grid.appendChild(createMatchCard(p1, p2));
    }
  }

  /* =========================
     FINAL
  ========================= */

  if (finalPlayers.length > 0) {
    const finalTitle = document.createElement("h2");

    finalTitle.classList.add("stage-title");

    finalTitle.textContent = "Finale";

    grid.appendChild(finalTitle);

    const p1 = finalPlayers[0];
    const p2 = finalPlayers[1];

    if (p1 && p2) {
      grid.appendChild(createMatchCard(p1, p2));
    }
  }

  /* =========================
     CHAMPION
  ========================= */

  if (champion) {
    const championCard = document.createElement("div");

    championCard.classList.add("champion-card");

    championCard.textContent = `🏆 Champion : ${champion.name}`;

    grid.appendChild(championCard);
  }
}
async function renderWaitingPlayers() {
  const players = await getPlayers();

  const grid = document.getElementById("waitingGrid");

  if (!grid) return;

  grid.replaceChildren();

  const waitingPlayers = players.filter(
    (p) => p.stage === "quarter" && !p.eliminated,
  );

  if (waitingPlayers.length % 2 === 0) {
    const empty = document.createElement("p");

    empty.classList.add("admin-empty");

    empty.textContent = "Aucun joueur en attente.";

    grid.appendChild(empty);

    return;
  }

  const waitingPlayer = waitingPlayers[waitingPlayers.length - 1];

  const card = document.createElement("div");

  card.classList.add("waiting-card");

  const name = document.createElement("h3");

  name.textContent = waitingPlayer.name;

  const rank = document.createElement("p");

  rank.textContent = waitingPlayer.rank;

  const text = document.createElement("span");

  text.textContent = "En attente d’un adversaire...";

  card.appendChild(name);

  card.appendChild(rank);

  card.appendChild(text);

  grid.appendChild(card);
}

function createMatchCard(player1, player2) {
  const matchCard = document.createElement("div");

  matchCard.classList.add("match-card");

  /* PLAYER 1 */

  const fighter1 = document.createElement("div");

  fighter1.classList.add("fighter");

  const fighter1Name = document.createElement("span");

  fighter1Name.classList.add("fighter-name");

  fighter1Name.textContent = player1.name;

  const fighter1Rank = document.createElement("span");

  fighter1Rank.classList.add("fighter-rank");

  fighter1Rank.textContent = player1.rank;

  const fighter1Btn = document.createElement("button");

  fighter1Btn.classList.add("fight-btn");

  fighter1Btn.textContent = "WIN";

  fighter1Btn.addEventListener("click", () => {
    updateMatchResult(player1.id, player2.id);
  });

  fighter1.appendChild(fighter1Name);

  fighter1.appendChild(fighter1Rank);

  fighter1.appendChild(fighter1Btn);

  /* VS */

  const vsBlock = document.createElement("div");

  vsBlock.classList.add("vs-block");

  vsBlock.textContent = "VS";

  /* PLAYER 2 */

  const fighter2 = document.createElement("div");

  fighter2.classList.add("fighter");

  const fighter2Name = document.createElement("span");

  fighter2Name.classList.add("fighter-name");

  fighter2Name.textContent = player2.name;

  const fighter2Rank = document.createElement("span");

  fighter2Rank.classList.add("fighter-rank");

  fighter2Rank.textContent = player2.rank;

  const fighter2Btn = document.createElement("button");

  fighter2Btn.classList.add("fight-btn");

  fighter2Btn.textContent = "WIN";

  fighter2Btn.addEventListener("click", () => {
    updateMatchResult(player2.id, player1.id);
  });

  fighter2.appendChild(fighter2Name);

  fighter2.appendChild(fighter2Rank);

  fighter2.appendChild(fighter2Btn);

  /* APPEND */

  matchCard.appendChild(fighter1);

  matchCard.appendChild(vsBlock);

  matchCard.appendChild(fighter2);

  return matchCard;
}
/* =========================
   MATCH RESULT
========================= */

async function updateMatchResult(winnerId, loserId) {
  const players = await getPlayers();

  const winner = players.find((p) => p.id === winnerId);

  const loser = players.find((p) => p.id === loserId);

  if (!winner || !loser) return;

  if (loser.eliminated) return;

  /* =========================
     FINAL
  ========================= */

  if (winner.stage === "final") {
    await playFinalAnimation(winnerId, loserId);

    return;
  }

  /* =========================
     NORMAL MATCH
  ========================= */

  winner.win += 1;

  loser.lose += 1;

  loser.eliminated = true;

  if (winner.stage === "quarter") {
    winner.stage = "semi";
  } else if (winner.stage === "semi") {
    winner.stage = "final";
  }

  await savePlayers(players);

  await renderPlayers();

  await renderWaitingPlayers();
}

/* =========================
   ACCEPT / REJECT
========================= */

async function handleRequestAction(id, action) {
  const requests = await getRequests();

  const requestIndex = requests.findIndex((req) => req.id === id);

  if (requestIndex === -1) return;

  const request = requests[requestIndex];

  if (action === "accept") {
    const players = await getPlayers();

    players.push({
      id: Date.now().toString(),
      name: request.name,
      email: request.email,
      character: request.character,
      rank: request.rank,
      win: 0,
      lose: 0,
      stage: "quarter",
      eliminated: false,
    });

    await savePlayers(players);
  }

  requests.splice(requestIndex, 1);

  await saveRequests(requests);

  await renderRequests();

  await renderPlayers();

  await renderWaitingPlayers();
}

/* =========================
   RESET TOURNAMENT
========================= */
async function resetTournament() {
  const players = await getPlayers();

  players.forEach((player) => {
    player.win = 0;
    player.lose = 0;

    player.stage = "quarter";
    player.eliminated = false;
  });

  await savePlayers(players);

  /* rerender admin */
  await renderPlayers();

  await renderWaitingPlayers();

  alert("Tournoi réinitialisé");
}

/* =========================
   RESET PLAYERS
========================= */

async function resetRegistrations() {
  isResetting = true;

  await savePlayers([]);

  await saveRequests([]);

  await renderRequests();

  await renderPlayers();

  await renderWaitingPlayers();

  alert("Toutes les inscriptions ont été supprimées.");

  isResetting = false;
}
/* =========================
   AUTO LOGIN
========================= */

async function playFinalAnimation(winnerId, loserId) {
  const players = await getPlayers();

  const winner = players.find((p) => p.id === winnerId);

  const loser = players.find((p) => p.id === loserId);

  if (!winner || !loser) {
    return;
  }

  winner.win += 1;

  loser.lose += 1;

  loser.eliminated = true;

  winner.stage = "champion";

  await savePlayers(players);

  await renderPlayers();

  await renderWaitingPlayers();
}

renderAdminPanel();

setInterval(async () => {
  if (isResetting) {
    return;
  }

  await renderRequests();

  await renderWaitingPlayers();
}, 2000);
