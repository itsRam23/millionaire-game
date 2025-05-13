// script.js

// --- ELEMENT REFERENCES ---
const startScreen     = document.getElementById("start-screen");
const startButton     = document.getElementById("start-button");
const gameScreen      = document.getElementById("game-screen");
const gameOverScreen  = document.getElementById("game-over");
const playAgainBtn    = document.getElementById("play-again");

const questionEl      = document.getElementById("question");
const answersEl       = document.getElementById("answers");
const timerEl         = document.getElementById("timer");
const statusEl        = document.getElementById("status");
const moneyLadderEl   = document.getElementById("money-ladder");
const finalPrizeEl    = document.getElementById("final-prize");

const fiftyBtn        = document.getElementById("fifty");
const audienceBtn     = document.getElementById("audience");
const phoneBtn        = document.getElementById("phone");

const backgroundMusic = document.getElementById("background-music");
const clickSFX        = document.getElementById("click-sfx");

// --- QUESTIONS (15 total) ---
const questions = [
  { question: "What is the capital of France?",            answers: ["Paris","London","Berlin","Rome"],        correct: 0 },
  { question: "What is the largest ocean on Earth?",        answers: ["Atlantic","Indian","Arctic","Pacific"],   correct: 3 },
  { question: "What planet is known as the Red Planet?",    answers: ["Earth","Mars","Jupiter","Venus"],         correct: 1 },
  { question: "Which country invented tea?",                answers: ["India","China","England","Japan"],        correct: 1 },
  { question: "What is the boiling point of water?",        answers: ["90°C","100°C","120°C","80°C"],            correct: 1 },
  { question: "What gas do plants absorb?",                 answers: ["Oxygen","Hydrogen","Nitrogen","CO₂"],      correct: 3 },
  { question: "Which element has the symbol 'O'?",          answers: ["Osmium","Oxygen","Oxide","Oganesson"],     correct: 1 },
  { question: "Who wrote 'Macbeth'?",                       answers: ["Shakespeare","Dickens","Hemingway","Twain"], correct: 0 },
  { question: "How many continents are there?",             answers: ["5","6","7","8"],                          correct: 2 },
  { question: "What is the smallest prime number?",         answers: ["0","1","2","3"],                          correct: 2 },
  { question: "Who painted the Mona Lisa?",                 answers: ["Van Gogh","Michelangelo","Da Vinci","Picasso"], correct: 2 },
  { question: "Which metal is liquid at room temp?",        answers: ["Mercury","Iron","Gold","Silver"],         correct: 0 },
  { question: "What’s the hardest natural substance?",      answers: ["Steel","Diamond","Graphite","Quartz"],    correct: 1 },
  { question: "Which language has the most speakers?",      answers: ["English","Hindi","Spanish","Mandarin"],   correct: 3 },
  { question: "What is 12 x 12?",                          answers: ["124","144","132","112"],                  correct: 1 }
];

// --- MONEY LADDER (15 levels, reversed for display) ---
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
].reverse();

// --- GAME STATE ---
let currentIndex   = 0;
let timerId        = null;
let timeLeft       = 30;
let usedFifty      = false;
let usedAudience   = false;
let usedPhone      = false;

// --- START & RESTART ---
startButton.onclick = beginGame;
playAgainBtn.onclick = beginGame;

function beginGame() {
  // reset state
  currentIndex   = 0;
  timeLeft       = 30;
  usedFifty      = false;
  usedAudience   = false;
  usedPhone      = false;
  statusEl.textContent = "";
  updateLifelinesUI();

  startScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  backgroundMusic.currentTime = 0;
  backgroundMusic.play();

  renderLadder();
  loadQuestion();
}

// --- RENDER MONEY LADDER ---
function renderLadder() {
  moneyLadderEl.innerHTML = "";
  moneyLadder.forEach((amt, i) => {
    const lvl = document.createElement("div");
    lvl.className = (i === currentIndex) ? "active" : "";
    lvl.innerHTML = `<span>Q${i+1}</span><span>${amt}</span>`;
    moneyLadderEl.appendChild(lvl);
  });
}

// --- LOAD NEXT QUESTION OR WIN ---
function loadQuestion() {
  clearInterval(timerId);

  // Win condition: answered all 15 questions
  if (currentIndex >= questions.length) {
    return winGame();
  }

  // start timer
  timeLeft = 30;
  timerEl.textContent = timeLeft;
  timerId = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerId);
      endGame(false);
    }
  }, 1000);

  // populate question and answers
  const q = questions[currentIndex];
  questionEl.textContent = q.question;
  answersEl.innerHTML = "";
  q.answers.forEach((text, idx) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.disabled   = false;
    btn.onclick    = () => checkAnswer(idx);
    const li = document.createElement("li");
    li.appendChild(btn);
    answersEl.appendChild(li);
  });

  renderLadder();
}

// --- CHECK ANSWER ---
function checkAnswer(selected) {
  clearInterval(timerId);
  clickSFX.play();

  const correct = questions[currentIndex].correct;
  // disable all
  answersEl.querySelectorAll("button").forEach(b => b.disabled = true);

  if (selected === correct) {
    statusEl.textContent = "Correct!";
    currentIndex++;
    setTimeout(() => {
      statusEl.textContent = "";
      loadQuestion();
    }, 800);
  } else {
    statusEl.textContent = "Wrong!";
    setTimeout(() => endGame(false), 800);
  }
}

// --- LIFELINES ---
fiftyBtn.onclick = () => {
  if (usedFifty) return;
  usedFifty = true;
  updateLifelinesUI();
  const correct = questions[currentIndex].correct;
  // randomly hide two wrong answers
  const wrong = [0,1,2,3].filter(i => i!==correct);
  wrong.sort(() => Math.random()-0.5);
  wrong.slice(0,2).forEach(i => {
    const btn = answersEl.querySelectorAll("button")[i];
    btn.disabled = true;
    btn.textContent = "";
  });
};

audienceBtn.onclick = () => {
  if (usedAudience) return;
  usedAudience = true;
  updateLifelinesUI();
  alert("Audience suggests: " +
    questions[currentIndex].answers[questions[currentIndex].correct]
  );
};

phoneBtn.onclick = () => {
  if (usedPhone) return;
  usedPhone = true;
  updateLifelinesUI();
  alert("Phone a Friend says: " +
    questions[currentIndex].answers[questions[currentIndex].correct]
  );
};

function updateLifelinesUI() {
  fiftyBtn.disabled    = usedFifty;
  audienceBtn.disabled = usedAudience;
  phoneBtn.disabled    = usedPhone;
  fiftyBtn.style.opacity    = usedFifty    ? 0.5 : 1;
  audienceBtn.style.opacity = usedAudience ? 0.5 : 1;
  phoneBtn.style.opacity    = usedPhone    ? 0.5 : 1;
}

// --- END / WIN SCREENS ---
function endGame(didWin) {
  clearInterval(timerId);
  gameScreen.classList.add("hidden");
  gameOverScreen.classList.remove("hidden");
  if (didWin) {
    finalPrizeEl.textContent = `Congratulations! You won ${moneyLadder[moneyLadder.length-1]}!`;
  } else {
    const prize = currentIndex > 0 ? moneyLadder[currentIndex-1] : "$0";
    finalPrizeEl.textContent = `You won: ${prize}`;
  }
}

function winGame() {
  endGame(true);
}
