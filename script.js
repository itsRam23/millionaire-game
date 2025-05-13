const questions = [
  { question: "What is the capital of France?", answers: ["London", "Berlin", "Paris", "Madrid"], correct: 2 },
  { question: "Which planet is known as the Red Planet?", answers: ["Earth", "Venus", "Mars", "Jupiter"], correct: 2 },
  { question: "What is the smallest prime number?", answers: ["1", "2", "3", "5"], correct: 1 },
  { question: "Who wrote 'Romeo and Juliet'?", answers: ["William Wordsworth", "William Shakespeare", "John Keats", "Jane Austen"], correct: 1 },
  { question: "What is the boiling point of water?", answers: ["90°C", "100°C", "120°C", "80°C"], correct: 1 },
  // TODO: add up to 15 questions here to match moneyLadder length
];

const moneyLadder = [
  "$1,000,000",
  "$500,000",
  "$250,000",
  "$125,000",
  "$64,000",
  "$32,000",
  "$16,000",
  "$8,000",
  "$4,000",
  "$2,000",
  "$1,000",
  "$500",
  "$300",
  "$200",
  "$100"
].reverse(); // 15 levels

let current = 0;
let timeLeft = 30;
let timerId;
let isGameOver = false;
let usedFifty = false;
let usedAudience = false;
let usedPhone = false;

// UI Elements
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const gameScreen = document.getElementById("game-screen");
const gameOverScreen = document.getElementById("game-over");
const playAgainBtn = document.getElementById("play-again");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const timerEl = document.getElementById("timer");
const statusEl = document.getElementById("status");
const fiftyBtn = document.getElementById("fifty");
const audienceBtn = document.getElementById("audience");
const phoneBtn = document.getElementById("phone");
const backgroundMusic = document.getElementById("background-music");
const clickSFX = document.getElementById("click-sfx");
const moneyLadderEl = document.getElementById("money-ladder");
const finalPrize = document.getElementById("final-prize");

// Start Game
tartButton.onclick = () => {
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  backgroundMusic.play();
  resetGame();
};

playAgainBtn.onclick = () => {
  gameOverScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  backgroundMusic.currentTime = 0;
  backgroundMusic.play();
  resetGame();
};

function resetGame() {
  current = 0;
  usedFifty = false;
  usedAudience = false;
  usedPhone = false;
  updateLifelineButtons();
  loadQuestion();
  renderLadder();
}

function updateLifelineButtons() {
  fiftyBtn.disabled = usedFifty;
  audienceBtn.disabled = usedAudience;
  phoneBtn.disabled = usedPhone;
}

function loadQuestion() {
  // Win when you've answered all ladder levels
  if (current >= moneyLadder.length) return winGame();

  const q = questions[current];
  // If question undefined, end game
  if (!q) return gameOver();

  isGameOver = false;
  timeLeft = 30;
  timerEl.textContent = timeLeft;
  clearInterval(timerId);
  timerId = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerId);
      gameOver();
    }
  }, 1000);

  questionEl.textContent = q.question;
  answersEl.innerHTML = "";
  q.answers.forEach((ans, index) => {
    const btn = document.createElement("button");
    btn.textContent = ans;
    btn.onclick = () => checkAnswer(index);
    const li = document.createElement("li");
    li.appendChild(btn);
    answersEl.appendChild(li);
  });

  statusEl.textContent = "";
  renderLadder();
}

function checkAnswer(index) {
  if (isGameOver) return;
  clickSFX.play();

  const correctIndex = questions[current].correct;
  const allButtons = answersEl.querySelectorAll("button");
  allButtons.forEach(btn => btn.disabled = true);

  if (index === correctIndex) {
    statusEl.textContent = "Correct!";
    current++;
    setTimeout(loadQuestion, 1000);
  } else {
    statusEl.textContent = "Wrong answer!";
    setTimeout(gameOver, 1000);
  }
}

function renderLadder() {
  moneyLadderEl.innerHTML = "";
  moneyLadder.forEach((amount, index) => {
    const level = document.createElement("div");
    level.className = index === current ? "active" : "";
    level.innerHTML = `<span>Q${index + 1}</span> <span>${amount}</span>`;
    moneyLadderEl.appendChild(level);
  });
}

function gameOver() {
  isGameOver = true;
  clearInterval(timerId);
  gameScreen.classList.add("hidden");
  gameOverScreen.classList.remove("hidden");
  finalPrize.textContent = `You won: ${moneyLadder[current - 1] || "$0"}`;
  backgroundMusic.pause();
}

function winGame() {
  isGameOver = true;
  clearInterval(timerId);
  gameScreen.classList.add("hidden");
  gameOverScreen.classList.remove("hidden");
  finalPrize.textContent = `Congratulations! You won the top prize of ${moneyLadder[moneyLadder.length - 1]}!`;
  backgroundMusic.pause();
}

// Lifelines
fiftyBtn.onclick = () => {
  if (usedFifty) return;
  usedFifty = true;
  updateLifelineButtons();

  const correct = questions[current].correct;
  let wrong = [0,1,2,3].filter(i => i !== correct).sort(() => Math.random() - 0.5).slice(0,2);
  answersEl.querySelectorAll("button").forEach((btn,i) => {
    if (wrong.includes(i)) {
      btn.disabled = true;
      btn.textContent = "";
    }
  });
};

audienceBtn.onclick = () => {
  if (usedAudience) return;
  usedAudience = true;
  updateLifelineButtons();

  const correct = questions[current].correct;
  answersEl.querySelectorAll("button")[correct].textContent += " 👥";
};

phoneBtn.onclick = () => {
  if (usedPhone) return;
  usedPhone = true;
  updateLifelineButtons();

  const correct = questions[current].correct;
  answersEl.querySelectorAll("button")[correct].textContent += " ☎️";
};
