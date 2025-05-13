document.addEventListener("DOMContentLoaded", () => {
  const startButton      = document.getElementById("start-button");
  const playAgainBtn     = document.getElementById("play-again");
  const startScreen      = document.getElementById("start-screen");
  const gameScreen       = document.getElementById("game-screen");
  const gameOverScreen   = document.getElementById("game-over");
  const questionEl       = document.getElementById("question");
  const answersEl        = document.getElementById("answers");
  const fiftyBtn         = document.getElementById("fifty");
  const audienceBtn      = document.getElementById("audience");
  const phoneBtn         = document.getElementById("phone");
  const timerEl          = document.getElementById("timer");
  const moneyLadderEl    = document.getElementById("money-ladder");
  const resultMessage    = document.getElementById("game-over-title");
  const finalPrizeEl     = document.getElementById("final-prize");

  const questions = [
    { q:"What is the capital of France?",        a:["Paris","London","Berlin","Rome"],        c:0 },
    { q:"What is the largest ocean on Earth?",    a:["Atlantic","Indian","Arctic","Pacific"],   c:3 },
    { q:"What planet is the Red Planet?",         a:["Earth","Mars","Jupiter","Venus"],         c:1 },
    { q:"Which country invented tea?",            a:["India","China","England","Japan"],        c:1 },
    { q:"What is the boiling point of water?",    a:["90°C","100°C","120°C","80°C"],            c:1 },
    { q:"What gas do plants absorb?",             a:["Oxygen","Hydrogen","Nitrogen","CO₂"],      c:3 },
    { q:"Which element has symbol 'O'?",          a:["Osmium","Oxygen","Oxide","Oganesson"],     c:1 },
    { q:"Who wrote 'Macbeth'?",                   a:["Shakespeare","Dickens","Hemingway","Twain"],c:0 },
    { q:"How many continents are there?",         a:["5","6","7","8"],                          c:2 },
    { q:"What is the smallest prime number?",     a:["0","1","2","3"],                          c:2 },
    { q:"Who painted the Mona Lisa?",             a:["Van Gogh","Michelangelo","Da Vinci","Picasso"],c:2 },
    { q:"Which metal is liquid at room temp?",    a:["Mercury","Iron","Gold","Silver"],         c:0 },
    { q:"What's the hardest natural substance?",  a:["Steel","Diamond","Graphite","Quartz"],    c:1 },
    { q:"Which language has the most speakers?",  a:["English","Hindi","Spanish","Mandarin"],   c:3 },
    { q:"What is 12 × 12?",                       a:["124","144","132","112"],                  c:1 }
  ];

  const moneyLadder = [
    "$100", "$200", "$300", "$500", "$1,000",
    "$2,000", "$4,000", "$8,000", "$16,000", "$32,000",
    "$64,000", "$125,000", "$250,000", "$500,000", "$1,000,000"
  ];

  let currentIndex = 0;
  let timerId, timeLeft = 30;
  let usedFifty = false, usedAudience = false, usedPhone = false;

  startButton.onclick  = startGame;
  playAgainBtn.onclick = startGame;

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function startGame() {
    shuffleArray(questions);
    currentIndex = 0;
    usedFifty = usedAudience = usedPhone = false;
    updateLifelinesUI();
    startScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    loadQuestion();
    updateMoneyLadder();
  }

  function loadQuestion() {
    clearInterval(timerId);
    timeLeft = 30;
    updateTimerUI();
    timerId = setInterval(() => {
      timeLeft--;
      updateTimerUI();
      if (timeLeft <= 0) {
        clearInterval(timerId);
        endGame(false);
      }
    }, 1000);

    const { q, a } = questions[currentIndex];
    questionEl.textContent = q;
    answersEl.innerHTML = "";
    a.forEach((ans, idx) => {
      const btn = document.createElement("button");
      btn.textContent = ans;
      btn.onclick = () => selectAnswer(idx);
      const li = document.createElement("li");
      li.appendChild(btn);
      answersEl.appendChild(li);
    });

    updateMoneyLadder();
  }

  function updateTimerUI() {
    timerEl.textContent = `⏱️ ${Math.max(0, timeLeft)}s`;
  }

  function selectAnswer(idx) {
    clearInterval(timerId);
    const correct = questions[currentIndex].c;
    if (idx === correct) {
      currentIndex++;
      if (currentIndex === questions.length) return endGame(true);
      loadQuestion();
    } else {
      endGame(false);
    }
  }

  function endGame(didWin) {
    clearInterval(timerId);
    gameScreen.classList.add("hidden");
    gameOverScreen.classList.remove("hidden");
    if (didWin) {
      resultMessage.textContent = "🎉 You won the top prize!";
      finalPrizeEl.textContent = moneyLadder[moneyLadder.length - 1];
    } else {
      resultMessage.textContent = "❌ Game Over";
      const prize = currentIndex > 0 ? moneyLadder[currentIndex - 1] : "$0";
      finalPrizeEl.textContent = prize;
    }
  }

  fiftyBtn.onclick = () => {
    if (usedFifty) return;
    usedFifty = true;
    updateLifelinesUI();
    const correct = questions[currentIndex].c;
    const wrongs = [0,1,2,3].filter(i => i !== correct);
    shuffleArray(wrongs);
    wrongs.slice(0,2).forEach(i => {
      const btn = answersEl.querySelectorAll("button")[i];
      btn.disabled = true;
      btn.textContent = "";
    });
  };

  audienceBtn.onclick = () => {
    if (usedAudience) return;
    usedAudience = true;
    updateLifelinesUI();
    alert("Audience suggests: " + questions[currentIndex].a[questions[currentIndex].c]);
  };

  phoneBtn.onclick = () => {
    if (usedPhone) return;
    usedPhone = true;
    updateLifelinesUI();
    alert("Phone a Friend: " + questions[currentIndex].a[questions[currentIndex].c]);
  };

  function updateLifelinesUI() {
    [fiftyBtn, audienceBtn, phoneBtn].forEach((btn, i) => {
      const used = [usedFifty, usedAudience, usedPhone][i];
      btn.disabled = used;
      btn.style.opacity = used ? 0.5 : 1;
    });
  }

  function updateMoneyLadder() {
    moneyLadderEl.innerHTML = "";
    moneyLadder.forEach((amt, idx) => {
      const lvl = document.createElement("div");
      if (idx === currentIndex) lvl.classList.add("active");
      lvl.innerHTML = `<span>Q${idx+1}</span><span>${amt}</span>`;
      moneyLadderEl.appendChild(lvl);
    });
  }
});
