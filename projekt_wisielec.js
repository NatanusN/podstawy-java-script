let mistakes = 0;
const words = ['kartka', 'taśma', 'telefon', 'ogórek', 'butelka'];
const selectedWord = words[Math.floor(Math.random() * words.length)];
let displayWord = Array(selectedWord.length).fill('_');
document.getElementById('word-display').textContent = displayWord.join(' ');
const alphabet = 'aąbcćdeęfghijklłmnńoóprsśtuwyzźż';
alphabet.split('').forEach(letter => {
  const btn = document.createElement('button');
  btn.textContent = letter;
  btn.onclick = () => handleGuess(letter, btn);
  document.getElementById('letter-buttons').appendChild(btn);
});
function handleGuess(letter, button) {
  button.disabled = true;
  if (selectedWord.includes(letter)) {
    for (let i = 0; i < selectedWord.length; i++) {
      if (selectedWord[i] === letter) {
        displayWord[i] = letter;
        
      }
    }
    document.getElementById('word-display').textContent = displayWord.join(' ');if (!displayWord.includes('_')) {
  alert('Brawo! Odgadłeś słowo!');
}
  }
  else błędy(letter)
}
function błędy(letter) {
if (!selectedWord.includes(letter)) {
  mistakes++;
  
  document.getElementById('hangman-img').src = `wisielec0${mistakes}.png`;
}
if (mistakes === 9) {
  alert('Przegrałeś!');
}
}
