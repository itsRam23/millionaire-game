// 1. Array of prize amounts for each question (in dollars)
const prizeAmounts = [
  100, 200, 300, 500, 1000, // 1-5 questions
  2000, 4000, 8000, 16000, 32000, // 6-10 questions
  64000, 125000, 250000, 500000, 1000000 // 11-15 questions
];

// 2. Array of challenging quiz questions (question text, choices, correct answer index)
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
    q: "What is the term used to describe a market structure where a few large firms dominate?",
    choices: ["Monopoly", "Oligopoly", "Perfect competition", "Monopolistic competition"],
    answer: 1
  },
  {
    q: "Which chemical element has the highest melting point?",
    choices: ["Tungsten", "Carbon", "Iron", "Platinum"],
    answer: 0
  },
  {
    q: "Who was the first woman to win a Nobel Prize?",
    choices: ["Marie Curie", "Dorothy Hodgkin", "Rosalind Franklin", "Lise Meitner"],
    answer: 0
  },
  {
    q: "In which battle did Napoleon Bonaparte suffer his final defeat?",
    choices: ["Battle of Austerlitz", "Battle of Leipzig", "Battle of Waterloo", "Battle of Trafalgar"],
    answer: 2
  },
  {
    q: "What is the capital of Kazakhstan?",
    choices: ["Almaty", "Astana", "Tashkent", "Bishkek"],
    answer: 1
  },
  {
    q: "The concept of 'survival of the fittest' was introduced by which scientist?",
    choices: ["Charles Darwin", "Alfred Wallace", "Jean-Baptiste Lamarck", "Gregor Mendel"],
    answer: 0
  },
  {
    q: "What is the second most spoken language in the world?",
    choices: ["English", "Mandarin", "Hindi", "Spanish"],
    answer: 3
  },
  {
    q: "Which year did the United States land the first man on the moon?",
    choices: ["1965", "1969", "1972", "1959"],
    answer: 1
  },
  {
    q: "Which physicist developed the theory of general relativity?",
    choices: ["Albert Einstein", "Isaac Newton", "Max Planck", "Niels Bohr"],
    answer: 0
  },
  {
    q: "Which country was formerly known as Ceylon?",
    choices: ["Sri Lanka", "Thailand", "Myanmar", "Malawi"],
    answer: 0
  },
  {
    q: "The 'Great Barrier Reef' is located off the coast of which country?",
    choices: ["Australia", "New Zealand", "South Africa", "Indonesia"],
    answer: 0
  },
  {
    q: "What is the longest river in the world?",
    choices: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
    answer: 1
  },
  {
    q: "Which of the following is the hardest natural substance on Earth?",
    choices: ["Gold", "Diamond", "Iron", "Graphene"],
    answer: 1
  }
];

// 50/50 lifeline: hides two wrong answers
document.getElementById("fifty").onclick = () => {
  const correct = questions[current].answer;
  // Build an array of wrong answer indices
  const wrongIndices = questions[current].choices
    .map((_, i) => i)
    .filter(i => i !== correct)
    .sort(() => 0.5 - Math.random())
    .slice(0, 2);

  // Hide those two wrong buttons
  wrongIndices.forEach(i => {
    const btn = answersEl.children[i].querySelector("button");
    btn.style.visibility = "hidden";
  });

  // Disable the lifeline button so you can’t reuse it
  document.getElementById("fifty").disabled = true;
};

// Ask the Audience: simulates audience poll percentages
document.getElementById("audience").onclick = () => {
  const correct = questions[current].answer;
  const results = questions[current].choices.map((choice, i) => {
    // Give the correct choice a higher random %
    const base = i === correct ? 50 : 10;
    return `${choice}: ${base + Math.floor(Math.random() * 41)}%`;
  });
  statusEl.textContent = "Audience Poll → " + results.join(", ");
  document.getElementById("audience").disabled = true;
};

// Phone a Friend: friend “suggests” the correct answer
document.getElementById("phone").onclick = () => {
  const correctText = questions[current].choices[questions[current].answer];
  statusEl.textContent = `Friend says: "I think it's '${correctText}'."`;
  document.getElementById("phone").disabled = true;
};
