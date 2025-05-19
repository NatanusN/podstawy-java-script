const questions = [
  {
    question: "Z czego składa się woda?",
    answers: ["Z CO<sub>2</sub> i H", "Z Cl i O", "Z H<sub>2</sub> i O", "Z N i O"],
    correct: "Z H2 i O"
  },
  {
    question: "Ile to 2+2*2?",
    answers: ["4", "6", "8", "9"],
    correct: "6"
  },
  {
  question: "Jakiego kraju to jest flaga",
  answers: ["Polski", "Indonezji", "Niemiec", "Rosji"],
  correct: "Polski"
  },
  {
 question: "Kto jest autorem książki ''Pan Tadeusz''?",
  answers: ["Jan Kochanowski", "Aleksander Fredro", "Juliusz Słowacki", "Adam Mickiewicz"],
  correct: "Adam Mickiewicz"
  }
];
let currentQuestion = 0;
let score = 0;
const userAnswers = [];

function showQuestion() {
  const q = questions[currentQuestion];
  document.getElementById("question").innerHTML = q.question;
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";
  document.getElementById("next-btn").disabled = true;
if (currentQuestion === 2)  document.getElementById("img").classList.remove("off")
else document.getElementById("img").classList.add("off")
  q.answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.innerHTML = answer;
    btn.onclick = () => selectAnswer(answer);
    answersDiv.appendChild(btn);
  });
}
function selectAnswer(answer) {
  const q = questions[currentQuestion];
  const buttons = document.querySelectorAll("#answers button");
  buttons.forEach(btn => btn.disabled = true);

  userAnswers.push({
    question: q.question,
    selected: answer,
    correct: q.correct
  });

  if (answer === q.correct) {
    score++;
  }

  document.getElementById("next-btn").disabled = false;
}
showQuestion()
document.getElementById("next-btn").addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResults();
  }
});
function showResults() {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "<h2>Koniec! Twój wynik: " + score + " / " + questions.length + "</h2>";

  userAnswers.forEach(entry => {
    const result = document.createElement("div");
    const isCorrect = entry.selected === entry.correct;

    result.innerHTML = `
      <p><strong>${entry.question}</strong></p>
      <p>Twoja odpowiedź: <span class="${isCorrect ? 'correct' : 'wrong'}">${entry.selected}</span></p>
      <p>Poprawna odpowiedź: <strong>${entry.correct}</strong></p>
      <hr>
    `;
    container.appendChild(result);
  });
}