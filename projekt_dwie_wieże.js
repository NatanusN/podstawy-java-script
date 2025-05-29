class Player {
    constructor(name) {
        this.name = name;
        this.mana = 0;
        this.hand = [];
        this.tower = { floors: 3 };
        this.units = [];
    }

    updateMana() {
        this.mana = this.tower.floors + (this.tower.floors === 1 ? 1 : 0);
    }

    buildFloor() {
        this.tower.floors += 1;
        this.updateMana();
        console.log(`${this.name} zbudował nowe piętro! Obecnie: ${this.tower.floors} pięter.`);
    }
}
class Card {
    constructor(name, mana, description) {
        this.name = name;
        this.mana = mana;
        this.description = description
    }

    
}
const cardPool = [new Card ("zbuduj 1 poziom", 1, "buduje 1 poziom wieży"), 
    new Card ("zniszcz 1 poziom", 1, "niszczy 1 poziom wieży przeciwnika")
] 
let hand = document.getElementById("hand")
let tower1 = document.getElementById("tower1")
console.log(cardPool);
const player = new Player ("gracz")
const computer = new Player ("komputer")
player.hand = [cardPool [0], cardPool[1], cardPool[0], cardPool[1]]
console.log(player.hand);
player.hand.forEach(card => {
    let div = document.createElement("div")
    div.classList.add("card")
    div.innerHTML = `<span> ${card.name}</span> ${card.description} <span> mana: (${card.mana}) </span>` 
    hand.appendChild(div)
    if (card.name === "zbuduj 1 poziom")
    div.addEventListener("click", function (){const piętro = document.createElement("div")
    piętro.classList.add("floor")
    tower1.appendChild(piętro)
    console.log("kliknięto kartę");
    
    })
    if (card.name === "zniszcz 1 poziom")
    div.addEventListener("click", function (){
    const tower2 = document.getElementById("tower2"); 
    const floor1 = tower2.lastElementChild.remove();
    console.log(floor1);
    
    console.log("kliknięto kartę");
    
    })
})