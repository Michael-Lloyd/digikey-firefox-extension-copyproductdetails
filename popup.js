const modeButtons = {
  json: document.getElementById("jsonBtn"),
  csv: document.getElementById("csvBtn"),
  mathematica: document.getElementById("mathematicaBtn"),
  html: document.getElementById("htmlBtn")
};

const modeCircles = {
  json: document.getElementById("jsonCircle"),
  csv: document.getElementById("csvCircle"),
  mathematica: document.getElementById("mathematicaCircle"),
  html: document.getElementById("htmlCircle")
};

function updateCircles(selectedMode) {
  for (const mode in modeCircles) {
    modeCircles[mode].style.backgroundColor = mode === selectedMode ? "green" : "grey";
  }
}

function setMode(mode) {
localStorage.setItem({ selectedMode: mode });
  updateCircles(mode);
}

// Set initial mode and update circles
localStorage.getItem("selectedMode")
  .then(({ selectedMode }) => {
    if (!selectedMode) {
      selectedMode = "json";
      browser.storage.local.set({ selectedMode });
    }
    updateCircles(selectedMode);
  });

// Add event listeners to buttons
for (const mode in modeButtons) {
  modeButtons[mode].addEventListener("click", () => setMode(mode));
}
