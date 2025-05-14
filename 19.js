const A = numbers.filter(n => n > 10);
console.log(A);

const B = nums.map(n => n * n);
console.log(B); 

const C = numbers.reduce((acc, curr) => acc + curr, 0);
console.log(C);

const D = names
  .filter(name => name.length > 4)
  .map(name => name.toUpperCase());
console.log(D);

const E = Array.from(document.querySelectorAll('p'))
  .map(p => p.textContent);
console.log(E);