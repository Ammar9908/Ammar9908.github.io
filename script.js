let wordsList = [];

// Color Palettes for Theme Change
const colorPalettes = [
  {
    bg: "#121212",
    card: "#1e1e1e",
    primary: "#bb86fc",
    text: "#ffffff",
    subtitle: "#b3b3b3",
    hover: "#3700b3",
  },
  {
    bg: "#f0f2f5",
    card: "#ffffff",
    primary: "#009688",
    text: "#333333",
    subtitle: "#666666",
    hover: "#00796b",
  },
];

function changeTheme() {
  const currentTheme = document.documentElement.style
    .getPropertyValue("--bg-color")
    .trim();
  const nextTheme =
    currentTheme === colorPalettes[0].bg ? colorPalettes[1] : colorPalettes[0];
  applyTheme(nextTheme);
  localStorage.setItem("theme", JSON.stringify(nextTheme));
}

function loadSavedTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    const palette = JSON.parse(savedTheme);
    applyTheme(palette);
  }
}

function applyTheme(palette) {
  document.documentElement.style.setProperty("--bg-color", palette.bg);
  document.documentElement.style.setProperty("--card-bg", palette.card);
  document.documentElement.style.setProperty(
    "--primary-color",
    palette.primary
  );
  document.documentElement.style.setProperty("--text-color", palette.text);
  document.documentElement.style.setProperty(
    "--subtitle-color",
    palette.subtitle
  );
  document.documentElement.style.setProperty("--button-hover", palette.hover);
}

async function loadWords() {
  try {
    const response = await fetch("text.txt");
    if (!response.ok) throw new Error("Words file not found");
    const text = await response.text();
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    wordsList = lines.map((line) => {
      const parts = line.split("|");
      return { english: parts[0].trim(), arabic: parts[1].trim() };
    });
    getRandomWord();
  } catch (error) {
    console.error("Error loading words:", error);
    document.getElementById("english-word").textContent = "Error";
    document.getElementById("arabic-meaning").textContent = "خطأ";
  }
}

function getRandomWord() {
  if (wordsList.length === 0) return;
  const randomWord = wordsList[Math.floor(Math.random() * wordsList.length)];
  document.getElementById("english-word").textContent = randomWord.english;
  document.getElementById("arabic-meaning").textContent = randomWord.arabic;
}

function playAudio() {
  const word = document.getElementById("english-word").textContent;
  const msg = new SpeechSynthesisUtterance(word);
  msg.lang = "en-US";
  window.speechSynthesis.speak(msg);
}

window.onload = () => {
  loadSavedTheme();
  loadWords();
};
