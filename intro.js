const intro = document.getElementById("letterIntro");
const openButton = document.getElementById("openLetterButton");
const backgroundMusic = document.getElementById("backgroundMusic");

function openLetter() {
  if (!intro || intro.classList.contains("is-opening")) return;

  if (openButton) openButton.disabled = true;
  intro.classList.add("is-opening");

  if (backgroundMusic) {
    backgroundMusic.play().catch(() => {});
  }

  window.setTimeout(() => {
    intro.classList.add("is-hidden");
    document.body.classList.remove("intro-locked");
    intro.setAttribute("aria-hidden", "true");
    if (openButton) openButton.blur();
  }, 2050);
}

if (openButton) {
  openButton.addEventListener("click", openLetter);
}

// Fallback for browsers whose DOMEvent script loading was blocked.
window.openBirthdayLetter = openLetter;
