function mnoz(a, b) {
    return a * b;
}
console.log(mnoz (7, 8));
console.log("--------------------------");
function max (c, d) {
    return c > d ? c : d;
}
console.log(max(2345, 2421))
console.log("----------------------");
function sumaTablicy(tablica) {
  let suma = 0;
  for (let i = 0; i < tablica.length; i++) {
    suma += tablica[i];
  }
  return suma;
}
console.log(sumaTablicy([1, 2, 3, 4, 5]));
console.log("--------------------------------");
function poleProstokata(e, f) {
  return e * f;
}
console.log(poleProstokata(5, 8));
console.log("----------------------------------");
function czyDodatnia(n) {
  return n > 0;
}
console.log(czyDodatnia(10));
console.log(czyDodatnia(-5));
console.log("------------------------------------");
function długośćStringa(str) {
  return str.length;
}
console.log(długośćStringa("Hello World"));
console.log("---------------------------------------");
function pierwszyElement(tablica) {
  return tablica[0];
}
console.log(pierwszyElement([2, 4, 6, 8]));
console.log("-------------------------------------------");
function czyUjemna(x) {
  return x < 0;
}
console.log(czyUjemna(-1));
console.log(czyUjemna(5));