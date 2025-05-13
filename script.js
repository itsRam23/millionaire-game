// —–– 1) QUESTIONS & PRIZES —––
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
  },
  // add more if you like...
];

const prizeAmounts = [
  100, 200, 300, 500, 1000,
  2000, 4000, 8000, 16000, 32000,
  64000, 125000, 250000, 500000, 1000000
];

// —–– 2) STATE & DOM REFS —––
let current = 0,
    gameOver = false;

const startScreen = document.getElementById("start-screen");
const main        = document.getElementById("main");
const endScreen   = document.getElementById("end-screen");

const startBtn    = document.getElementById("start-btn");
const restartBtn  = document.getElementById("restart-btn");

const questionEl  = document.getElementById("question");
const answersEl   = document.getElementById("answers");
const statusEl    = document.getElementById("status");

const fiftyBtn    = document.getElementById("fifty");
const audienceBtn = document.getElementById("audience");
const phoneBtn    = document.getElementById("phone");

const ladderList  = document.getElementById("prize-list");
const finalPrize  = document.getElementById("final-prize");
const endTitle    = document.getElementById("end-title");

// —–– 3) BUILD MONEY LADDER —––
function buildLadder() {
  ladderList.innerHTML = "";
  prizeAmounts.slice().reverse().forEach((amt, i) => {
    const idx = prizeAmounts.length - 1 - i;
    const li = document.createElement("li");
    li.id = `ladder-${idx}`;
    li.innerHTML = `<span>Q${idx+1}</span><span>$${amt}</span>`;
    ladderList.appendChild(li);
  });
}

// —–– 4) START & RESTART —––
startBtn.onclick = () => {
  startScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  main.classList.remove("hidden");
  resetGame();
  renderQuestion();
};

restartBtn.onclick = () => {
  endScreen.classList.add("hidden");
  main.classList.remove("hidden");
  resetGame();
  renderQuestion();
};

// —–– 5) RESET GAME —––
function resetGame() {
  current = 0;
  gameOver = false;
  statusEl.textContent = "";
  enableLifelines();
  highlightLadder();
}

// —–– 6) RENDER QUESTION —––
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
}

// —–– 7) CHECK ANSWER —––
function checkAnswer(i) {
  if (gameOver) return;

  if (i === questions[current].answer) {
    current++;
    renderQuestion();
  } else {
    endGame(false);
  }
}

// —–– 8) END GAME —––
function endGame(won) {
  gameOver = true;
  main.classList.add("hidden");
  endScreen.classList.remove("hidden");

  if (won) {
    endTitle.textContent = "You Won! 🎉";
    finalPrize.textContent = `You’ve won $${prizeAmounts[current-1] || 0}`;
  } else {
    endTitle.textContent = "Game Over!";
    finalPrize.textContent = `You won $${current>0 ? prizeAmounts[current-1] : 0}`;
  }
  disableLifelines();
}

// —–– 9) MONEY LADDER HIGHLIGHT —––
function highlightLadder() {
  document.querySelectorAll(".ladder li").forEach(li => li.classList.remove("current"));
  if (current < prizeAmounts.length) {
    document.getElementById(`ladder-${current}`)?.classList.add("current");
  }
}

// —–– 10) LIFELINES —––
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
  const correctText = questions[current].choices[questions[current].answer];
  statusEl.textContent = `Friend says: "I think it's '${correctText}'."`;
  phoneBtn.disabled = true;
};

// —–– 11) ENABLE / DISABLE LIFELINES —––
function disableLifelines() {
  [fiftyBtn, audienceBtn, phoneBtn].forEach(b => b.disabled = true);
}
function enableLifelines() {
  [fiftyBtn, audienceBtn, phoneBtn].forEach(b => b.disabled = false);
}

// —–– INITIAL SETUP —––
buildLadder();
