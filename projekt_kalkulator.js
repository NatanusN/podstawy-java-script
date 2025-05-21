const ekran = document.getElementById('ekran');
const przyciski = document.querySelectorAll('.przyciski button');

let zawartosc = "";

przyciski.forEach(przycisk => {
  przycisk.addEventListener('click', () => {
    const wartosc = przycisk.textContent;

    if (wartosc === 'C') {
      zawartosc = "";
      ekran.textContent = "0";
    } else if (wartosc === '=') {
      try {
        zawartosc = eval(zawartosc).toString();
        ekran.textContent = zawartosc;
      } catch {
        ekran.textContent = "Błąd";
        zawartosc = "";
      }
    } else {
      zawartosc += wartosc;
      ekran.textContent = zawartosc;
    }
  });
});