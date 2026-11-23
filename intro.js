const intro = document.getElementById("letterIntro");
const openButton = document.getElementById("openLetterButton");

if (intro && openButton) {
  openButton.addEventListener("click", () => {
    if (intro.classList.contains("is-opening")) return;

    openButton.disabled = true;
    intro.classList.add("is-opening");

    window.setTimeout(() => {
      intro.classList.add("is-hidden");
      document.body.classList.remove("intro-locked");
      intro.setAttribute("aria-hidden", "true");
      openButton.blur();
    }, 2050);
  });
}
