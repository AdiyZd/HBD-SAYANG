const intro = document.getElementById("letterIntro");
const openButton = document.getElementById("openLetterButton");
const backgroundMusic = document.getElementById("backgroundMusic");
let introStarted = false;

function openLetter() {
  if (!intro || introStarted) return;
  introStarted = true;
  intro.classList.add("is-opening");

  // Playback is initiated directly from the user's tap for Android browser policy.
  if (backgroundMusic) {
    const playResult = backgroundMusic.play();
    if (playResult && typeof playResult.catch === "function") {
      playResult.catch(() => {
        // If playback is blocked, the persistent music button remains available.
      });
    }
  }

  window.setTimeout(() => {
    intro.classList.add("is-hidden");
    document.body.classList.remove("intro-locked");
    intro.setAttribute("aria-hidden", "true");
  }, 2050);
}

if (openButton) {
  openButton.addEventListener("click", openLetter);
}
