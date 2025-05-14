let tablica = [1, 2, 3, 4, 5];
for (let i = 0; i < tablica.length; i++) {
    console.log(tablica[i]);
}
tablica.push(60);
console.log(tablica.length);
console.log(tablica);
let suma = 0
for (let i = 0; i < tablica.length; i++) {
   suma += tablica[i]    
}
console.log(suma);
