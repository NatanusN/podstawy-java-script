let akapit = document.querySelector('p');
akapit.style.color = 'blue';

let akapity = document.querySelectorAll('p');
akapity.forEach(function(paragraf) {
  paragraf.style.backgroundColor = 'lightgray';
});

let nagłówek = document.querySelector('h1');
nagłówek.style.fontSize = '30px';

let obrazek = document.querySelector('img');
obrazek.style.width = '300px';
obrazek.style.height = '200px';

let divy = document.querySelectorAll('div');
divy.forEach(function(div) {
  div.style.backgroundColor = 'green';
});

let przyciski = document.querySelectorAll('button');
przyciski.forEach(function(przycisk) {
  przycisk.style.width = '150px';
});