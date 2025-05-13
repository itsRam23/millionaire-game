// —— 1) QUESTIONS & PRIZES —— 
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
const prizeAmounts = [100, 200, 300, 500];

// —— 2) STATE & REFS —— 
let current = 0, gameOver = false, timerId;

const startScreen  = document.getElementById("start-screen");
const main         = document.getElementById("main");
const endScreen    = document.getElementById("end-screen");
const startBtn     = document.getElementById("start-btn");
const restartBtn   = document.getElementById("restart-btn");

const questionEl   = document.getElementById("question");
const answersEl    = document.getElementById("answers");
const statusEl     = document.getElementById("status");
const timerEl      = document.getElementById("timer");

const fiftyBtn     = document.getElementById("fifty");
const audienceBtn  = document.getElementById("audience");
const phoneBtn     = document.getElementById("phone");

const ladderList   = document.getElementById("prize-list");
const endTitle     = document.getElementById("end-title");
const finalPrizeEl = document.getElementById("final-prize");

const clickSound   = document.getElementById("click-sound");
const correctSound = document.getElementById("correct-sound");
const wrongSound   = document.getElementById("wrong-sound");

// —— 3) BUILD LADDER —— 
function buildLadder() {
  ladderList.innerHTML = "";
  prizeAmounts.slice().reverse().forEach((amt, idx) => {
    const realIdx = prizeAmounts.length - 1 - idx;
    const li = document.createElement("li");
    li.id = `ladder-${realIdx}`;
    li.innerHTML = `<span>Q${realIdx + 1}</span><span>$${amt}</span>`;
    ladderList.appendChild(li);
  });
}

// —— 4) START & RESTART —— 
startBtn.onclick = () => {
  clickSound.play();
  startScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  main.classList.remove("hidden");
  resetGame();
  renderQuestion();
};

restartBtn.onclick = () => {
  clickSound.play();
  endScreen.classList.add("hidden");
  main.classList.remove("hidden");
  resetGame();
  renderQuestion();
};

// —— 5) RESET —— 
function resetGame() {
  current = 0;
  gameOver = false;
  clearInterval(timerId);
  statusEl.textContent = "";
  enableLifelines();
  highlightLadder();
}

// —— 6) RENDER —— 
function renderQuestion() {
  if (current >= questions.length) {
    return endGame(true);
  }
  highlightLadder();
  const { q, choices } = questions[current];
  questionEl.textContent = q;
  answersEl.innerHTML = "";
  choices.forEach((c, i) => {
    const btn = document.createElement("button");
    btn.textContent = c;
    btn.onclick = () => checkAnswer(i);
    const li = document.createElement("li");
    li.appendChild(btn);
    answersEl.appendChild(li);
  });

  startTimer(15);
}

// —— 7) TIMER —— 
function startTimer(seconds) {
  clearInterval(timerId);
  timerEl.textContent = seconds;
  let timeLeft = seconds;
  timerId = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerId);
      endGame(false);
    }
  }, 1000);
}

// —— 8) CHECK —— 
function checkAnswer(i) {
  if (gameOver) return;
  clickSound.play();
  clearInterval(timerId);

  if (i === questions[current].answer) {
    correctSound.play();
    if (current === questions.length - 1) {
      return endGame(true);
    }
    current++;
    setTimeout(renderQuestion, 500);
  } else {
    wrongSound.play();
    endGame(false);
  }
}

// —— 9) END GAME —— 
function endGame(won) {
  gameOver = true;
  clearInterval(timerId);
  main.classList.add("hidden");
  endScreen.classList.remove("hidden");

  endTitle.textContent = won ? "You Won! 🎉" : "Game Over!";
  const prize = won
    ? prizeAmounts[current]
    : current > 0
      ? prizeAmounts[current - 1]
      : 0;
  finalPrizeEl.textContent = `You won $${prize}`;
  disableLifelines();
}

// —— 10) LADDER HIGHLIGHT —— 
function highlightLadder() {
  document.querySelectorAll(".ladder li").forEach(li => li.classList.remove("current"));
  if (current < prizeAmounts.length) {
    document.getElementById(`ladder-${current}`)?.classList.add("current");
  }
}

// —— 11) LIFELINES —— 
fiftyBtn.onclick = () => {
  if (gameOver || fiftyBtn.disabled) return;
  const correct = questions[current].answer;
  const wrongs = [0,1,2,3].filter(i => i !== correct).sort(() => 0.5 - Math.random()).slice(0,2);
  wrongs.forEach(i => answersEl.children[i].querySelector("button").style.visibility = "hidden");
  fiftyBtn.disabled = true;
};

audienceBtn.onclick = () => {
  if (gameOver || audienceBtn.disabled) return;
  const correct = questions[current].answer;
  const poll = questions[current].choices.map((c,i) => {
    const base = i === correct ? 50 : 10;
    return `${c}: ${base + Math.floor(Math.random()*41)}%`;
  });
  statusEl.textContent = `Audience says → ${poll.join(", ")}`;
  audienceBtn.disabled = true;
};

phoneBtn.onclick = () => {
  if (gameOver || phoneBtn.disabled) return;
  const correct = questions[current].choices[questions[current].answer];
  statusEl.textContent = `Friend says: "I think it's '${correct}'."`;
  phoneBtn.disabled = true;
};

// —— 12) ENABLE / DISABLE LIFELINES —— 
function disableLifelines() {
  [fiftyBtn, audienceBtn, phoneBtn].forEach(b => b.disabled = true);
}
function enableLifelines() {
  [fiftyBtn, audienceBtn, phoneBtn].forEach(b => b.disabled = false);
}

// —— INIT —— 
buildLadder();
