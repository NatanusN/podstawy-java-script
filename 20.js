const h2 = document.createElement('h2');
h2.textContent = "Witaj w DOM!";
document.body.appendChild(h2);

const ul = document.createElement('ul');
["list item 1", "list item 2", "list item 3"].forEach(listitem => {
  const li = document.createElement('li');
  li.textContent = listitem;
  ul.appendChild(li);
});
document.body.appendChild(ul);

const button = document.createElement('button');
button.textContent = "Dodaj paragraf";
button.addEventListener('click', () => {
  const p = document.createElement('p');
  p.textContent = "nowy paragraf";
  document.body.appendChild(p);
});
document.body.appendChild(button);