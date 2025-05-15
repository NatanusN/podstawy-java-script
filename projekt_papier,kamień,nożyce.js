let obrazekKomputera = document.getElementById('komputerChoice')
const opcje = ['papier', 'kamień', 'nożyce'];
let WybórGracza = null
let punktyGracza = 0
let punktyKomputera = 0
document.querySelectorAll('.opcje').forEach(el => {
  el.addEventListener('click', function() {
     WybórGracza = this.dataset.choice;
    console.log('Gracz wybrał:', WybórGracza);
    game();
  });
});
function game (){
const wybórKomputera = opcje[Math.floor(Math.random() * opcje.length)];
obrazekKomputera.style.backgroundImage = `url(${wybórKomputera}.png)`
console.log('Komputer wybrał:', wybórKomputera);
let gra = '';
    setTimeout(() => {
      let gra = '';

      if (WybórGracza === wybórKomputera) {
        gra = 'remis';
      } else if (
        (WybórGracza === 'papier' && wybórKomputera === 'kamień') ||
        (WybórGracza === 'kamień' && wybórKomputera === 'nożyce') ||
        (WybórGracza === 'nożyce' && wybórKomputera === 'papier')
      ) {
        gra = 'wygrana';
      } else {
        gra = 'przegrana';
      }
      if (gra === 'wygrana') {
        punktyGracza++;
        alert('Zdobyles punkt!');
      } else if (gra === 'przegrana') {
        punktyKomputera++;
        alert('Straciłeś punkt.');
      } else {
        alert('Remis.');
      }
      if (punktyGracza === 3 || punktyKomputera === 3) {
        if (punktyGracza === 3) {
          alert('Wygrałeś!');
        } else {
          alert('Przegrałeś.');
        }
        punktyGracza = 0;
        punktyKomputera = 0;
      }
    }, 1000);}
