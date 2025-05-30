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
      if (typeof floor.unit === 'object' && floor.unit.type === 'catapult') {
        unit.textContent = "🎯";
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
      addLog(`${self === player ? "Gracz" : "Przeciwnik"} zbudował 1 piętro.`);
      break;
    case "buildTwoFloors":
      self.tower.push({}, {});
      addLog(`${self === player ? "Gracz" : "Przeciwnik"} zbudował 2 piętra.`);
      break;
    case "summonCatapult":
      self.tower[floorIndex].unit = { type: "catapult", counter: 0 };
      addLog(`${self === player ? "Gracz" : "Przeciwnik"} postawił Katapultę na piętrze ${floorIndex + 1}.`);
      break;
    case "summonKnight":
      self.tower[floorIndex].unit = "🛡️";
      addLog(`${self === player ? "Gracz" : "Przeciwnik"} postawił Rycerza na piętrze ${floorIndex + 1}.`);
      break;
    case "summonArcher":
      self.tower[floorIndex].unit = "🏹";
      addLog(`${self === player ? "Gracz" : "Przeciwnik"} postawił Łucznika na piętrze ${floorIndex + 1}.`);
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
      addLog(`${self === player ? "Gracz" : "Przeciwnik"} postawił Barierę na piętrze ${floorIndex + 1}.`);
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
    }
  });
  renderTower(player.tower, "player-tower");
  renderTower(enemy.tower, "enemy-tower");
}

// Funkcja losowego ruchu przeciwnika: atakuje lub wymienia karty
function enemyRandomAction() {
  enemy.mana = calculateMaxMana(enemy);
  updateMana();

  // Dobieranie karty przeciwnika jeśli ma mniej niż 5 kart
  if (enemy.hand.length < 5) {
    const newCard = cardPool[Math.floor(Math.random() * cardPool.length)];
    enemy.hand.push(newCard);
    addLog("🤖 Przeciwnik dobiera kartę.");
  }

  const affordableCards = enemy.hand.filter(c => c.cost <= enemy.mana);

  if (affordableCards.length === 0) {
    addLog("🤖 Przeciwnik nie ma kart do zagrania.");
    return;
  }

  // Losujemy kartę do zagrania
  const card = affordableCards[Math.floor(Math.random() * affordableCards.length)];
  const floorIndex = enemy.tower.length > 0 ? Math.floor(Math.random() * enemy.tower.length) : 0;

  enemy.mana -= card.cost;
  addLog(`🤖 Przeciwnik zagrał: ${card.name}`);
  applyEffect(card.effect, enemy, player, floorIndex);
  enemy.hand.splice(enemy.hand.indexOf(card), 1);

  renderTower(player.tower, "player-tower");
  renderTower(enemy.tower, "enemy-tower");
  updateMana();
  checkVictory();
}

function checkVictory() {
  if (player.tower.length === 0) {
    alert("Przegrałeś! Wieża zniszczona.");
    location.reload();
  } else if (enemy.tower.length === 0) {
    alert("Wygrałeś! Przeciwnik stracił wieżę.");
    location.reload();
  }
}

function endTurn() {
  addLog("Tura gracza zakończona.");
  cardPlayedThisTurn = false;
  cardsExchangedThisTurn = 0;
  selectedFloorIndex = null;

  activateCatapults(player, enemy);
  unitsAttack(player, enemy);

  // Gracz dobiera kartę na koniec swojej tury
  if (player.hand.length < 5) drawCard();

  updateMana();

  enemyRandomAction();

  activateCatapults(enemy, player);
  unitsAttack(enemy, player);

  checkVictory();

  renderTower(player.tower, "player-tower");
  renderTower(enemy.tower, "enemy-tower");
}

function initGame() {
  // Startowa wieża z 3 piętrami dla obu graczy
  player.tower = [{}, {}, {}];
  enemy.tower = [{}, {}, {}];

  // Startowa mana i karty gracza i przeciwnika
  player.mana = calculateMaxMana(player);
  enemy.mana = calculateMaxMana(enemy);

  // 3 karty na start dla obu
  player.hand = [];
  enemy.hand = [];
  for(let i=0; i<3; i++) {
    player.hand.push(cardPool[Math.floor(Math.random() * cardPool.length)]);
    enemy.hand.push(cardPool[Math.floor(Math.random() * cardPool.length)]);
  }

  renderTower(player.tower, "player-tower");
  renderTower(enemy.tower, "enemy-tower");
  renderHand();
  updateMana();
  addLog("Gra rozpoczęta. Masz 3 karty na start.");
}

window.onload = () => {
  initGame();
  document.getElementById("end-turn-btn").onclick = endTurn;
};
