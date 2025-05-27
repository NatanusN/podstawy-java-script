const words = ['kartka', 'taśma', 'telefon', 'ogórek', 'butelka'];
const selectedWord = words[Math.floor(Math.random() * words.length)];
let displayWord = Array(selectedWord.length).fill('_');
document.getElementById('word-display').textContent = displayWord.join(' ');