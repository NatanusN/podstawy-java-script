let pierwszyParagraf = document.querySelector('p');
pierwszyParagraf.style.color = 'blue';

let akapity = document.querySelectorAll('p');
akapity.forEach(function(paragraf) {
  paragraf.style.fontFamily = 'Arial';
});

let nagłówki = document.querySelectorAll('h1, h2, h3');
nagłówki.forEach(function(nagłówek) {
  nagłówek.style.backgroundColor = 'lightgray';
});
let pierwszyDiv = document.querySelector('div');
pierwszyDiv.innerHTML = 'Nowa treść';