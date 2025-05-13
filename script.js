const startScreen = document.getElementById("start-screen");
const main = document.getElementById("main");
const endScreen = document.getElementById("end-screen");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const prizeEl = document.getElementById("prize");
const statusEl = document.getElementById("status");
const finalPrizeEl = document.getElementById("final-prize");

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

const fiftyBtn = document.getElementById("fifty");
const audienceBtn = document.getElementById("audience");
const phoneBtn = document.getElementById("phone");

let current = 0;
let prize = 0;
let gameOver = false;

const prizeAmounts = [
  100, 200, 300, 500, 1000,
  2000, 4000, 8000, 16000, 32000,
  64000, 125000, 250000, 500000, 1000000
];

const questions = [
  {
    q: "Which philosopher is known for the theory of the 'categorical imperative'?",
    choices: ["Friedrich Nietzsche", "Immanuel Kant", "Jean-Paul Sartre", "David Hume"],
    answer: 1
  },
  {
    q: "In which year did the Chernobyl disaster occur?",
    choices: ["1979", "1982", "1986", "1990"],
    answer: 2
  },
  {
    q: "Which element has the highest melting point?",
    choices: ["Tungsten", "Iron", "Carbon", "Platinum"],
    answer: 0
  },
  {
    q: "Who was the first woman to win a Nobel Prize?",
    choices: ["Marie Curie", "Lise Meitner", "Dorothy Hodgkin", "Rosalind Franklin"],
    answer: 0
  }
];

function renderQuestion() {
  if (current >= questions.length) {
    endGame();
    return;
  }

  const q = questions[current];
  questionEl.textContent = q.q;
  answersEl.innerHTML = "";

  q.choices.forEach((choice, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => checkAnswer(i);
    li.appendChild(btn);
    answersEl.appendChild(li);
  });

  statusEl.textContent = "";
  prizeEl.textContent = `Prize: $${prize}`;
}

function checkAnswer(index) {
  if (gameOver) return;

  const correct = questions[current].answer;
  if (index === correct) {
    prize = prizeAmounts[current];
    current++;
    renderQuestion();
  } else {
    endGame();
  }
}

function endGame() {
  gameOver = true;
  main.classList.add("hidden");
  endScreen.classList.remove("hidden");
  finalPrizeEl.textContent = `You won $${prize}`;
  disableLifelines();
}

function resetGame() {
  current = 0;
  prize = 0;
  gameOver = false;
  enableLifelines();
  renderQuestion();
}

// Lifeline logic
fiftyBtn.onclick = () => {
  const correct = questions[current].answer;
  const wrongs = questions[current].choices
    .map((_, i) => i)
    .filter(i => i !== correct)
    .sort(() => 0.5 - Math.random())
    .slice(0, 2);

  wrongs.forEach(i => {
    const btn = answersEl.children[i].querySelector("button");
    btn.style.visibility = "hidden";
  });

  fiftyBtn.disabled = true;
};

audienceBtn.onclick = () => {
  const correct = questions[current].answer;
  const results = questions[current].choices.map((choice, i) => {
    const base = i === correct ? 50 : 10;
    return `${choice}: ${base + Math.floor(Math.random() * 41)}%`;
  });
  statusEl.textContent = "Audience says → " + results.join(", ");
  audienceBtn.disabled = true;
};

phoneBtn.onclick = () => {
  const correct = questions[current].choices[questions[current].answer];
  statusEl.textContent = `Friend says: "I think it's '${correct}'."`;
  phoneBtn.disabled = true;
};

function disableLifelines() {
  fiftyBtn.disabled = true;
  audienceBtn.disabled = true;
  phoneBtn.disabled = true;
}

function enableLifelines() {
  fiftyBtn.disabled = false;
  audienceBtn.disabled = false;
  phoneBtn.disabled = false;
}

// Start + Restart
startBtn.onclick = () => {
  startScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  main.classList.remove("hidden");
  resetGame();
};

restartBtn
