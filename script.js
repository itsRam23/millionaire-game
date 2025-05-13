const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const lifelineFiftyBtn = document.getElementById("lifeline-fifty");
const lifelineAudienceBtn = document.getElementById("lifeline-audience");
const lifelinePhoneBtn = document.getElementById("lifeline-phone");
const timerEl = document.getElementById("timer");
const moneyLadderEl = document.getElementById("money-ladder");
const resultScreen = document.getElementById("result-screen");
const resultMessage = document.getElementById("result-message");
const playAgainBtn = document.getElementById("play-again");

let questions = [
  {
    question: "What is the capital of France?",
    answers: ["Paris", "London", "Berlin", "Rome"],
    correct: 0,
  },
  {
    question: "What is the largest ocean on Earth?",
    answers: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correct: 3,
  },
  {
    question: "What planet is known as the Red Planet?",
    answers: ["Earth", "Mars", "Jupiter", "Venus"],
    correct: 1,
  },
  {
    question: "Which country invented tea?",
    answers: ["India", "China", "England", "Japan"],
    correct: 1,
  },
  {
    question: "What is the boiling point of water?",
    answers: ["90°C", "100°C", "120°C", "80°C"],
    correct: 1,
  },
  {
    question: "What gas do plants absorb?",
    answers: ["Oxygen", "Hydrogen", "Nitrogen", "Carbon Dioxide"],
    correct: 3,
  },
  {
    question: "Which element has the symbol 'O'?",
    answers: ["Osmium", "Oxygen", "Oxide", "Oganesson"],
    correct: 1,
  },
  {
    question: "Who wrote 'Macbeth'?",
    answers: ["Shakespeare", "Dickens", "Hemingway", "Twain"],
    correct: 0,
  },
  {
    question: "How many continents are there?",
    answers: ["5", "6", "7", "8"],
    correct: 2,
  },
  {
    question: "What is the smallest prime number?",
    answers: ["0", "1", "2", "3"],
    correct: 2,
  },
  {
    question: "Who painted the Mona Lisa?",
    answers: ["Van Gogh", "Michelangelo", "Da Vinci", "Picasso"],
    correct: 2,
  },
  {
    question: "Which metal is liquid at room temp?",
    answers: ["Mercury", "Iron", "Gold", "Silver"],
    correct: 0,
  },
  {
    question: "What’s the hardest natural substance?",
    answers: ["Steel", "Diamond", "Graphite", "Quartz"],
    correct: 1,
  },
  {
    question: "Which language has the most speakers?",
    answers: ["English", "Hindi", "Spanish", "Mandarin"],
    correct: 3,
  },
  {
    question: "What is 12 x 12?",
    answers: ["124", "144", "132", "112"],
    correct: 1,
  }
];

let currentQuestionIndex = 0;
let usedFifty = false;
let usedAudience = false;
let usedPhone = false;
let timer;
let timeLeft = 30;

// Shuffle questions
function shuffleQuestions() {
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
}

function startGame() {
  shuffleQuestions();
  currentQuestionIndex = 0;
  usedFifty = false;
  usedAudience = false;
  usedPhone = false;
  resultScreen.style.display = "none";
  updateLifelineStyles();
  loadQuestion();
  updateMoneyLadder();
}

function loadQuestion() {
  clearInterval(timer);
  timeLeft = 30;
  updateTimerDisplay();
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame("Time's up! You lost.");
    }
  }, 1000);

  const current = questions[currentQuestionIndex];
  questionEl.textContent = current.question;
  answersEl.innerHTML = "";

  current.answers.forEach((answer, index) => {
    const li = document.createElement("li");
    li.textContent = answer;
    li.onclick = () => selectAnswer(index);
    answersEl.appendChild(li);
  });

  updateMoneyLadder();
}

function updateTimerDisplay() {
  timerEl.textContent = `⏱️ ${Math.max(0, timeLeft)}s`;
}

function selectAnswer(index) {
  clearInterval(timer);
  const correct = questions[currentQuestionIndex].correct;
  if (index === correct) {
    currentQuestionIndex++;
    if (currentQuestionIndex === questions.length) {
      endGame("🎉 Congratulations! You won the game!");
    } else {
      loadQuestion();
    }
  } else {
    endGame("❌ Wrong answer! Game over.");
  }
}

function endGame(message) {
  resultMessage.textContent = message;
  resultScreen.style.display = "flex";
}

playAgainBtn.onclick = () => {
  usedFifty = false;
  usedAudience = false;
  usedPhone = false;
  startGame();
};

lifelineFiftyBtn.onclick = () => {
  if (usedFifty) return;
  usedFifty = true;
  const current = questions[currentQuestionIndex];
  const correct = current.correct;
  const indices = [0, 1, 2, 3].filter(i => i !== correct);
  shuffleArray(indices);
  const toRemove = indices.slice(0, 2);

  Array.from(answersEl.children).forEach((li, idx) => {
    if (toRemove.includes(idx)) li.style.visibility = "hidden";
  });

  updateLifelineStyles();
};

lifelineAudienceBtn.onclick = () => {
  if (usedAudience) return;
  usedAudience = true;
  alert("📊 Audience suggests: " + questions[currentQuestionIndex].answers[questions[currentQuestionIndex].correct]);
  updateLifelineStyles();
};

lifelinePhoneBtn.onclick = () => {
  if (usedPhone) return;
  usedPhone = true;
  alert("📞 Phone a friend says: " + questions[currentQuestionIndex].answers[questions[currentQuestionIndex].correct]);
  updateLifelineStyles();
};

function updateLifelineStyles() {
  lifelineFiftyBtn.style.opacity = usedFifty ? "0.5" : "1";
  lifelineAudienceBtn.style.opacity = usedAudience ? "0.5" : "1";
  lifelinePhoneBtn.style.opacity = usedPhone ? "0.5" : "1";
}

function updateMoneyLadder() {
  const levels = [...Array(15).keys()].map(i => i + 1).reverse();
  moneyLadderEl.innerHTML = levels
    .map(
      level => `<li class="${15 - currentQuestionIndex === level ? "active" : ""}">Question ${level}</li>`
    )
    .join("");
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

startGame();
