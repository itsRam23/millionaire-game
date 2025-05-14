document.addEventListener("DOMContentLoaded", () => {
  const startButton    = document.getElementById("start-button");
  const playAgainBtn   = document.getElementById("play-again");
  const startScreen    = document.getElementById("start-screen");
  const gameScreen     = document.getElementById("game-screen");
  const gameOverScreen = document.getElementById("game-over");
  const questionEl     = document.getElementById("question");
  const answersEl      = document.getElementById("answers");
  const fiftyBtn       = document.getElementById("fifty");
  const audienceBtn    = document.getElementById("audience");
  const phoneBtn       = document.getElementById("phone");
  const timerEl        = document.getElementById("timer");
  const moneyLadderEl  = document.getElementById("money-ladder");
  const resultMessage  = document.getElementById("game-over-title");
  const finalPrizeEl   = document.getElementById("final-prize");

  const bgMusic    = document.getElementById("bgmusic");
  const correctSfx = document.getElementById("correct-sfx");
  const loseSfx    = document.getElementById("lose-sfx");
  const winSfx     = document.getElementById("win-sfx");
  const clickSfx   = document.getElementById("click-sfx");

  document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      clickSfx.currentTime = 0;
      clickSfx.play();
    });
  });

  const allQuestions = [
    { q:"What is the capital of France?", a:["Paris","London","Berlin","Rome"], c:0 },
    { q:"What is the largest ocean on Earth?", a:["Atlantic","Indian","Arctic","Pacific"], c:3 },
    { q:"What planet is the Red Planet?", a:["Earth","Mars","Jupiter","Venus"], c:1 },
    { q:"Which country invented tea?", a:["India","China","England","Japan"], c:1 },
    { q:"What is the boiling point of water?", a:["90°C","100°C","120°C","80°C"], c:1 },
    { q:"What gas do plants absorb?", a:["Oxygen","Hydrogen","Nitrogen","CO₂"], c:3 },
    { q:"Which element has symbol 'O'?", a:["Osmium","Oxygen","Oxide","Oganesson"], c:1 },
    { q:"Who wrote 'Macbeth'?", a:["Shakespeare","Dickens","Hemingway","Twain"], c:0 },
    { q:"How many continents are there?", a:["5","6","7","8"], c:2 },
    { q:"What is the smallest prime number?", a:["0","1","2","3"], c:2 },
    { q:"Who painted the Mona Lisa?", a:["Van Gogh","Michelangelo","Da Vinci","Picasso"], c:2 },
    { q:"Which metal is liquid at room temp?", a:["Mercury","Iron","Gold","Silver"], c:0 },
    { q:"What's the hardest natural substance?", a:["Steel","Diamond","Graphite","Quartz"], c:1 },
    { q:"Which language has the most speakers?", a:["English","Hindi","Spanish","Mandarin"], c:3 },
    { q:"What is 12 × 12?", a:["124","144","132","112"], c:1 },

    { q:"In 'Death Note', what is L’s real name?", a:["Light Yagami","L Lawliet","Soichiro Yagami","Ryuk"], c:1 },
    { q:"In 'Naruto', what is Sasuke’s brother called?", a:["Itachi","Shisui","Madara","Obito"], c:0 },
    { q:"Which is the second ship of the Straw Hats?", a:["Going Merry","Thousand Sunny","Red Force","Moby Dick"], c:1 },
    { q:"Eren’s Titan form is known as?", a:["Colossal Titan","Beast Titan","Armored Titan","Attack Titan"], c:3 },
    { q:"Midoriya’s Quirk in 'My Hero Academia'?", a:["One For All","All For One","Dark Shadow","Half-Cold Half-Hot"], c:0 },
    { q:"Goku’s Saiyan name?", a:["Vegeta","Kakarot","Bardock","Raditz"], c:1 },
    { q:"What’s the name of Spike’s ship in 'Cowboy Bebop'?", a:["Swordfish II","Red Tail","Bebop","Hammerhead"], c:2 },

    { q:"Who played Michael Corleone in 'The Godfather'?", a:["Robert De Niro","Marlon Brando","Al Pacino","James Caan"], c:2 },
    { q:"In 'Pulp Fiction', what restaurant do they visit?", a:["Jack Rabbit Slim’s","Mel’s Diner","Mom’s Kitchen","FunTime Café"], c:0 },
    { q:"Andy’s job before prison in 'Shawshank Redemption'?", a:["Lawyer","Banker","Journalist","Teacher"], c:1 },
    { q:"In 'Inception', what is Cobb’s totem?", a:["Dice","Spinning top","Chess piece","Coin"], c:1 },
    { q:"Which pill does Neo take in 'The Matrix'?", a:["Red","Blue","Green","Black"], c:0 },
    { q:"Gandalf’s sword in 'Fellowship of the Ring'?", a:["Sting","Orcrist","Glamdring","Andúril"], c:2 },
    { q:"Princess Leia’s home planet?", a:["Tatooine","Naboo","Alderaan","Coruscant"], c:2 },

    { q:"What is the largest desert on Earth?", a:["Sahara","Gobi","Arctic","Kalahari"], c:2 },
    { q:"Which is the longest river in the world?", a:["Amazon","Nile","Yangtze","Mississippi"], c:1 },
    { q:"Which country spans the most time zones?", a:["Russia","USA","France","China"], c:2 },
    { q:"What is the highest mountain above sea level?", a:["K2","Everest","Kangchenjunga","Lhotse"], c:1 },
    { q:"Which two countries share the longest land border?", a:["Russia–China","USA–Canada","Argentina–Chile","Brazil–Argentina"], c:1 },
    { q:"What is the smallest independent country?", a:["Monaco","Nauru","San Marino","Vatican City"], c:3 },

    { q:"Who wrote '1984'?", a:["Aldous Huxley","George Orwell","Ray Bradbury","Jules Verne"], c:1 },
    { q:"What’s H₂O₂?", a:["Hydrogen peroxide","Sulfuric acid","Methane","Carbon dioxide"], c:0 },
    { q:"Who developed the theory of relativity?", a:["Newton","Einstein","Maxwell","Bohr"], c:1 },
    { q:"Capital of Mongolia?", a:["Astana","Tashkent","Ulaanbaatar","Bishkek"], c:2 },
    { q:"What year did WWI begin?", a:["1912","1914","1918","1920"], c:1 },
    { q:"Fastest land animal?", a:["Cheetah","Lion","Horse","Gazelle"], c:0 },
    { q:"Square root of 256?", a:["12","14","16","18"], c:2 },
    { q:"Hardest rock on Mohs scale?", a:["Quartz","Topaz","Diamond","Corundum"], c:2 },
    { q:"Which element has atomic number 1?", a:["Oxygen","Hydrogen","Helium","Carbon"], c:1 },
    { q:"Avogadro’s number (~)?", a:["6×10²³","3×10²³","9×10²³","1×10²²"], c:0 },
    { q:"Largest mammal?", a:["Elephant","Blue whale","Giraffe","Hippo"], c:1 },
    { q:"Deepest ocean trench?", a:["Mid-Atlantic Rift","Mariana Trench","Tonga Trench","Java Trench"], c:1 },
    { q:"First successful vaccine inventor?", a:["Pasteur","Newton","Edison","Curie"], c:0 },
    { q:"Planet with day longer than year?", a:["Mercury","Venus","Mars","Jupiter"], c:1 },
    { q:"Primary gas in Earth’s atmosphere?", a:["Oxygen","Nitrogen","Carbon dioxide","Argon"], c:1 },
    { q:"Painter of 'Starry Night'?", a:["Monet","Van Gogh","Klimt","Da Vinci"], c:1 },
    { q:"Longest reigning British monarch?", a:["Victoria","Elizabeth II","George III","Henry VIII"], c:1 },
    { q:"Who wrote 'Pride and Prejudice'?", a:["Charlotte Brontë","Jane Austen","Mary Shelley","Emily Brontë"], c:1 },
    { q:"Smallest prime >100?", a:["101","103","107","109"], c:0 },
    { q:"Capital of New Zealand?", a:["Auckland","Wellington","Christchurch","Hamilton"], c:1 },

    { q:"Which country’s flag features a maple leaf?", a:["Canada","Australia","New Zealand","Switzerland"], c:0 },
    { q:"Chemical symbol for gold?", a:["Au","Ag","Gd","Go"], c:0 },
    { q:"Who painted the Sistine Chapel ceiling?", a:["Leonardo","Raphael","Donatello","Michelangelo"], c:3 },
    { q:"Largest planet in our solar system?", a:["Earth","Saturn","Jupiter","Neptune"], c:2 },
    { q:"Who wrote 'The Odyssey'?", a:["Homer","Virgil","Ovid","Sophocles"], c:0 },
    { q:"Element with atomic number 6?", a:["Carbon","Oxygen","Nitrogen","Helium"], c:0 },
    { q:"Square root of 144?", a:["10","11","12","13"], c:2 },
    { q:"Year the Titanic sank?", a:["1910","1912","1914","1916"], c:1 },
    { q:"Tallest building in the world?", a:["Burj Khalifa","Shanghai Tower","One WTC","Taipei 101"], c:0 },
    { q:"CPU stands for?", a:["Central Process Unit","Central Processing Unit","Computer Personal Unit","Control Processing Unit"], c:1 },
    { q:"Who discovered penicillin?", a:["Fleming","Pasteur","Curie","Mendel"], c:0 },
    { q:"Chemical symbol for silver?", a:["Ag","Au","Si","Sr"], c:0 },
    { q:"Author of 'The Divine Comedy'?", a:["Dante Alighieri","Chaucer","Petrarch","Boccaccio"], c:0 },
    { q:"Year the Berlin Wall fell?", a:["1987","1989","1991","1993"], c:1 },
    { q:"What is pi to two decimals?", a:["3.12","3.14","3.16","3.18"], c:1 },
    { q:"Smallest bone in the human body?", a:["Stapes","Malleus","Incus","Cochlea"], c:0 },
    { q:"Capital of Iceland?", a:["Oslo","Helsinki","Reykjavík","Copenhagen"], c:2 },
    { q:"What does DNA stand for?", a:["Deoxyribonucleic Acid","Deoxyribonitric Acid","Deoxynucleic Acid","Dioxyribonucleic Acid"], c:0 },
    { q:"How many elements in periodic table?", a:["108","112","118","124"], c:2 },
    { q:"First woman in space?", a:["Valentina Tereshkova","Sally Ride","Mae Jemison","Kalpana Chawla"], c:0 },
    { q:"Longest river in Europe?", a:["Volga","Danube","Dnieper","Rhine"], c:0 },
    { q:"Which country has the most volcanoes?", a:["Indonesia","Japan","USA","Chile"], c:0 },
    { q:"What is a light year?", a:["Time unit","Distance unit","Energy unit","Mass unit"], c:1 },
    { q:"Largest organ in the human body?", a:["Liver","Skin","Heart","Lung"], c:1 },
    { q:"Who invented the telephone?", a:["Bell","Edison","Tesla","Marconi"], c:0 },
    { q:"What is the capital of Australia?", a:["Sydney","Melbourne","Canberra","Brisbane"], c:2 },
    { q:"Which gas is most abundant in the Sun?", a:["Hydrogen","Helium","Oxygen","Carbon"], c:0 },
    { q:"What is the hardest gemstone?", a:["Ruby","Diamond","Sapphire","Emerald"], c:1 },
    { q:"Who wrote 'Hamlet'?", a:["Marlowe","Shakespeare","Chaucer","Milton"], c:1 },
    { q:"Speed of light in vacuum (km/s)?", a:["300,000","150,000","450,000","600,000"], c:0 },
    { q:"What does HTTP stand for?", a:["HyperText Transfer Protocol","HighText Transfer Protocol","HyperTransfer Text Protocol","HighTransfer Text Protocol"], c:0 },
    { q:"Capital of Canada?", a:["Toronto","Vancouver","Ottawa","Montreal"], c:2 },
    { q:"Which planet has rings?", a:["Mars","Earth","Jupiter","Saturn"], c:3 },
    { q:"Who painted 'The Persistence of Memory'?", a:["Picasso","Dali","Miro","Kahlo"], c:1 },
    { q:"What is the currency of Japan?", a:["Yen","Won","Dollar","Euro"], c:0 },
    { q:"Heaviest naturally occurring element?", a:["Uranium","Lead","Gold","Plutonium"], c:0 },
    { q:"What is geothermal energy?", a:["Solar energy","Earth heat","Wind energy","Water energy"], c:1 },
    { q:"Who is the author of 'Ham on Rye'?", a:["Bukowski","Steinbeck","Hemingway","Fitzgerald"], c:0 }
  ];

  const moneyLadder = [
    "$100","$200","$300","$500","$1,000",
    "$2,000","$4,000","$8,000","$16,000","$32,000",
    "$64,000","$125,000","$250,000","$500,000","$1,000,000"
  ];

  let questions = [];
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
    bgMusic.currentTime = 0;
    bgMusic.play();
    const pool = allQuestions.slice();
    shuffleArray(pool);
    questions = pool.slice(0, 15);
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
    timerEl.textContent = `⏱️ ${timeLeft}s`;
    timerId = setInterval(() => {
      timeLeft--;
      timerEl.textContent = `⏱️ ${Math.max(0, timeLeft)}s`;
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

  function selectAnswer(idx) {
    clearInterval(timerId);
    const correct = questions[currentIndex].c;
    if (idx === correct) {
      correctSfx.currentTime = 0;
      correctSfx.play();
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
    bgMusic.pause();
    if (didWin) {
      winSfx.currentTime = 0;
      winSfx.play();
      resultMessage.textContent = "🎉 You won the top prize!";
      finalPrizeEl.textContent = moneyLadder[14];
    } else {
      loseSfx.currentTime = 0;
      loseSfx.play();
      resultMessage.textContent = "❌ Game Over";
      finalPrizeEl.textContent = currentIndex > 0
        ? moneyLadder[currentIndex - 1]
        : "$0";
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
