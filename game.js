
const TOTAL_QUESTIONS = 10;
let quiz = [];
let current = 0;
let score = 0;
let correct = 0;
let locked = false;

const $ = id => document.getElementById(id);

function shuffle(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function startGame() {
  quiz = shuffle(questions).slice(0, TOTAL_QUESTIONS);
  current = 0;
  score = 0;
  correct = 0;
  renderQuestion();
}

function renderQuestion() {
  locked = false;
  const q = quiz[current];

  $("count").textContent =
    `ข้อ ${current + 1}/${TOTAL_QUESTIONS}`;
  $("score").textContent = `คะแนน ${score}`;
  $("bar").style.width =
    `${current / TOTAL_QUESTIONS * 100}%`;

  $("question").textContent = "คำไหนเขียนถูกต้อง?";
  $("feedback").textContent = "";
  $("options").replaceChildren();
  $("next").classList.add("hidden");

  shuffle(q.options).forEach(word => {
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = word;
    button.addEventListener("click", () => checkAnswer(word, button));
    $("options").appendChild(button);
  });
}

function checkAnswer(word, selected) {
  if (locked) return;
  locked = true;

  const q = quiz[current];

  [...$("options").children].forEach(button => {
    button.disabled = true;

    if (button.textContent === q.word) {
      button.classList.add("correct");
    }
  });

  if (word === q.word) {
    score += 10;
    correct++;
    $("feedback").textContent = `✅ ถูกต้อง! ${q.why}`;
  } else {
    selected.classList.add("wrong");
    $("feedback").textContent =
      `❌ คำที่ถูกคือ "${q.word}" — ${q.why}`;
  }

  $("score").textContent = `คะแนน ${score}`;
  $("bar").style.width =
    `${(current + 1) / TOTAL_QUESTIONS * 100}%`;

  $("next").textContent =
    current === TOTAL_QUESTIONS - 1
      ? "ดูผลคะแนน 🏆"
      : "ข้อต่อไป ➜";

  $("next").classList.remove("hidden");
}

function nextQuestion() {
  if (!locked) return;

  current++;

  if (current < TOTAL_QUESTIONS) {
    renderQuestion();
  } else {
    localStorage.setItem("quizScore", score);
    localStorage.setItem("quizCorrect", correct);
    localStorage.setItem("quizTotal", TOTAL_QUESTIONS);

    window.location.href = "result.html";
  }
}

$("next").addEventListener("click", nextQuestion);
startGame();

