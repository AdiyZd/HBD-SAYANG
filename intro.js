const intro = document.getElementById("letterIntro");
const openButton = document.getElementById("openLetterButton");
const backgroundMusic = document.getElementById("backgroundMusic");

if (intro && openButton) {
  openButton.addEventListener("click", () => {
    if (intro.classList.contains("is-opening")) return;

    openButton.disabled = true;
    intro.classList.add("is-opening");

    // Start audio from the user's click so mobile browsers allow playback.
    backgroundMusic?.play().catch(() => {
      // Playback can still be started with the visible music control if blocked.
    });

    window.setTimeout(() => {
      intro.classList.add("is-hidden");
      document.body.classList.remove("intro-locked");
      intro.setAttribute("aria-hidden", "true");
      openButton.blur();
    }, 2050);
  });
}
