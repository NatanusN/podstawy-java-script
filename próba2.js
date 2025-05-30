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
      unit.textContent = typeof floor.unit === 'object' ? "🎯" : floor.unit;
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
  if (player.mana < card.cost) {
    addLog("Za mało many!");
    return;
  }

  if (card.effect !== "buildFloor" && card.effect !== "buildTwoFloors" && selectedFloorIndex === null) {
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

  // Przeciwnik wykonuje ruch po zagraniu karty gracza
  enemyRandomAction();
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

  // Przeciwnik gra tylko po pierwszej wymianie karty przez gracza
  if (cardsExchangedThisTurn === 1) {
    enemyRandomAction();
  }
}

function applyEffect(effect, self, opponent, floorIndex = 0) {
  const enemyFloor = opponent.tower[floorIndex];
  const barrierBlocks = (floor) => floor?.unit === "🧿";

  switch (effect) {
    case "buildFloor":
      self.tower.push({});
      break;
    case "buildTwoFloors":
      self.tower.push({}, {});
      break;
    case "summonCatapult":
      self.tower[floorIndex].unit = { type: "catapult", counter: 0 };
      break;
    case "summonKnight":
      self.tower[floorIndex].unit = "🛡️";
      break;
    case "summonArcher":
      self.tower[floorIndex].unit = "🏹";
      break;
    case "summonFireball":
      if (barrierBlocks(enemyFloor)) {
        delete enemyFloor.unit;
        addLog("🔥 Kula ognia została zablokowana przez barierę.");
      } else if (enemyFloor?.unit) {
        delete enemyFloor.unit;
        addLog("🔥 Kula ognia zniszczyła jednostkę!");
      }
      break;
    case "magicBarrier":
      self.tower[floorIndex].unit = "🧿";
      break;
    case "destroyOneFloor":
      if(opponent.tower.length > 0) opponent.tower.pop();
      break;
    case "destroyTwoFloors":
      if(opponent.tower.length > 0) opponent.tower.pop();
      if(opponent.tower.length > 0) opponent.tower.pop();
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
      addLog(`🏹 Łucznik zniszczył rycerza na piętrze ${i + 1}`);
    } else if (unit === "🛡️" && typeof target === "object" && target.type === "catapult") {
      delete enemyFloor.unit;
      addLog(`🛡️ Rycerz zniszczył katapultę na piętrze ${i + 1}`);
    } else if (unit === "🔥") {
      if (target === "🧿") {
        delete enemyFloor.unit;
        addLog(`🧿 Bariera zablokowała kulę ognia!`);
      } else if (target) {
        delete enemyFloor.unit;
        addLog(`🔥 Kula ognia zniszczyła jednostkę na piętrze ${i + 1}`);
      }
    }
  });
  renderTower(player.tower, "player-tower");
  renderTower(enemy.tower, "enemy-tower");
}

// Funkcja losowego ruchu przeciwnika: atakuje lub wymienia karty
function enemyRandomAction() {
  enemy.mana = calculateMaxMana(enemy);
  updateMana();

  const canPlayCards = cardPool.some(card => card.cost <= enemy.mana);
  const canExchangeCards = enemy.hand.length > 0;

  if (!canPlayCards && !canExchangeCards) {
    addLog("🤖 Przeciwnik nie może wykonać ruchu.");
    return;
  }

  let action;
  if (canPlayCards && canExchangeCards) {
    action = Math.random() < 0.5 ? 'play' : 'exchange';
  } else if (canPlayCards) {
    action = 'play';
  } else {
    action = 'exchange';
  }

  if (action === 'play') {
    const affordableCards = cardPool.filter(c => c.cost <= enemy.mana);
    const card = affordableCards[Math.floor(Math.random() * affordableCards.length)];
    const floorIndex = Math.floor(Math.random() * (enemy.tower.length || 1));
    enemy.mana -= card.cost;
    addLog(`🤖 Przeciwnik zagrał: ${card.name}`);
    applyEffect(card.effect, enemy, player, floorIndex);
  } else if (action === 'exchange') {
    const index = Math.floor(Math.random() * enemy.hand.length);
    const newCard = cardPool[Math.floor(Math.random() * cardPool.length)];
    enemy.hand.splice(index, 1, newCard);
    addLog("🤖 Przeciwnik wymienił kartę.");
  }

  renderTower(player.tower, "player-tower");
  renderTower(enemy.tower, "enemy-tower");
  renderHand();

  unitsAttack(enemy, player);
  activateCatapults(enemy, player);

  checkVictory();
}

function checkVictory() {
  if (player.tower.length >= 6) endGame("🎉 Wygrałeś! Twoja wieża osiągnęła 6 pięter."),
  alert("🎉 Wygrałeś! Twoja wieża osiągnęła 6 pięter.");
  else if (enemy.tower.length === 0) endGame("🎉 Wygrałeś! Zniszczyłeś wieżę przeciwnika!"),
  alert("🎉 Wygrałeś! Zniszczyłeś wieżę przeciwnika!");
  else if (player.tower.length === 0) endGame("💀 Przegrałeś! Twoja wieża została zniszczona."),
  alert("💀 Przegrałeś! Twoja wieża została zniszczona.")
  else if (enemy.tower.length >= 6) endGame("💀 Przegrałeś! Wieża przeciwnika osiągnęła 6 pięter."),
  alert("💀 Przegrałeś! Wieża przeciwnika osiągnęła 6 pięter.")
}

function endGame(message) {
  addLog("Koniec gry: " + message);
  document.getElementById("end-turn").disabled = true;
  // opcjonalnie blokuj interakcje
}

// Inicjalizacja gry
function startGame() {
  player.tower = [{}, {}, {}]; // na start 3 piętra
  enemy.tower = [{}, {}, {}];
  player.hand = [];
  enemy.hand = [];
  cardPlayedThisTurn = false;
  cardsExchangedThisTurn = 0;
  selectedFloorIndex = null;

  for (let i = 0; i < 3; i++) {
    drawCard();
    enemy.hand.push(cardPool[Math.floor(Math.random() * cardPool.length)]);
  }

  updateMana();
  renderTower(player.tower, "player-tower");
  renderTower(enemy.tower, "enemy-tower");
  renderHand();

  addLog("Gra rozpoczęta!");
}

document.getElementById("end-turn").addEventListener("click", () => {
  addLog("Tura gracza zakończona.");
  drawCard();
  updateMana();
  cardPlayedThisTurn = false;
  cardsExchangedThisTurn = 0;

  // Usunięto enemyRandomAction() — przeciwnik nie gra tutaj, tylko po ruchu gracza
});

// Startujemy grę przy załadowaniu strony
startGame();
