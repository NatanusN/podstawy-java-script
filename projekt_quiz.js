const questions = [
  {
    question: "Z czego składa się woda?",
    answers: ["Z CO2 i H", "Z Cl i O", "Z H2 i O", "Z N i O"],
    correct: "Z H2 i O"
  },
  {
    question: "Ile to 2+2*2?",
    answers: ["4", "6", "8", "9"],
    correct: "6"
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
  document.getElementById("question").textContent = q.question;
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";
  document.getElementById("next-btn").disabled = true;

  q.answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.textContent = answer;
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