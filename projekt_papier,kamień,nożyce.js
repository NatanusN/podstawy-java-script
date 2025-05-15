document.querySelectorAll('.opcje').forEach(el => {
  el.addEventListener('click', function() {
    const WybórGracza = this.dataset.choice;
    console.log('Gracz wybrał:', WybórGracza);
  });
});
const WybórGracza = this.dataset;
const opcje = ['papier', 'kamien', 'nożyce'];
const wybórKomputera = opcje[Math.floor(Math.random() * opcje.length)];
console.log('Komputer wybrał:', wybórKomputera);
if (WybórGracza === wybórKomputera) {
  alert('Remis');
}
let gra = '';

if (
  (WybórGracza === 'papier' && wybórKomputera === 'kamień') ||
  (WybórGracza === 'kamień' && wybórKomputera === 'nożyce') ||
  (WybórGracza === 'nożyce' && wybórKomputera === 'papier')
) {
  gra = 'wygrana';
} else if (WybórGracza !== wybórKomputera) {
  gra = 'przegrana';
}
