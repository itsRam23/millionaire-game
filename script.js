const prizeAmounts = [
  100,200,300,500,1000,
  2000,4000,8000,16000,32000,
  64000,125000,250000,500000,1000000
];

const questions = [
  { q:"Which philosopher is known for the theory of the 'categorical imperative'?", choices:["Friedrich Nietzsche","Immanuel Kant","Jean-Paul Sartre","David Hume"], answer:1 },
  { q:"In which year did the Chernobyl disaster occur?", choices:["1979","1982","1986","1990"], answer:2 },
  { q:"What is the term used to describe a market structure where a few large firms dominate?", choices:["Monopoly","Oligopoly","Perfect competition","Monopolistic competition"], answer:1 },
  { q:"Which chemical element has the highest melting point?", choices:["Tungsten","Carbon","Iron","Platinum"], answer:0 },
  { q:"Who was the first woman to win a Nobel Prize?", choices:["Marie Curie","Dorothy Hodgkin","Rosalind Franklin","Lise Meitner"], answer:0 },
  { q:"In which battle did Napoleon suffer his final defeat?", choices:["Austerlitz","Leipzig","Waterloo","Trafalgar"], answer:2 },
  { q:"What is the capital of Kazakhstan?", choices:["Almaty","Astana","Tashkent","Bishkek"], answer:1 },
  { q:"Who introduced 'survival of the fittest'?", choices:["Darwin","Wallace","Lamarck","Mendel"], answer:0 },
  { q:"What is the second most spoken language in the world?", choices:["English","Mandarin","Hindi","Spanish"], answer:3 },
  { q:"When did the United States land the first man on the moon?", choices:["1965","1969","1972","1959"], answer:1 },
  { q:"Which physicist developed the theory of general relativity?", choices:["Albert Einstein","Isaac Newton","Max Planck","Niels Bohr"], answer:0 },
  { q:"Which country was formerly known as Ceylon?", choices:["Sri Lanka","Thailand","Myanmar","Malawi"], answer:0 },
  { q:"The 'Great Barrier Reef' is located off the coast of which country?", choices:["Australia","New Zealand","South Africa","Indonesia"], answer:0 },
  { q:"What is the longest river in the world?", choices:["Amazon","Nile","Yangtze","Mississippi"], answer:1 },
  { q:"Which of the following is the hardest natural substance on Earth?", choices:["Gold","Diamond","Iron","Graphene"], answer:1 }
];

let current = 0, timerId, timeLeft = 30, isGameOver = false;
let usedFifty = false, usedAudience = false, usedPhone = false;

const startBtn = document.getElementById("start-button");
const playAgain = document.getElementById("play-again");
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const overScreen = document.getElementById("game-over");

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const statusEl = document.getElementById("status");
const timerEl = document.getElementById("timer");
const ladderEl = document.getElementById("money-ladder");
const finalPrizeEl = document.getElementById("final-prize");
const overTitle = document.getElementById("game-over-title");

const clickSfx = document.getElementById("click-sfx");
const bgMusic = document.getElementById("background-music");

// Build ladder
function renderLadder() {
  ladderEl.innerHTML = "";
  prizeAmounts.forEach((amt, idx) => {
    const div = document.createElement("div");
    div.textContent = `$${amt}`;
    if (idx === current) div.classList.add("active");
    ladderEl.prepend(div);
  });
}

// Start game
startBtn.onclick = () => {
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  bgMusic.play();
  resetLifelines();
  current = 0;
  renderLadder();
  loadQuestion();
};

// Play again
playAgain.onclick = () => {
  overScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
  resetLifelines();
  bgMusic.currentTime = 0; bgMusic.play();
};

function resetLifelines() {
  usedFifty = usedAudience = usedPhone = false;
  ["fifty","audience","phone"].forEach(id => {
    const btn = document.getElementById(id);
    btn.disabled = false;
  });
  Array.from(answersEl.children).forEach(li => {
    const btn = li.querySelector("button");
    if (btn) btn.style.visibility = "visible";
  });
  statusEl.textContent = "";
}

// Load next question or win
function loadQuestion() {
  if (current >= questions.length) return winGame();

  isGameOver = false;
  timeLeft = 30;
  timerEl.textContent = timeLeft;
  clearInterval(timerId);
  timerId = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) gameOver();
  }, 1000);

  renderLadder();
  const { q, choices } = questions[current];
  questionEl.textContent = q;
  answersEl.innerHTML = "";
  choices.forEach((c, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.textContent = c;
    btn.onclick = () => checkAnswer(i);
    li.appendChild(btn);
    answersEl.appendChild(li);
  });
}

// Answer check
function checkAnswer(i) {
  clickSfx.play();
  if (isGameOver) return;
  clearInterval(timerId);

  if (i === questions[current].answer) {
    current++;
    if (current === questions.length) winGame();
    else setTimeout(loadQuestion, 500);
  } else {
    wrongAnswer();
  }
}

function wrongAnswer() {
  isGameOver = true;
  clearInterval(timerId);
  bgMusic.pause();
  gameScreen.classList.add("hidden");
  overScreen.classList.remove("hidden");
  overTitle.textContent = "Game Over";
  finalPrizeEl.textContent = `You won: $${prizeAmounts[current - 1] || 0}`;
}

function winGame() {
  isGameOver = true;
  clearInterval(timerId);
  bgMusic.pause();
  gameScreen.classList.add("hidden");
  overScreen.classList.remove("hidden");
  overTitle.textContent = "🎉 You Won!";
  finalPrizeEl.textContent = `You won: $${prizeAmounts[prizeAmounts.length - 1]}`;
}

// Lifelines
document.getElementById("fifty").onclick = () => {
  if (usedFifty || isGameOver) return;
  usedFifty = true;
  const corr = questions[current].answer;
  const wrongs = [0,1,2,3].filter(i => i!==corr).sort(()=>Math.random()-.5).slice(0,2);
  wrongs.forEach(i => answersEl.children[i].querySelector("button").style.visibility="hidden");
  document.getElementById("fifty").disabled = true;
};

document.getElementById("audience").onclick = () => {
  if (usedAudience || isGameOver) return;
  usedAudience = true;
  const corr = questions[current].answer;
  const poll = questions[current].choices.map((c,i) => {
    const base = i===corr?60:10;
    return `${c}: ${base + Math.floor(Math.random()*30)}%`;
  });
  statusEl.textContent = "Audience: " + poll.join(" | ");
  document.getElementById("audience").disabled = true;
};

document.getElementById("phone").onclick = () => {
  if (usedPhone || isGameOver) return;
  usedPhone = true;
  const corrTxt = questions[current].choices[questions[current].answer];
  statusEl.textContent = `Friend: "I think it's '${corrTxt}'."`;
  document.getElementById("phone").disabled = true;
};
