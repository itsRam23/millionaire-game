// ——— 1) Prize ladder ———
const prizeAmounts = [
  100, 200, 300, 500, 1000,
  2000, 4000, 8000, 16000, 32000,
  64000, 125000, 250000, 500000, 1000000
];

// ——— 2) Questions ———
const questions = [
  { q: "Which philosopher is known for the theory of the 'categorical imperative'?", choices: ["Friedrich Nietzsche","Immanuel Kant","Jean-Paul Sartre","David Hume"], answer: 1 },
  { q: "In which year did the Chernobyl disaster occur?", choices: ["1979","1982","1986","1990"], answer: 2 },
  { q: "What is the term used to describe a market structure where a few large firms dominate?", choices: ["Monopoly","Oligopoly","Perfect competition","Monopolistic competition"], answer: 1 },
  { q: "Which chemical element has the highest melting point?", choices: ["Tungsten","Carbon","Iron","Platinum"], answer: 0 },
  { q: "Who was the first woman to win a Nobel Prize?", choices: ["Marie Curie","Dorothy Hodgkin","Rosalind Franklin","Lise Meitner"], answer: 0 },
  { q: "In which battle did Napoleon Bonaparte suffer his final defeat?", choices: ["Battle of Austerlitz","Battle of Leipzig","Battle of Waterloo","Battle of Trafalgar"], answer: 2 },
  { q: "What is the capital of Kazakhstan?", choices: ["Almaty","Astana","Tashkent","Bishkek"], answer: 1 },
  { q: "The concept of 'survival of the fittest' was introduced by which scientist?", choices: ["Charles Darwin","Alfred Wallace","Jean-Baptiste Lamarck","Gregor Mendel"], answer: 0 },
  { q: "What is the second most spoken language in the world?", choices: ["English","Mandarin","Hindi","Spanish"], answer: 3 },
  { q: "Which year did the United States land the first man on the moon?", choices: ["1965","1969","1972","1959"], answer: 1 },
  { q: "Which physicist developed the theory of general relativity?", choices: ["Albert Einstein","Isaac Newton","Max Planck","Niels Bohr"], answer: 0 },
  { q: "Which country was formerly known as Ceylon?", choices: ["Sri Lanka","Thailand","Myanmar","Malawi"], answer: 0 },
  { q: "The 'Great Barrier Reef' is located off the coast of which country?", choices: ["Australia","New Zealand","South Africa","Indonesia"], answer: 0 },
  { q: "What is the longest river in the world?", choices: ["Amazon River","Nile River","Yangtze River","Mississippi River"], answer: 1 },
  { q: "Which of the following is the hardest natural substance on Earth?", choices: ["Gold","Diamond","Iron","Graphene"], answer: 1 }
];

// ——— 3) State & element refs ———
let current = 0;
let used50 = false, usedAudience = false, usedPhone = false;

const startScreen   = document.getElementById("start-screen");
const startBtn      = document.getElementById("start-btn");
const gameContainer = document.getElementById("game-container");
const endScreen     = document.getElementById("end-screen");
const endMessage    = document.getElementById("end-message");
const restartBtn    = document.getElementById("restart-btn");

const questionEl = document.getElementById("question");
const answersEl  = document.getElementById("answers");
const statusEl   = document.getElementById("status");
const prizeEl    = document.getElementById("prize");
const btn50      = document.getElementById("fifty");
const btnAud     = document.getElementById("audience");
const btnPhone   = document.getElementById("phone");

// ——— 4) Start & Restart handlers ———
startBtn.onclick = () => {
  startScreen.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  resetGame();
  renderQuestion();
};

restartBtn.onclick = () => {
  endScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
};

// ——— 5) Reset game state ———
function resetGame() {
  current = 0;
  used50 = usedAudience = usedPhone = false;
  btn50.disabled = btnAud.disabled = btnPhone.disabled = false;
  statusEl.textContent = "";
}

// ——— 6) Render a question ———
function renderQuestion() {
  statusEl.textContent = "";
  prizeEl.textContent = `Prize: \$${prizeAmounts[current]}`;
  questionEl.textContent = questions[current].q;
  answersEl.innerHTML = "";

  questions[current].choices.forEach((text, idx) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.onclick = () => checkAnswer(idx);
    li.appendChild(btn);
    answersEl.appendChild(li);
  });
}

// ——— 7) Answer checking & end logic ———
function checkAnswer(idx) {
  const correct = questions[current].answer;
  if (idx === correct) {
    statusEl.textContent = "✅ Correct!";
    current++;
    if (current < questions.length) {
      setTimeout(renderQuestion, 1000);
    } else {
      endGame(true);
    }
  } else {
    endGame(false);
  }
}

function endGame(won) {
  // hide game, show end screen
  gameContainer.classList.add("hidden");
  endScreen.classList.remove("hidden");

  // disable lifelines
  btn50.disabled = btnAud.disabled = btnPhone.disabled = true;

  if (won) {
    endMessage.innerHTML = `🎉 You’ve won <strong>\$${prizeAmounts[prizeAmounts.length -1]}</strong>!`;
  } else {
    endMessage.innerHTML = `❌ Wrong answer! You leave with <strong>\$0</strong>.`;
  }
}

// ——— 8) Lifelines ———
btn50.onclick = () => {
  if (used50) return;
  used50 = true;
  const correct = questions[current].answer;
  const wrongs = questions[current].choices
    .map((_, i) => i).filter(i => i!==correct)
    .sort(()=>0.5-Math.random()).slice(0,2);
  wrongs.forEach(i=>{
    answersEl.children[i].querySelector("button").style.visibility = "hidden";
  });
  btn50.disabled = true;
};

btnAud.onclick = () => {
  if (usedAudience) return;
  usedAudience = true;
  const correct = questions[current].answer;
  const poll = questions[current].choices.map((c,i) => {
    const base = i===correct?50:10;
    return `${c}: ${base + Math.floor(Math.random()*41)}%`;
  });
  statusEl.textContent = `📊 Audience Poll → ${poll.join(", ")}`;
  btnAud.disabled = true;
};

btnPhone.onclick = () => {
  if (usedPhone) return;
  usedPhone = true;
  const correctText = questions[current].choices[questions[current].answer];
  statusEl.textContent = `📞 Phone-a-Friend → "I think it's '${correctText}'."`;
  btnPhone.disabled = true;
};