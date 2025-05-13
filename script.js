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
    q: "What is the term used to describe a market structure where a few large firms dominate?",
    choices: ["Monopoly", "Oligopoly", "Perfect competition", "Monopolistic competition"],
    answer: 1
  },
  {
    q: "Which chemical element has the highest melting point?",
    choices: ["Tungsten", "Carbon", "Iron", "Platinum"],
    answer: 0
  },
  {
    q: "Who was the first woman to win a Nobel Prize?",
    choices: ["Marie Curie", "Dorothy Hodgkin", "Rosalind Franklin", "Lise Meitner"],
    answer: 0
  },
  {
    q: "In which battle did Napoleon suffer his final defeat?",
    choices: ["Austerlitz", "Leipzig", "Waterloo", "Trafalgar"],
    answer: 2
  },
  {
    q: "Capital of Kazakhstan?",
    choices: ["Almaty", "Astana", "Tashkent", "Bishkek"],
    answer: 1
  },
  {
    q: "Who introduced 'survival of the fittest'?",
    choices: ["Darwin", "Wallace", "Lamarck", "Mendel"],
    answer: 0
  },
  {
    q: "Second most spoken language in the world?",
    choices: ["English", "Mandarin", "Hindi", "Spanish"],
    answer: 3
  },
  {
    q: "When did USA land on the moon?",
    choices: ["1965", "1969", "1972", "1959"],
    answer: 1
  },
  {
    q: "Who developed general relativity?",
    choices: ["Einstein", "Newton", "Planck", "Bohr"],
    answer: 0
  },
  {
    q: "What country was formerly Ceylon?",
    choices: ["Sri Lanka", "Thailand", "Myanmar", "Malawi"],
    answer: 0
  },
  {
    q: "Where is the Great Barrier Reef?",
    choices: ["Australia", "New Zealand", "South Africa", "Indonesia"],
    answer: 0
  },
  {
    q: "What is the longest river?",
    choices: ["Amazon", "Nile", "Yangtze", "Mississippi"],
    answer: 1
  },
  {
    q: "Hardest natural substance?",
    choices: ["Gold", "Diamond", "Iron", "Graphene"],
    answer: 1
  }
];

let current = 0;
let timer;
let timeLeft = 30;
let isGameOver = false;
let usedFifty = false;
let usedAudience = false;
let usedPhone = false;

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const statusEl = document.getElementById("status");
const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("start-button");
const gameScreen = document.getElementById("game-screen");
const startScreen = document.getElementById("start-screen");
const gameOverScreen = document.getElementById("game-over");
const finalPrizeEl = document.getElementById("final-prize");
const playAgainBtn = document.getElementById("play-again");
const ladder = document.getElementById("money-ladder");

const clickSFX = document.getElementById("click-sfx");
const bgMusic = document.getElementById("background-music");

startBtn.onclick = () => {
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  bgMusic.play();
  renderLadder();
  loadQuestion();
};

playAgainBtn.onclick = () => {
  gameOverScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
  current = 0;
  isGameOver = false;
  usedFifty = false;
  usedAudience = false;
  usedPhone = false;
  statusEl.textContent = "";
  Array.from(answersEl.children).forEach((li) => {
    const btn = li.querySelector("button");
    if (btn) btn.style.visibility = "visible";
  });
  document.getElementById("fifty").disabled = false;
  document.getElementById("audience").disabled = false;
  document.getElementById("phone").disabled = false;
  bgMusic.play();
};

function renderLadder() {
  ladder.innerHTML = '';
  for (let i = prizeAmounts.length - 1; i >= 0; i--) {
    const div = document.createElement("div");
    div.textContent = `$${prizeAmounts[i]}`;
    if (i === current) div.classList.add("active");
    ladder.appendChild(div);
  }
}

function loadQuestion() {
  if (current >= questions.length) return winGame();

  renderLadder();
  statusEl.textContent = "";
  timeLeft = 30;
  timerEl.textContent = timeLeft;
  startTimer();

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
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      gameOver();
    }
  }, 1000);
}

function checkAnswer(i) {
  clickSFX.play();
  if (isGameOver) return;

  const correct = questions[current].answer;
  if (i === correct) {
    current++;
    if (current === questions.length) winGame();
    else loadQuestion();
  } else {
    gameOver();
  }
}

function gameOver() {
  isGameOver = true;
  clearInterval(timer);
  bgMusic.pause();
  bgMusic.currentTime = 0;
  gameScreen.classList.add("hidden");
  gameOverScreen.classList.remove("hidden");
  finalPrizeEl.textContent = `You won: $${prizeAmounts[current - 1] || 0}`;
}

function winGame() {
  gameOver();
  document.getElementById("game-over-title").textContent = "🎉 You WON!";
}

// Lifelines
document.getElementById("fifty").onclick = () => {
  if (usedFifty) return;
  usedFifty = true;

  const correct = questions[current].answer;
  const wrongs = [0, 1, 2, 3].filter(i => i !== correct).sort(() => Math.random() - 0.5).slice(0, 2);
  wrongs.forEach(i => {
    answersEl.children[i].querySelector("button").style.visibility = "hidden";
  });
  document.getElementById("fifty").disabled = true;
};

document.getElementById("audience").onclick = () => {
  if (usedAudience) return;
  usedAudience = true;

  const correct = questions[current].answer;
  const results = questions[current].choices.map((choice, i) => {
    const base = i === correct ? 60 : 10;
    return `${choice}: ${base + Math.floor(Math.random() * 30)}%`;
  });
  statusEl.textContent = "Audience: " + results.join(" | ");
  document.getElementById("audience").disabled = true;
};

document.getElementById("phone").onclick = () => {
  if (usedPhone) return;
  usedPhone = true;

  const correct = questions[current].answer;
  statusEl.textContent = `Friend: "I'm pretty sure it's '${questions[current].choices[correct]}'"`;
  document.getElementById("phone").disabled = true;
};
