let punktyGracza = 0
let punktyKomputera = 0
document.querySelectorAll('.opcje').forEach(el => {
  el.addEventListener('click', function() {
    const WybórGracza = this.dataset.choice;
    console.log('Gracz wybrał:', WybórGracza);
  });
});
const WybórGracza = this.dataset;
const opcje = ['papier', 'kamień', 'nożyce'];
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
if (gra === 'wygrana') {
  punktyGracza++;
} else if (gra === 'przegrana') {
  punktyKomputera++;
}
if (gra === 'wygrana') {
  alert('Zdobyłeś punkt');
} else if (gra === 'przegrana'){
  alert('Straciłeś punkt');
} else {
  alert('Remis');
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
    }, 1000);