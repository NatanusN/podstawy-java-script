const Przycisk = document.getElementById("Przycisk");
const Czasomierz = document.getElementById("Czasomierz");
const Licznik = document.getElementById("Licznik");
const CPS = document.getElementById("CPS")
let cps = 0;
let czas = 0;
let kliknięcia = 0;
let interval = null;
let start = false;
function reset() {
    cps = 0;
    czas = 0;
    kliknięcia = 0;
    start = false;
    clearInterval(interval);
    Czasomierz.textContent = "Czas: 0";
    Licznik.textContent = "Ilość kliknięć: 0"; 
    CPS.textContent = "CPS: 0"
    Przycisk.style.backgroundColor = 'yellow';
    Przycisk.style.color = 'black';
}
Przycisk.addEventListener("click", () => {
    if (!start) {
    start = true;
    Przycisk.style.backgroundColor = 'red';
    Przycisk.style.color = 'red';
    interval = setInterval(() => {
      czas++;
      Czasomierz.textContent = "Czas: " + czas;
      if (czas >= 10) {
        clearInterval(interval);
        let n = cps.toFixed(2)
        alert("Wynik: " + kliknięcia + " kliknięć w 10 sekund. " + "Częstotliwość klikania " + n + " CPS");
        reset();
      }
    }, 1000);
  }
  kliknięcia++;
  Licznik.textContent = "Ilość kliknięć: " + kliknięcia;
  if (czas >= 1) {cps = kliknięcia / czas
    let n = cps.toFixed(2)
    CPS.textContent = "CPS: " + n}
});