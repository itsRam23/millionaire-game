// — 1) Prize ladder & questions
const prizeAmounts = [
  100, 200, 300, 500, 1000,
  2000, 4000, 8000, 16000, 32000,
  64000, 125000, 250000, 500000, 1000000
];

const questions = [
  { q: "Which philosopher is known for the 'categorical imperative'?", choices: ["Nietzsche","Kant","Sartre","Hume"], answer: 1 },
  { q: "Year of the Chernobyl disaster?", choices: ["1979","1982","1986","1990"], answer: 2 },
  /* … all 15 questions … */
  { q: "Hardest natural substance on Earth?", choices: ["Gold","Diamond","Iron","Graphene"], answer: 1 }
];

// — 2) State & DOM refs
let current = 0;
let used = { fifty:false, audience:false, phone:false };

const startScreen   = document.getElementById("start-screen");
const startBtn      = document.getElementById("start-btn");
const main          = document.getElementById("main");
const gamePanel     = document.getElementById("game-panel");
const ladderList    = document.getElementById("prize-list");
const questionEl    = document.getElementById("question");
const answersEl     = document.getElementById("answers");
const statusEl      = document.getElementById("status");
const btn50         = document.getElementById("fifty");
const btnAud        = document.getElementById("audience");
const btnPhone      = document.getElementById("phone");
const endScreen     = document.getElementById("end-screen");
const endMessage    = document.getElementById("end-message");
const restartBtn    = document.getElementById("restart-btn");

// — 3) Build ladder UI
function buildLadder() {
  ladderList.innerHTML = "";
  prizeAmounts.slice().reverse().forEach((amt, idx)=>{
    const li = document.createElement("li");
    li.textContent = `$${amt}`;
    li.id = `ladder-${14-idx}`;
    ladderList.appendChild(li);
  });
}

// — 4) Start & Restart
startBtn.onclick = () => {
  startScreen.classList.add("hidden");
  main.classList.remove("hidden");
  resetGame();
  renderQuestion();
};
restartBtn.onclick = () => {
  endScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
};

// — 5) Reset state
function resetGame(){
  current = 0;
  used = { fifty:false, audience:false, phone:false };
  [btn50,btnAud,btnPhone].forEach(b=>b.disabled=false);
  statusEl.textContent = "";
  buildLadder();
}

// — 6) Render question + highlight ladder
function renderQuestion(){
  // Clear status
  statusEl.textContent = "";
  // Highlight current prize
  document.querySelectorAll(".ladder li").forEach(li => li.classList.remove("current"));
  document.getElementById(`ladder-${current}`).classList.add("current");

  // Show question
  questionEl.textContent = questions[current].q;
  // Show answers
  answersEl.innerHTML = "";
  questions[current].choices.forEach((c,i)=>{
    const li = document.createElement("li");
    const btn= document.createElement("button");
    btn.textContent = c;
    btn.onclick = ()=>checkAnswer(i);
    li.appendChild(btn);
    answersEl.appendChild(li);
  });
}

// — 7) Check answer
function checkAnswer(i){
  if(i === questions[current].answer){
    current++;
    if(current < questions.length){
      statusEl.textContent = "✅ Correct!";
      setTimeout(renderQuestion, 800);
    } else {
      endGame(true);
    }
  } else {
    endGame(false);
  }
}

// — 8) End game
function endGame(won){
  main.classList.add("hidden");
  endScreen.classList.remove("hidden");
  [btn50,btnAud,btnPhone].forEach(b=>b.disabled=true);

  endMessage.innerHTML = won
    ? `🎉 You’ve won <strong>$${prizeAmounts[prizeAmounts.length-1]}</strong>!`
    : `❌ Wrong! You leave with <strong>$0</strong>.`;
}

// — 9) Lifelines
btn50.onclick = ()=>{
  if(used.fifty) return;
  used.fifty = true; btn50.disabled = true;
  const corr = questions[current].answer;
  const wrongs = [0,1,2,3].filter(i=>i!==corr).sort(()=>0.5-Math.random()).slice(0,2);
  wrongs.forEach(i=> answersEl.children[i].querySelector("button").style.visibility="hidden");
};

btnAud.onclick = ()=>{
  if(used.audience) return;
  used.audience=true; btnAud.disabled=true;
  const corr=questions[current].answer;
  const poll=questions[current].choices.map((c,i)=>{
    const base = i===corr?50:10;
    return `${c}: ${base+Math.floor(Math.random()*41)}%`;
  });
  statusEl.textContent = `📊 Audience: ${poll.join(", ")}`;
};

btnPhone.onclick = ()=>{
  if(used.phone) return;
  used.phone=true; btnPhone.disabled=true;
  const txt = questions[current].choices[questions[current].answer];
  statusEl.textContent = `📞 Friend: "I think it's '${txt}'."`;
};

// — init ladder when script loads
buildLadder();
