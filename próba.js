let cardPlayedThisTurn = false;
let cardsExchangedThisTurn = 0;const player = {
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
  {name: "Katapulta", cost: 5, type: "atak", effect: "summonCatapult", description: "Katapulta atakuje wieżę co 2 tury"},
  {name: "Rycerz", cost: 3, type: "obrona", effect: "summonKnight", description: "Rycerz niszczy katapultę"},
  {name: "Łucznik", cost: 2, type: "atak", effect: "summonArcher", description: "Zabija rycerza"},
  {name: "Kula Ognia", cost: 4, type: "atak", effect: "fireball", description: "Niszczy jednostkę"},
  {name: "Bariera", cost: 2, type: "obrona", effect: "magicBarrier", description: "Blokuje atak"},
  {name: "Budowa Piętra", cost: 1, type: "budowa", effect: "buildFloor", description: "Dodaje piętro"},
];

const log = document.getElementById("log");

function addLog(message) {
  log.innerHTML += `<div>> ${message}</div>`;
  log.scrollTop = log.scrollHeight;
}

function renderTower(tower, elementId) {
  const towerDiv = document.getElementById(elementId);
  towerDiv.innerHTML = '';
  tower.forEach(floor => {
    const div = document.createElement('div');
    div.classList.add('floor');
    if (floor.unit) {
      const unit = document.createElement('div');
      unit.classList.add('unit');
      unit.textContent = floor.unit;
      div.appendChild(unit);
    }
    towerDiv.appendChild(div);
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
    div.innerHTML = `<strong>${card.name}</strong><br>Koszt: ${card.cost}<br>${card.description}`;
    div.addEventListener('click', () => playCard(index));
    hand.appendChild(div);
  });
}

function playCard(index) {
  if (cardPlayedThisTurn || cardsExchangedThisTurn > 0) {
    addLog("Możesz zagrać tylko jedną kartę lub wymienić 2 karty w turze.");
if (cardsExchangedThisTurn === 2) {
document.getElementById('end-turn').disabled = false;
}
    return;
  }

  const card = player.hand[index];
  if (player.mana >= card.cost) {
    player.mana -= card.cost;
    addLog(`Zagrano kartę: ${card.name}`);
    applyEffect(card.effect, player, enemy);
    player.hand.splice(index, 1);
    renderHand();
    updateMana();
    cardPlayedThisTurn = true;
renderHand();
updateMana();
checkVictory();

// Przeciwnik reaguje od razu
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

  player.hand.splice(index, 1);
  const newCard = cardPool[Math.floor(Math.random() * cardPool.length)];
  player.hand.push(newCard);
  cardsExchangedThisTurn++;
  renderHand();
  addLog(`Wymieniono kartę.`);

  if (cardsExchangedThisTurn === 2) {
    document.getElementById('end-turn').disabled = false; // WAŻNE!
  }
}
function renderHand() {
  const hand = document.getElementById('hand');
  hand.innerHTML = '';
  player.hand.forEach((card, index) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `<strong>${card.name}</strong><br>Koszt: ${card.cost}<br>${card.description}<br>
      <button onclick="playCard(${index})">Zagraj</button>
      <button onclick="exchangeCard(${index})">Wymień</button>`;
    hand.appendChild(div);
  });
}
function applyEffect(effect, self, opponent) {
  switch(effect) {
    case "buildFloor":
      self.tower.push({});
      break;
    case "summonCatapult":
      self.tower[0].unit = "🎯";
      break;
    case "summonKnight":
      self.tower[0].unit = "🛡️";
      break;
    case "summonArcher":
      self.tower[0].unit = "🏹";
      break;
    case "fireball":
      if (opponent.tower[0] && opponent.tower[0].unit) {
        delete opponent.tower[0].unit;
      }
      break;
    case "magicBarrier":
      self.tower[0].unit = "🪄";
      break;
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
  enemy.mana -= card.cost;
  addLog(`Przeciwnik zagrał: ${card.name}`);
  applyEffect(card.effect, enemy, player);
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
function endPlayerTurn() {
  addLog("Tura gracza zakończona.");
  drawCard();
  updateMana();

  // Reset flag i ograniczeń
  cardPlayedThisTurn = false;
  cardsExchangedThisTurn = 0;

  document.getElementById('end-turn').disabled = fal;
}



function endGame(message) {
  addLog(`=== KONIEC GRY ===`);
  addLog(message);
  alert(message);
  disableGame();
}
initGame();
cardPlayedThisTurn = false;
cardsExchangedThisTurn = 0;
document.getElementById('end-turn').disabled = false;
document.getElementById('end-turn').addEventListener('click', () => {
  endPlayerTurn();
});
function disableGame() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => btn.disabled = false);
}