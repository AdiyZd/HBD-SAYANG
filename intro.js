const intro = document.getElementById("letterIntro");
const openButton = document.getElementById("openLetterButton");
const backgroundMusic = document.getElementById("backgroundMusic");
let introStarted = false;

function openLetter() {
  if (!intro || introStarted) return;
  introStarted = true;
  intro.classList.add("is-opening");

  if (backgroundMusic) {
    const playResult = backgroundMusic.play();
    if (playResult && typeof playResult.catch === "function") playResult.catch(() => {});
  }

  window.setTimeout(() => {
    intro.classList.add("is-hidden");
    document.body.classList.remove("intro-locked");
    intro.setAttribute("aria-hidden", "true");
  }, 2050);
}

window.openBirthdayLetter = openLetter;

if (openButton) {
  openButton.addEventListener("pointerup", openLetter, { passive: true });
  openButton.addEventListener("click", openLetter);
}
