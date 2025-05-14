let tablica =[
    [1,5],
    [2,4],
    [3,6]
];
console.log(tablica[1][0]);

let samochód = {
  marka: "Toyota",
  model: "Corolla",
  rok: 1966
};
console.log(samochód.marka);

let uczeń = {
  imie: "Nataniel",
  oceny: [3, 5, 4, 5]
};
console.log(uczeń.oceny[2]);

let książki = [
  { tytuł: "Zemsta", autor: "Aleksander Fredro" },
  { tytuł: "Pan Tadeusz", autor: "Adam Mickiewicz" }
];
console.log(książki[1].autor);

let konto = {
  wlaściciel: {
    imie: "Nataniel",
    nazwisko: "Ciuraszkiewicz"
  },
};
console.log(konto.wlaściciel.imie);

let tablica2 = [
  [1, 5, 7],
  [2, 4, 8],
  [3, 6, 9]
];
    for (let wiersz = 0; wiersz < tablica2.length ; wiersz++ ) { 
        for(let kolumna = 0; kolumna < tablica2[wiersz].length; kolumna++) { 
            console.log(tablica2[wiersz][kolumna]);
        }
    } 