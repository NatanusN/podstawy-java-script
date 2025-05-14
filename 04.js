let liczba = Number(prompt("podaj liczbę"));
if (liczba > 0) alert("Liczba jest dodatnia.");
else if (liczba === 0) alert("liczba ni dodatnia, ni ujemna")
else alert("liczba jest ujemna.");
let wiek = Number(prompt("podaj wiek."));
if (wiek < 12) alert("dziecko.");
else if (wiek < 18) alert("nastolatek.");
else ("dorosły");
let liczbaA = Number(prompt("podaj liczbę"));
let liczbaB = Number(prompt("podaj drugą liczbę"));
let działanie = prompt("podaj 1 z powyższych + - * / %");

switch (działanie) {
  case "+":
    alert(liczbaA + liczbaB);
    break;
  case "-":
    alert(liczbaA - liczbaB);
    break;
  case "*":
    alert(liczbaA * liczbaB);
    break;
  case "/":
    alert(liczbaA / liczbaB);
    break;
    case "%":
    alert(liczbaA % liczbaB);
    break;
  default:
    alert("błąd błędne działanie");
}
let przedział = Number(prompt("podaj liczbę"));  
  if (przedział > 10 && przedział < 50) {
  alert("Liczba jest w przedziale od 10 do 50");}
  else alert("liczba nie jest w przediale od 10 do 50")
let czyAdmin = false
let czyPremium = false
if (czyAdmin || czyPremium) alert("masz dostęp do premium");
    else alert("masz darmowe konto")