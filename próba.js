let selectedFloorIndex = null;
let cardPlayedThisTurn = false;
let cardsExchangedThisTurn = 0;

const player = {
  mana: 0,
  hand: [],
  tower: [],
  units: []
};

const enemy = {
  mana: 0,
  hand: [],
  tower: [],
  units: []
};

const cardPool = [
  {name: "🎯Katapulta", cost: 5, type: "atak", effect: "summonCatapult", description: "Katapulta atakuje wieżę co 2 tury"},
  {name: "🛡️Rycerz", cost: 3, type: "obrona", effect: "summonKnight", description: "Rycerz niszczy katapultę"},
  {name: "🏹Łucznik", cost: 2, type: "atak", effect: "summonArcher", description: "Zabija rycerza"},
  {name: "🔥Kula Ognia", cost: 4, type: "atak", effect: "summonFireball", description: "Niszczy jednostkę"},
  {name: "🧿Bariera", cost: 2, type: "obrona", effect: "magicBarrier", description: "Blokuje 1 atak"},
  {name: "🏗️Budowa Piętra", cost: 1, type: "budowa", effect: "buildFloor", description: "Dodaje piętro"},
  {name: "💥Zburz 1 piętro", cost: 3, type: "atak", effect: "destroyOneFloor", description: "Zburz 1 piętro przeciwnika"},
  {name: "💥Zburz 2 piętra", cost: 5, type: "atak", effect: "destroyTwoFloors", description: "Zburz 2 piętra przeciwnika"},
  {name: "🏗️Zbuduj 2 piętra", cost: 4, type: "budowa", effect: "buildTwoFloors", description: "Dodaje 2 piętra"},
];

const log = document.getElementById("log");

function addLog(message) {
  log.innerHTML += `<div>> ${message}</div>`;
  log.scrollTop = log.scrollHeight;
}

function selectFloor(index) {
  selectedFloorIndex = index;
  addLog(`Wybrano piętro ${index + 1}.`);
  const floors = document.querySelectorAll('#player-tower .floor');
  floors.forEach((div, i) => {
    div.classList.toggle('selected', i === index);
  });
}

function renderTower(tower, elementId) {
  const towerDiv = document.getElementById(elementId);
  towerDiv.innerHTML = '';
  tower.forEach((floor, index) => {
    const div = document.createElement('div');
    div.classList.add('floor');
    div.dataset.floorIndex = index;
    if (floor.unit) {
      const unit = document.createElement('div');
      unit.classList.add('unit');
      if (typeof floor.unit === 'object' && floor.unit.type === 'catapult') unit.textContent = "🎯";
      else unit.textContent = floor.unit;
      div.appendChild(unit);
    }
    if (elementId === "player-tower") {
      div.addEventListener('click', () => selectFloor(index));
    }
    towerDiv.appendChild(div);
  });
}

function calculateMaxMana(playerOrEnemy) {
  return playerOrEnemy.tower.length + (playerOrEnemy.tower.length === 1 ? 1 : 0);
}

function updateMana() {
  player.mana = calculateMaxMana(player);
  enemy.mana = calculateMaxMana(enemy);
  document.getElementById('mana-count').textContent = player.mana;
  document.getElementById('enemy-mana-count').textContent = enemy.mana;
}

function drawCard(forPlayer = true) {
  if (forPlayer) {
    if (player.hand.length < 5) {
      const card = cardPool[Math.floor(Math.random() * cardPool.length)];
      player.hand.push(card);
      renderHand();
    }
  } else {
    if (enemy.hand.length < 5) {
      const card = cardPool[Math.floor(Math.random() * cardPool.length)];
      enemy.hand.push(card);
    }
  }
}

function renderHand() {
  const hand = document.getElementById('hand');
  hand.innerHTML = '';
  player.hand.forEach((card, index) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `<strong>${card.name}</strong><br>🔮 ${card.cost}<br>${card.description}<br>
      <button onclick="playCard(${index})">Zagraj</button>
      <button onclick="exchangeCard(${index})" class="swap">Wymień</button>`;
    hand.appendChild(div);
  });
}

function playCard(index) {
  if (cardPlayedThisTurn || cardsExchangedThisTurn > 0) {
    addLog("Możesz zagrać tylko jedną kartę lub wymienić 2 karty w turze.");
    return;
  }

  const card = player.hand[index];
  if (player.mana < card.cost) {
    addLog("Za mało many!");
    return;
  }

  // Karty które wymagają wybrania piętra (jednostki) muszą mieć wybrane piętro
  const effectsThatDontNeedFloor = ["buildFloor", "buildTwoFloors", "destroyOneFloor", "destroyTwoFloors"];
if (!effectsThatDontNeedFloor.includes(card.effect) && selectedFloorIndex === null) {
  addLog("Wybierz piętro w wieży, zanim zagrasz kartę z jednostką.");
  return;
}

  player.mana -= card.cost;
  updateMana();
  addLog(`Zagrano kartę: ${card.name}`);
  applyEffect(card.effect, player, enemy, selectedFloorIndex);
  player.hand.splice(index, 1);
  renderHand();
  selectedFloorIndex = null;
  cardPlayedThisTurn = true;
  checkVictory();

  // Nie wywołujemy enemyRandomAction tutaj, przeciwnik zagra na końcu tury
  if (gameOver) {
  addLog("Gra została zakończona. Rozpocznij nową grę.");
  return;
}
}

function exchangeCard(index) {
  if (cardPlayedThisTurn || cardsExchangedThisTurn >= 2) {
    addLog("Możesz wymienić maksymalnie 2 karty, jeśli nie zagrałeś żadnej.");
    return;
  }
  const newCard = cardPool[Math.floor(Math.random() * cardPool.length)];
  player.hand.splice(index, 1, newCard);
  cardsExchangedThisTurn++;
  renderHand();
  addLog(`Wymieniono kartę.`);

  // Nie wywołujemy enemyRandomAction tutaj
  if (gameOver) {
  addLog("Gra została zakończona. Rozpocznij nową grę.");
  return;
}
}

function applyEffect(effect, self, opponent, floorIndex = 0) {
  const enemyFloor = opponent.tower[floorIndex];
  const barrierBlocks = (floor) => floor?.unit === "🧿";

  switch (effect) {
    case "buildFloor":
      self.tower.push({});
      addLog("🏗️ Dodano piętro.");
      break;
    case "buildTwoFloors":
      self.tower.push({}, {});
      addLog("🏗️ Dodano 2 piętra.");
      break;
    case "summonCatapult":
      self.tower[floorIndex].unit = { type: "catapult", counter: 0 };
      addLog(`🎯 Postawiono katapultę na piętrze ${floorIndex + 1}.`);
      break;
    case "summonKnight":
      self.tower[floorIndex].unit = "🛡️";
      addLog(`🛡️ Postawiono rycerza na piętrze ${floorIndex + 1}.`);
      break;
    case "summonArcher":
      self.tower[floorIndex].unit = "🏹";
      addLog(`🏹 Postawiono łucznika na piętrze ${floorIndex + 1}.`);
      break;
    case "summonFireball":
      if (barrierBlocks(enemyFloor)) {
        delete enemyFloor.unit;
        addLog("🔥 Kula ognia została zablokowana przez barierę.");
      } else if (enemyFloor?.unit) {
        delete enemyFloor.unit;
        addLog("🔥 Kula ognia zniszczyła jednostkę!");
      } else {
        addLog("🔥 Kula ognia nie trafiła w nic.");
      }
      break;
    case "magicBarrier":
      self.tower[floorIndex].unit = "🧿";
      addLog(`🧿 Postawiono barierę na piętrze ${floorIndex + 1}.`);
      break;
    case "destroyOneFloor":
      if (opponent.tower.length > 0) {
        const topFloor = opponent.tower[opponent.tower.length - 1];
        if (topFloor.unit === "🧿") {
          delete topFloor.unit;
          addLog("🧿 Bariera zablokowała zniszczenie piętra!");
        } else {
          opponent.tower.pop();
          addLog("💥 Zburzono 1 piętro przeciwnika!");
        }
      } else {
        addLog("Nie ma pięter do zburzenia.");
      }
      break;
    case "destroyTwoFloors":
      for (let i = 0; i < 2; i++) {
        if (opponent.tower.length === 0) break;
        const topFloor = opponent.tower[opponent.tower.length - 1];
        if (topFloor.unit === "🧿") {
          delete topFloor.unit;
          addLog("🧿 Bariera zablokowała zniszczenie piętra!");
        } else {
          opponent.tower.pop();
          addLog("💥 Zburzono piętro przeciwnika!");
        }
      }
      break;
  }
  renderTower(player.tower, "player-tower");
  renderTower(enemy.tower, "enemy-tower");
}

function activateCatapults(attacker, defender) {
  attacker.tower.forEach((floor, i) => {
    if (floor.unit && typeof floor.unit === 'object' && floor.unit.type === 'catapult') {
      floor.unit.counter = (floor.unit.counter || 0) + 1;
      if (floor.unit.counter >= 2 && i < defender.tower.length) {
        const target = defender.tower[i];
        if (target?.unit === "🧿") {
          delete target.unit;
          addLog(`🧿 Bariera na piętrze ${i + 1} zablokowała atak katapulty!`);
        } else {
          defender.tower.splice(i, 1);
          addLog(`🎯 Katapulta zniszczyła piętro ${i + 1}!`);
        }
        floor.unit.counter = 0;
      }
    }
  });
  renderTower(player.tower, "player-tower");
  renderTower(enemy.tower, "enemy-tower");
}

function unitsAttack(attacker, defender) {
  attacker.tower.forEach((floor, i) => {
    const enemyFloor = defender.tower[i];
    if (!floor.unit || !enemyFloor) return;

    const unit = floor.unit;
    const target = enemyFloor.unit;

    if (unit === "🏹" && target === "🛡️") {
      delete enemyFloor.unit;
      addLog(`🏹 Łucznik zabił rycerza na piętrze ${i + 1}`);
    } else if (unit === "🛡️" && target && typeof target === 'object' && target.type === "catapult") {
      delete enemyFloor.unit;
      addLog(`🛡️ Rycerz zniszczył katapultę na piętrze ${i + 1}`);
    }
  });
  renderTower(player.tower, "player-tower");
  renderTower(enemy.tower, "enemy-tower");
}
function endGame() {
  const endTurnBtn = document.getElementById("end-turn");

  if (endTurnBtn) {
    endTurnBtn.textContent = "Nowa gra";
    endTurnBtn.removeEventListener("click", endTurn); // usuń starą akcję
    endTurnBtn.addEventListener("click", initGame);  // dodaj nową
  }

  // Zablokuj wszystkie przyciski w kartach (Zagraj / Wymień)
  const handButtons = document.querySelectorAll("#hand button");
  handButtons.forEach(btn => btn.disabled = true);

  // Zablokuj wybór pięter
  const floors = document.querySelectorAll('#player-tower .floor');
  floors.forEach(floor => floor.onclick = null);

  addLog("🔚 Gra zakończona. Kliknij 'Nowa gra', aby zacząć od nowa.");
}

function checkVictory() {
  if (player.tower.length >= 6) {
    addLog("🎉 Wygrałeś! Twoja wieża osiągnęła 6 pięter.");
    alert("🎉 Wygrałeś! Twoja wieża osiągnęła 6 pięter.");
    endGame();
    return true;
  }
  if (enemy.tower.length === 0) {
    addLog("🎉 Wygrałeś! Zniszczyłeś wieżę przeciwnika.");
    alert("🎉 Wygrałeś! Zniszczyłeś wieżę przeciwnika.");
    endGame();
    return true;
  }
  if (player.tower.length === 0) {
    addLog("💀 Przegrałeś! Twoja wieża została zniszczona.");
    alert("💀 Przegrałeś! Twoja wieża została zniszczona.");
    endGame();
    return true;
  }
  if (enemy.tower.length >= 6) {
    addLog("💀 Przegrałeś! Wieża przeciwnika osiągnęła 6 pięter.");
    alert("💀 Przegrałeś! Wieża przeciwnika osiągnęła 6 pięter.");
    endGame();
    return true;
  }
  return false;
}


function enemyRandomAction() {
  enemy.mana = calculateMaxMana(enemy);
  updateMana();
  // Prostota: przeciwnik zagrywa pierwszą kartę, którą może
  for (let i = 0; i < enemy.hand.length; i++) {
    const card = enemy.hand[i];
    if (card.cost <= enemy.mana) {
      // Znajduje piętro do zagranej karty (jeśli wymaga)
      let floorIndex = 0;
      if (card.effect === "buildFloor" || card.effect === "buildTwoFloors") {
        floorIndex = null;
      } else if (enemy.tower.length > 0) {
        floorIndex = Math.floor(Math.random() * enemy.tower.length);
      } else {
        floorIndex = null;
      }

      enemy.mana -= card.cost;
      addLog(`Przeciwnik zagrywa: ${card.name}`);
      applyEffect(card.effect, enemy, player, floorIndex);
      enemy.hand.splice(i, 1);
      break;
    }
  }
  checkVictory();
  renderHand(); // Odśwież rękę gracza (jakby coś się zmieniło)
}

function startTurn() {
  cardPlayedThisTurn = false;
  cardsExchangedThisTurn = 0;
  player.mana = calculateMaxMana(player);
  enemy.mana = calculateMaxMana(enemy);
  updateMana();
  drawCard(true);
  drawCard(false);
  activateCatapults(player, enemy);
  unitsAttack(player, enemy);
  renderTower(player.tower, "player-tower");
  renderTower(enemy.tower, "enemy-tower");
  renderHand();
}

function endTurn() {
  if (!cardPlayedThisTurn && cardsExchangedThisTurn === 0) {
    addLog("Musisz zagrać kartę lub wymienić karty, zanim zakończysz turę.");
    return;
  }

  // Aktywacja katapult i ataki jednostek
  activateCatapults(player, enemy);
  unitsAttack(player, enemy);
  checkVictory();

  // Akcja przeciwnika
  enemyRandomAction();

  // Aktywacja katapult i ataki jednostek przeciwnika
  activateCatapults(enemy, player);
  unitsAttack(enemy, player);
  checkVictory();

  // Resetowanie zmiennych
  cardPlayedThisTurn = false;
  cardsExchangedThisTurn = 0;
  selectedFloorIndex = null;
  updateMana();
  drawCard(true);
  drawCard(false);
  renderTower(player.tower, "player-tower");
  renderTower(enemy.tower, "enemy-tower");
  renderHand();

  addLog("Tura gracza zakończona. Tura przeciwnika.");
}

// Inicjalizacja gry: daj po 3 piętra i 3 karty na start
function initGame() {
  gameOver = false; // ← WAŻNE: resetuj flagę zakończenia gry

  player.tower = [{}, {}, {}];
  enemy.tower = [{}, {}, {}];
  player.hand = [];
  enemy.hand = [];
  cardPlayedThisTurn = false;
  cardsExchangedThisTurn = 0;
  selectedFloorIndex = null;

  // Wylosuj karty dla gracza i przeciwnika
  for (let i = 0; i < 3; i++) {
    drawCard();
    enemy.hand.push(cardPool[Math.floor(Math.random() * cardPool.length)]);
  }

  updateMana();
  renderTower(player.tower, "player-tower");
  renderTower(enemy.tower, "enemy-tower");
  renderHand();

  // Resetuj przycisk „Zakończ turę”
  const endTurnBtn = document.getElementById("end-turn");
  endTurnBtn.textContent = "Zakończ turę";
  endTurnBtn.removeEventListener("click", initGame);
  endTurnBtn.addEventListener("click", endTurn);
  endTurnBtn.disabled = false;

  addLog("🆕 Rozpoczęto nową grę!");
}

initGame();
document.getElementById("end-turn").addEventListener("click", endTurn);