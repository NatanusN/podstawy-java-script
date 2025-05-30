let selectedFloorIndex = null;
let cardPlayedThisTurn = false;
let cardsExchangedThisTurn = 0;

const player = {
  mana: 0,
  hand: [],
  tower: [],
};

const enemy = {
  mana: 0,
  hand: [],
  tower: [],
};

const cardPool = [
  { name: "🎯Katapulta", cost: 5, type: "atak", effect: "summonCatapult", description: "Katapulta atakuje wieżę co 2 tury" },
  { name: "🛡️Rycerz", cost: 3, type: "obrona", effect: "summonKnight", description: "Rycerz niszczy katapultę" },
  { name: "🏹Łucznik", cost: 2, type: "atak", effect: "summonArcher", description: "Zabija rycerza" },
  { name: "💥Kula Ognia", cost: 4, type: "atak", effect: "fireball", description: "Niszczy jednostkę" },
  { name: "🧿Bariera", cost: 2, type: "obrona", effect: "magicBarrier", description: "Blokuje atak" },
  { name: "🏗️Budowa Piętra", cost: 1, type: "budowa", effect: "buildFloor", description: "Dodaje piętro" },
   { name: "💥Zburz 1 Piętro", cost: 3, type: "atak", effect: "destroyOneFloor", description: "Zniszcz 1 piętro przeciwnika" },
  { name: "💥Zburz 2 Piętra", cost: 5, type: "atak", effect: "destroyTwoFloors", description: "Zniszcz 2 piętra przeciwnika" },
  { name: "🏗️Zbuduj 2 Piętra", cost: 3, type: "budowa", effect: "buildTwoFloors", description: "Dodaj 2 piętra do swojej wieży" }
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
      if (typeof floor.unit === 'object') {
        if (floor.unit.type === "catapult") unit.textContent = "🎯";
        else if (floor.unit.type === "barrier") unit.textContent = "🧿";
      } else {
        unit.textContent = floor.unit;
      }
      div.appendChild(unit);
    }

    if (elementId === "player-tower") {
      div.addEventListener('click', () => selectFloor(index));
    }

    towerDiv.appendChild(div);
  });
}

function activateCatapults(attacker, defender) {
  attacker.tower.forEach((floor, index) => {
    if (floor.unit && typeof floor.unit === "object" && floor.unit.type === "catapult") {
      floor.unit.counter = (floor.unit.counter || 0) + 1;
      if (floor.unit.counter >= 2) {
        if (defender.tower[index]) {
          let target = defender.tower[index].unit;
          if (target && typeof target === "object" && target.type === "barrier") {
            defender.tower[index].unit = null;
            addLog(`🧿 Bariera zablokowała atak katapulty na piętrze ${index + 1}.`);
          } else {
            defender.tower.splice(index, 1);
            addLog(`🎯 Katapulta zniszczyła piętro ${index + 1}!`);
          }
        }
        floor.unit.counter = 0;
      }
    }
  });
}

function updateMana() {
  player.mana = player.tower.length + (player.tower.length === 1 ? 1 : 0);
  enemy.mana = enemy.tower.length + (enemy.tower.length === 1 ? 1 : 0);
  document.getElementById('mana-count').textContent = player.mana;
  document.getElementById('enemy-mana-count').textContent = enemy.mana;
}

function drawCard() {
  if (player.hand.length < 5) {
    const card = cardPool[Math.floor(Math.random() * cardPool.length)];
    player.hand.push(card);
    renderHand();
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
  if (player.mana >= card.cost) {
    if (card.effect !== "buildFloor" && selectedFloorIndex === null) {
      addLog("Wybierz piętro, zanim zagrasz kartę z jednostką.");
      return;
    }

    player.mana -= card.cost;
    addLog(`Zagrano kartę: ${card.name}`);
    player.hand.splice(index, 1);
    applyEffect(card.effect, player, enemy, selectedFloorIndex);
    selectedFloorIndex = null;
    cardPlayedThisTurn = true;
    renderHand();
    updateMana();
    checkVictory();

    setTimeout(() => {
      enemyTurn();
      updateMana();
      checkVictory();
    }, 1000);
  } else {
    addLog("Za mało many!");
  }
}

function exchangeCard(index) {
  if (cardPlayedThisTurn || cardsExchangedThisTurn >= 2) {
    addLog("Możesz wymienić maksymalnie 2 karty, jeśli nie zagrałeś żadnej.");
    return;
  }

  const newCard = cardPool[Math.floor(Math.random() * cardPool.length)];
  player.hand.splice(index, 1, newCard); // Usuwa 1 kartę na pozycji index i wstawia nową

  cardsExchangedThisTurn++;
  renderHand();
  addLog(`Wymieniono kartę.`);
}

function applyEffect(effect, self, opponent, floorIndex = 0) {
  const floor = self.tower[floorIndex];
  if (!floor && effect !== "buildFloor") return;

  switch (effect) {
     case "destroyOneFloor":
      if (opponent.tower.length > 0) {
        opponent.tower.pop();
        addLog("💥 Zniszczono 1 piętro przeciwnika!");
      }
      break;
    case "destroyTwoFloors":
      if (opponent.tower.length > 1) {
        opponent.tower.pop();
        opponent.tower.pop();
        addLog("💥 Zniszczono 2 piętra przeciwnika!");
      }
      break;
    case "buildTwoFloors":
      self.tower.push({}, {});
      addLog("🏗️ Dodano 2 piętra do swojej wieży.");
      break;
    case "buildFloor":
      self.tower.push({});
      break;
    case "summonCatapult":
      floor.unit = { type: "catapult", counter: 0 };
      break;
    case "summonKnight":
      floor.unit = "🛡️";
      break;
    case "summonArcher":
      if (opponent.tower[floorIndex]?.unit === "🛡️") {
        opponent.tower[floorIndex].unit = null;
        addLog("🏹 Łucznik zniszczył rycerza!");
      } else {
        floor.unit = "🏹";
      }
      break;
    case "fireball":
      if (opponent.tower[floorIndex]) {
        const unit = opponent.tower[floorIndex].unit;
        if (typeof unit === "object" && unit.type === "barrier") {
          opponent.tower[floorIndex].unit = null;
          addLog("🧿 Bariera zablokowała kulę ognia.");
        } else {
          opponent.tower[floorIndex].unit = null;
          addLog("🔥 Kula ognia zniszczyła jednostkę.");
        }
      }
      break;
    case "magicBarrier":
      floor.unit = { type: "barrier" };
      break;
  }

  // Reakcja rycerza na katapultę
  if (effect === "summonKnight" && opponent.tower[floorIndex]?.unit?.type === "catapult") {
    opponent.tower[floorIndex].unit = null;
    addLog("🛡️ Rycerz zniszczył katapultę!");
  }

  renderTower(player.tower, "player-tower");
  renderTower(enemy.tower, "enemy-tower");
}

function enemyTurn() {
  updateEnemyMana();
  const availableCards = cardPool.filter(c => c.cost <= enemy.mana);
  if (availableCards.length === 0) {
    addLog("Przeciwnik nie ma many, by zagrać kartę.");
    return;
  }
  const card = availableCards[Math.floor(Math.random() * availableCards.length)];
  const floorIndex = Math.floor(Math.random() * enemy.tower.length);
  enemy.mana -= card.cost;
  addLog(`Przeciwnik zagrał: ${card.name}`);
  applyEffect(card.effect, enemy, player, floorIndex);
  activateCatapults(enemy, player);
}

function updateEnemyMana() {
  enemy.mana = enemy.tower.length + (enemy.tower.length === 1 ? 1 : 0);
}

function checkVictory() {
  if (player.tower.length >= 6) {
    endGame("Wygrałeś! Twoja wieża osiągnęła 6 pięter.");
  } else if (enemy.tower.length === 0) {
    endGame("Wygrałeś! Wieża przeciwnika została zniszczona.");
  } else if (player.tower.length === 0) {
    endGame("Przegrałeś! Twoja wieża została zniszczona.");
  } else if (enemy.tower.length >= 6) {
    endGame("Przegrałeś! Wieża przeciwnika osiągnęła 6 pięter.");
  }
}

function endPlayerTurn() {
  addLog("Tura gracza zakończona.");
  drawCard();
  updateMana();
  activateCatapults(player, enemy);
  cardPlayedThisTurn = false;
  cardsExchangedThisTurn = 0;
  document.getElementById('end-turn').disabled = false;
}

function endGame(message) {
  addLog("=== KONIEC GRY ===");
  addLog(message);
  alert(message);
  disableGame();
}

function disableGame() {
  document.querySelectorAll('button').forEach(btn => btn.disabled = true);
}

function initGame() {
  player.tower = [{}, {}, {}];
  enemy.tower = [{}, {}, {}];
  renderTower(player.tower, "player-tower");
  renderTower(enemy.tower, "enemy-tower");
  drawCard();
  drawCard();
  drawCard();
  updateMana();
  renderHand();
  addLog("Gra rozpoczęta.");
}

initGame();
document.getElementById('end-turn').addEventListener('click', endPlayerTurn);