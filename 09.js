for (let i = 0; i < 10; i++) {
  if (i === 7) {
    break;
  }
  console.log(i);
}
console.log("--------------------------");
for (let i = 0; i <= 5; i++) {
  if (i === 4) {
    continue;
  }
  console.log(i);
}
console.log("--------------------------");
let i = 0;
while (i < 10) {
  i++;
  if (i % 2 === 0) {
    continue;
  }
  console.log(i);
}