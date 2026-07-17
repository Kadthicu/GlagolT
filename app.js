const questions = [
  {
    tense: "Present Simple",
    text: "She ___ coffee every morning.",
    options: ["drink", "drinks", "is drinking", "drank"],
    answer: 1,
    explanation: "Регулярное действие: с she в Present Simple добавляем -s — drinks."
  },
  {
    tense: "Present Continuous",
    text: "Look! The children ___ in the garden.",
    options: ["play", "played", "are playing", "have played"],
    answer: 2,
    explanation: "Действие происходит прямо сейчас: are + playing."
  },
  {
    tense: "Past Simple",
    text: "We ___ that film yesterday.",
    options: ["see", "saw", "have seen", "are seeing"],
    answer: 1,
    explanation: "Yesterday указывает на Past Simple; прошедшая форма see — saw."
  },
  {
    tense: "Future Simple",
    text: "I think it ___ tomorrow.",
    options: ["rains", "rained", "will rain", "is rain"],
    answer: 2,
    explanation: "Предположение о будущем: will + начальная форма глагола."
  },
  {
    tense: "Present Perfect",
    text: "He ___ his homework already.",
    options: ["finished", "has finished", "is finishing", "finish"],
    answer: 1,
    explanation: "Already и результат к настоящему моменту: has + finished."
  },
  {
    tense: "Past Continuous",
    text: "At 8 p.m. last night, I ___ a book.",
    options: ["read", "was reading", "have read", "will read"],
    answer: 1,
    explanation: "Действие шло в конкретный момент прошлого: was + reading."
  },
  {
    tense: "Past Perfect",
    text: "The train ___ before we arrived.",
    options: ["left", "has left", "had left", "was leaving"],
    answer: 2,
    explanation: "Поезд ушёл раньше другого события в прошлом: had + left."
  },
  {
    tense: "Present Perfect Continuous",
    text: "They ___ for two hours.",
    options: ["study", "studied", "have been studying", "are studied"],
    answer: 2,
    explanation: "Действие началось раньше и всё ещё длится: have been + studying."
  },
  {
    tense: "Future Continuous",
    text: "This time tomorrow, we ___ to Paris.",
    options: ["fly", "will be flying", "have flown", "flew"],
    answer: 1,
    explanation: "Процесс в определённый момент будущего: will be + flying."
  },
  {
    tense: "Выбери по смыслу",
    text: "I ___ her since 2020.",
    options: ["know", "knew", "have known", "am knowing"],
    answer: 2,
    explanation: "Состояние началось в прошлом и продолжается сейчас: have known."
  }
];

const screens = {
  start: document.querySelector("#start-screen"),
  question: document.querySelector("#question-screen"),
  result: document.querySelector("#result-screen")
};

const counter = document.querySelector("#question-counter");
const scoreText = document.querySelector("#score");
const progressBar = document.querySelector("#progress-bar");
const tenseLabel = document.querySelector("#tense-label");
const questionText = document.querySelector("#question-text");
const answers = document.querySelector("#answers");
const feedback = document.querySelector("#feedback");
const nextButton = document.querySelector("#next-button");

let currentQuestion = 0;
let score = 0;
let locked = false;

function showScreen(name) {
  Object.entries(screens).forEach(([key, screen]) => {
    screen.classList.toggle("hidden", key !== name);
  });
}

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  showScreen("question");
  renderQuestion();
}

function renderQuestion() {
  locked = false;
  const question = questions[currentQuestion];

  counter.textContent = `Вопрос ${currentQuestion + 1} из ${questions.length}`;
  scoreText.textContent = `Счёт: ${score}`;
  progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  tenseLabel.textContent = question.tense;
  questionText.textContent = question.text;
  answers.innerHTML = "";
  feedback.className = "feedback hidden";
  nextButton.classList.add("hidden");

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.textContent = option;
    button.addEventListener("click", () => chooseAnswer(index));
    answers.appendChild(button);
  });
}

function chooseAnswer(selectedIndex) {
  if (locked) return;
  locked = true;

  const question = questions[currentQuestion];
  const buttons = [...answers.querySelectorAll(".answer-button")];
  const isCorrect = selectedIndex === question.answer;

  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === question.answer) button.classList.add("correct");
    if (index === selectedIndex && !isCorrect) button.classList.add("wrong");
  });

  if (isCorrect) score += 1;
  scoreText.textContent = `Счёт: ${score}`;
  feedback.textContent = `${isCorrect ? "Верно! " : "Почти! "}${question.explanation}`;
  feedback.className = `feedback ${isCorrect ? "correct" : "wrong"}`;
  nextButton.textContent = currentQuestion === questions.length - 1 ? "Узнать результат" : "Следующий вопрос";
  nextButton.classList.remove("hidden");
}

function nextQuestion() {
  currentQuestion += 1;
  if (currentQuestion < questions.length) {
    renderQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  const percent = Math.round((score / questions.length) * 100);
  document.querySelector("#result-score").textContent = `${score} / ${questions.length}`;

  let title = "Хорошее начало!";
  let message = "Повтори правила и попробуй ещё раз — новый результат будет лучше.";
  let icon = "🌱";

  if (percent >= 80) {
    title = "Отличный результат!";
    message = "Ты уверенно различаешь английские времена.";
    icon = "🏆";
  } else if (percent >= 50) {
    title = "Уже неплохо!";
    message = "Основы есть. Ещё немного практики — и времена покорятся.";
    icon = "✨";
  }

  document.querySelector("#result-title").textContent = title;
  document.querySelector("#result-message").textContent = message;
  document.querySelector("#result-icon").textContent = icon;
  showScreen("result");
}

document.querySelector("#start-button").addEventListener("click", startQuiz);
document.querySelector("#restart-button").addEventListener("click", startQuiz);
nextButton.addEventListener("click", nextQuestion);
