let tratwaNaLewym = true;
let naTratwie = null;

function przeniesNaTratwe(id) {
  if (naTratwie === null && tratwaNaLewym === (document.getElementById(id).parentElement.id === "lewyBrzeg")) {
    naTratwie = document.getElementById(id);
    document.getElementById("tratwa").appendChild(naTratwie);
  }
}

function przeplynNaDrugiBrzeg() {
  tratwaNaLewym = !tratwaNaLewym;
  const brzeg = tratwaNaLewym ? "lewyBrzeg" : "prawyBrzeg";
  document.getElementById("rzeka").style.flexDirection = tratwaNaLewym ? "row" : "row-reverse";
  sprawdzZasady();
}

function zostawElement() {
  if (naTratwie) {
    const brzeg = tratwaNaLewym ? "lewyBrzeg" : "prawyBrzeg";
    document.getElementById(brzeg).appendChild(naTratwie);
    naTratwie = null;
  }
}

function sprawdzZasady() {
  const brzeg = tratwaNaLewym ? "prawyBrzeg" : "lewyBrzeg";
  const dzieci = Array.from(document.getElementById(brzeg).children).map(el => el.id);
  
  if (dzieci.includes("wilk") && dzieci.includes("owca") && !dzieci.includes("przewoznik")) {
    alert("❌ Wilk zjadł owcę!");
  }

  if (dzieci.includes("owca") && dzieci.includes("kapusta") && !dzieci.includes("przewoznik")) {
    alert("❌ Owca zjadła kapustę!");
  }
}