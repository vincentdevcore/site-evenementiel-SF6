const cta = document.querySelector(".cta");

const winnerImpact = document.getElementById("winner-impact");

const formContainer = document.getElementById("form-container");

const form = document.getElementById("register-form");

const inputName = document.getElementById("player-name");

const inputEmail = document.getElementById("player-email");

const inputCharacter = document.getElementById("character");

const inputRank = document.getElementById("rank");

let lastPlayersData = "";

/* =========================
   OPEN FORM
========================= */

cta.addEventListener("click", (e) => {
  e.preventDefault();

  formContainer.classList.toggle("active");
});

/* =========================
   CLOSE FORM OUTSIDE CLICK
========================= */

document.addEventListener("click", (e) => {
  const clickedInsideForm = formContainer.contains(e.target);

  const clickedButton = cta.contains(e.target);

  if (!clickedInsideForm && !clickedButton) {
    formContainer.classList.remove("active");
  }
});

/* =========================
   REGISTER
========================= */

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = inputName.value.trim();

  const email = inputEmail.value.trim().toLowerCase();

  const character = inputCharacter.value.trim();

  const rank = inputRank.value;

  if (!name || !email || !character || !rank) {
    alert("Merci de remplir tous les champs.");

    return;
  }

  const requests = await getRequests();

  const existing = requests.find((req) => req.email === email);

  if (existing && existing.status === "pending") {
    alert("Tu as déjà une demande en attente.");

    return;
  }

  const request = {
    id: Date.now().toString(),
    name,
    email,
    character,
    rank,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  if (existing) {
    const index = requests.findIndex((req) => req.email === email);

    requests[index] = request;
  } else {
    requests.push(request);
  }

  await saveRequests(requests);

  alert("✅ Demande envoyée.");

  form.reset();
});

/* =========================
   API STORAGE
========================= */

async function getRequests() {
  try {
    const response = await fetch("./api/getRequests.php");

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
    const response = await fetch("./api/getPlayers.php");

    return await response.json();
  } catch (error) {
    console.error("Impossible de lire les joueurs :", error);

    return [];
  }
}

/* =========================
   RENDER BRACKET
========================= */

async function renderBracket() {
  const players = await getPlayers();

  resetBracketVisuals();

  winnerImpact.classList.remove("active");

  winnerImpact.replaceChildren();

  document.querySelectorAll(".player").forEach((slot) => {
    slot.replaceChildren();
  });

  players.forEach((player, index) => {
    const slot = document.querySelector(`.p${index + 1}`);

    if (!slot) {
      return;
    }

    /* reset visuel */
    slot.classList.remove("winner", "loser", "qualified", "advance");

    slot.style.opacity = "";
    slot.style.visibility = "visible";

    if (!slot.hasChildNodes()) {
      const img = document.createElement("img");

      img.src = `./img/${encodeURIComponent(player.character)}.png`;

      img.alt = player.character;

      const nameDiv = document.createElement("div");

      nameDiv.classList.add("player-name");

      nameDiv.textContent = player.name;

      slot.appendChild(img);

      slot.appendChild(nameDiv);
    }

    const img = slot.querySelector("img");

    if (img) {
      img.style.opacity = "";
      img.style.filter = "";
    }

    if (player.eliminated) {
      slot.classList.add("loser");

      if (img) {
        img.style.opacity = "0.35";

        img.style.filter = "grayscale(1)";
      }
    }
  });
}

function resetBracketVisuals() {
  document.querySelectorAll(".player").forEach((player) => {
    player.classList.remove("winner", "loser", "qualified", "advance");

    player.style.opacity = "";

    player.style.visibility = "";

    const img = player.querySelector("img");

    if (img) {
      img.style.opacity = "";

      img.style.filter = "";
    }
  });

  document.querySelectorAll(".line").forEach((line) => {
    line.classList.remove("active", "active-left", "active-right");
  });
}

/* =========================
   MATCHES
========================= */

const bracketMatches = [
  {
    stage: "quarter",
    winner: ".p1",
    loser: ".p2",
    next: ".semi1",
    line: ".round-1",
    verticalWinner: ".vertical",
    verticalLoser: ".vertical-2",
  },

  {
    stage: "quarter",
    winner: ".p3",
    loser: ".p4",
    next: ".semi2",
    line: ".round-2",
    verticalWinner: ".vertical-3",
    verticalLoser: ".vertical-4",
  },

  {
    stage: "quarter",
    winner: ".p5",
    loser: ".p6",
    next: ".semi3",
    line: ".round-3",
    verticalWinner: ".vertical-5",
    verticalLoser: ".vertical-6",
  },

  {
    stage: "quarter",
    winner: ".p7",
    loser: ".p8",
    next: ".semi4",
    line: ".round-4",
    verticalWinner: ".vertical-7",
    verticalLoser: ".vertical-8",
  },

  {
    stage: "semi",
    winner: ".semi1",
    loser: ".semi2",
    next: ".final1",
    line: ".demi-final-1",
    verticalWinner: ".vertical-win",
    verticalLoser: ".vertical-win-2",
  },

  {
    stage: "semi",
    winner: ".semi3",
    loser: ".semi4",
    next: ".final2",
    line: ".demi-final-2",
    verticalWinner: ".vertical-win-3",
    verticalLoser: ".vertical-win-4",
  },

  {
    stage: "final",
    winner: ".final1",
    loser: ".final2",
    next: ".champion",
    line: ".finale",
    verticalWinner: ".vertical-win-5",
    verticalLoser: ".vertical-win-6",
  },
];

/* =========================
   NEXT MATCH
========================= */

async function renderNextMatch() {
  const players = await getPlayers();

  const nextPlayer1 = document.getElementById("nextPlayer1");

  const nextPlayer2 = document.getElementById("nextPlayer2");

  const nextStage = document.getElementById("nextStage");

  if (!nextPlayer1 || !nextPlayer2 || !nextStage) {
    return;
  }

  const quarterPlayers = players.filter(
    (p) => p.stage === "quarter" && !p.eliminated,
  );

  if (quarterPlayers.length >= 2) {
    nextPlayer1.textContent = quarterPlayers[0].name;

    nextPlayer2.textContent = quarterPlayers[1].name;

    nextStage.textContent = "Quarts de finale";

    return;
  }

  const semiPlayers = players.filter(
    (p) => p.stage === "semi" && !p.eliminated,
  );

  if (semiPlayers.length >= 2) {
    nextPlayer1.textContent = semiPlayers[0].name;

    nextPlayer2.textContent = semiPlayers[1].name;

    nextStage.textContent = "Demi-finale";

    return;
  }

  const finalPlayers = players.filter(
    (p) => p.stage === "final" && !p.eliminated,
  );

  if (finalPlayers.length >= 2) {
    nextPlayer1.textContent = finalPlayers[0].name;

    nextPlayer2.textContent = finalPlayers[1].name;

    nextStage.textContent = "Finale";

    return;
  }

  const champion = players.find((p) => p.stage === "champion");

  if (champion) {
    nextPlayer1.textContent = champion.name;

    nextPlayer2.textContent = "🏆";

    nextStage.textContent = "Champion";

    return;
  }

  nextPlayer1.textContent = "-";

  nextPlayer2.textContent = "-";

  nextStage.textContent = "En attente";
}

/* =========================
   SHOW WINNER IMPACT
========================= */

function showWinnerImpact(name) {
  if (!winnerImpact) {
    return;
  }

  winnerImpact.replaceChildren();

  const impactName = document.createElement("span");

  impactName.classList.add("impact-name");

  impactName.textContent = name;

  const impactWin = document.createElement("span");

  impactWin.classList.add("impact-win");

  impactWin.textContent = "WINS";

  winnerImpact.appendChild(impactName);

  winnerImpact.appendChild(impactWin);

  winnerImpact.classList.remove("active");

  void winnerImpact.offsetWidth;

  winnerImpact.classList.add("active");
}

/* =========================
   ANIMATE BRACKET
========================= */

async function animateBracket() {
  const players = await getPlayers();

  /* QUARTS */

  for (let i = 0; i < 4; i++) {
    const match = bracketMatches[i];

    const leftPlayer = players[i * 2];

    const rightPlayer = players[i * 2 + 1];

    if (!leftPlayer || !rightPlayer) {
      continue;
    }

    if (
      !leftPlayer.eliminated &&
      ["semi", "final", "champion"].includes(leftPlayer.stage)
    ) {
      advancePlayer(match, 1);
    }

    if (
      !rightPlayer.eliminated &&
      ["semi", "final", "champion"].includes(rightPlayer.stage)
    ) {
      advancePlayer(match, 2);
    }
  }

  /* DEMIS */

  const semiPlayers = players.filter((p) =>
    ["semi", "final", "champion"].includes(p.stage),
  );

  if (semiPlayers.length >= 4) {
    for (let i = 0; i < 2; i++) {
      const match = bracketMatches[4 + i];

      const leftPlayer = semiPlayers[i * 2];

      const rightPlayer = semiPlayers[i * 2 + 1];

      if (!leftPlayer || !rightPlayer) {
        continue;
      }

      if (
        !leftPlayer.eliminated &&
        ["final", "champion"].includes(leftPlayer.stage)
      ) {
        advancePlayer(match, 1);
      }

      if (
        !rightPlayer.eliminated &&
        ["final", "champion"].includes(rightPlayer.stage)
      ) {
        advancePlayer(match, 2);
      }
    }
  }

  /* FINALE */

  const finalists = players.filter((p) =>
    ["final", "champion"].includes(p.stage),
  );

  if (finalists.length >= 2) {
    const finalMatch = bracketMatches[6];

    if (finalists[0].stage === "champion") {
      advancePlayer(finalMatch, 1);
    }

    if (finalists[1].stage === "champion") {
      advancePlayer(finalMatch, 2);
    }
  }
}

/* =========================
   ADVANCE PLAYER
========================= */

function advancePlayer(match, winnerSide) {
  const winner = document.querySelector(
    winnerSide === 1 ? match.winner : match.loser,
  );

  const loser = document.querySelector(
    winnerSide === 1 ? match.loser : match.winner,
  );

  const nextSlot = document.querySelector(match.next);

  const horizontal = document.querySelector(match.line);

  const verticalWinner = document.querySelector(
    winnerSide === 1 ? match.verticalWinner : match.verticalLoser,
  );

  if (!winner || !loser || !nextSlot || !horizontal || !verticalWinner) {
    return;
  }

  const loserImg = loser.querySelector("img");

  winner.classList.add("winner");
  winner.classList.add("qualified");

  loser.classList.add("loser");

  if (loserImg) {
    loserImg.style.opacity = "0.35";

    loserImg.style.filter = "grayscale(1)";
  }

  horizontal.classList.remove("active-left", "active-right");

  horizontal.classList.add(winnerSide === 1 ? "active-left" : "active-right");

  verticalWinner.classList.add("active");

  /* =========================
     FINALE
  ========================= */

  if (match.stage === "final") {
    const winnerName =
      winner.querySelector(".player-name")?.textContent || "WINNER";

    showWinnerImpact(winnerName);

    loser.style.opacity = "0";

    nextSlot.replaceChildren();

    winner.childNodes.forEach((node) => {
      nextSlot.appendChild(node.cloneNode(true));
    });

    nextSlot.style.opacity = "1";

    nextSlot.style.visibility = "visible";

    nextSlot.classList.remove("advance");

    void nextSlot.offsetWidth;

    nextSlot.classList.add("advance");

    winner.style.opacity = "0.15";

    return;
  }

  /* =========================
     QUART / DEMI
  ========================= */

  nextSlot.replaceChildren();

  winner.childNodes.forEach((node) => {
    nextSlot.appendChild(node.cloneNode(true));
  });

  nextSlot.style.opacity = "1";

  nextSlot.style.visibility = "visible";

  nextSlot.classList.remove("advance");

  void nextSlot.offsetWidth;

  nextSlot.classList.add("advance");
}

/* =========================
   INIT
========================= */

async function init() {
  await renderBracket();

  await renderNextMatch();

  await animateBracket();

  lastPlayersData = JSON.stringify(await getPlayers());
}

init();

setInterval(async () => {
  const players = await getPlayers();

  const currentData = JSON.stringify(players);

  if (currentData === lastPlayersData) {
    return;
  }

  lastPlayersData = currentData;

  await renderBracket();

  await renderNextMatch();

  await animateBracket();
}, 500);
