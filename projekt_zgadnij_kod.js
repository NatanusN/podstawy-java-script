const secretCode = generateCode();
let attempts = 0;
const maxAttempts = 6;

function generateCode() {
  const digits = [];
  while (digits.length < 3) {
    const rand = Math.floor(Math.random() * 10);
    if (!digits.includes(rand)) digits.push(rand);
  }
  return digits;
}

document.getElementById("guess-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const inputs = e.target.querySelectorAll("input");
  const guess = Array.from(inputs).map(input => parseInt(input.value));
  const result = [];

  for (let i = 0; i < 3; i++) {
    if (guess[i] === secretCode[i]) {
      result.push("<span class='correct'>" + guess[i] + "</span>");
    } else if (secretCode.includes(guess[i])) {
      result.push("<span class='partial'>" + guess[i] + "</span>");
    } else {
      result.push("<span class='wrong'>" + guess[i] + "</span>");
    }
  }

  document.getElementById("result-log").innerHTML += "<div>" + result.join(" ") + "</div>";
  attempts++;

  if (guess.join("") === secretCode.join("")) {
    alert("🎉 Brawo! Odgadłeś kod.");
  } else if (attempts >= maxAttempts) {
    alert("❌ Przegrałeś. Kod to: " + secretCode.join(""));
  }

  e.target.reset();
});