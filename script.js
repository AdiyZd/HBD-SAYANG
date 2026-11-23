// Gunakan kode negara, tanpa tanda +, spasi, atau strip.
const WHATSAPP_NUMBER = "6288216796297";
const swalReady = () => typeof window.Swal !== "undefined";
const sweetAlertTheme = { confirmButtonColor: "#d86f91", cancelButtonColor: "#8d727d", background: "#fffafd", color: "#38252d" };

function showAlert(options) {
  if (swalReady()) return window.Swal.fire({ ...sweetAlertTheme, ...options });
  window.alert(options.text || options.title || "");
  return Promise.resolve({ isConfirmed: true });
}

const backgroundMusic = document.getElementById("backgroundMusic");
const musicControl = document.getElementById("musicControl");
const musicIcon = document.getElementById("musicIcon");
const intro = document.getElementById("letterIntro");
const openLetterButton = document.getElementById("openLetterButton");
let letterOpened = false;
let selectedReaction = "";

// Letter intro is handled here, together with the rest of the page behavior.
function openBirthdayLetter(event) {
  if (event) event.preventDefault();
  if (!intro || letterOpened) return;
  letterOpened = true;
  intro.classList.add("is-opening");

  // Calling play synchronously in the tap/click handler is required by Android browsers.
  if (backgroundMusic) {
    const playback = backgroundMusic.play();
    if (playback && typeof playback.catch === "function") playback.catch(() => {});
  }

  window.setTimeout(() => {
    intro.classList.add("is-hidden");
    intro.setAttribute("aria-hidden", "true");
    document.body.classList.remove("intro-locked");
  }, 2050);
}

if (openLetterButton) {
  openLetterButton.addEventListener("click", openBirthdayLetter);
  openLetterButton.addEventListener("pointerup", openBirthdayLetter, { passive: false });
}

function updateMusicControl() {
  if (!backgroundMusic || !musicControl || !musicIcon) return;
  const playing = !backgroundMusic.paused;
  musicControl.setAttribute("aria-label", playing ? "Jeda musik" : "Putar musik");
  musicControl.setAttribute("aria-pressed", String(playing));
  musicIcon.innerHTML = playing
    ? '<path d="M6 5h4v14H6zm8 0h4v14h-4z" />'
    : '<path d="M8 5v14l11-7z" />';
}

if (backgroundMusic && musicControl) {
  musicControl.addEventListener("click", async () => {
    if (backgroundMusic.paused) {
      try {
        await backgroundMusic.play();
        updateMusicControl();
      } catch (error) {
        updateMusicControl();
        showAlert({ icon: "error", title: "Musik belum bisa diputar", text: "Coba tekan tombol musik sekali lagi." });
      }
    } else {
      backgroundMusic.pause();
      updateMusicControl();
    }
  });
  backgroundMusic.addEventListener("play", updateMusicControl);
  backgroundMusic.addEventListener("pause", updateMusicControl);
}

// Gallery photo lightbox.
document.querySelectorAll(".photo").forEach((photo) => {
  photo.addEventListener("click", () => {
    const image = photo.querySelector("img");
    if (!image) return;
    if (swalReady()) {
      window.Swal.fire({
        ...sweetAlertTheme,
        imageUrl: image.src,
        imageAlt: image.alt,
        showConfirmButton: false,
        showCloseButton: true,
        backdrop: "rgba(45, 25, 34, 0.88)",
        width: "min(900px, 92vw)",
        padding: "1rem",
        customClass: { popup: "photo-swal-popup" }
      });
      return;
    }
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    if (lightbox && lightboxImage) {
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightbox.classList.add("open");
    }
  });
});

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  const image = document.getElementById("lightboxImage");
  if (lightbox) lightbox.classList.remove("open");
  if (image) image.src = "";
}
document.getElementById("closeLightbox")?.addEventListener("click", closeLightbox);
document.getElementById("lightbox")?.addEventListener("click", (event) => {
  if (event.target === event.currentTarget) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

// Reaction selection and WhatsApp form.
document.querySelectorAll(".reaction-option").forEach((button) => {
  button.addEventListener("click", () => {
    selectedReaction = button.dataset.reaction || "";
    document.querySelectorAll(".reaction-option").forEach((option) => {
      option.setAttribute("aria-pressed", String(option === button));
    });
    const status = document.getElementById("responseStatus");
    if (status) status.textContent = `Reaksi dipilih: ${selectedReaction}`;
    if (swalReady()) {
      window.Swal.fire({ ...sweetAlertTheme, toast: true, position: "top", icon: "success", title: "Reaksi tersimpan", text: selectedReaction, showConfirmButton: false, timer: 1600 });
    }
  });
});

const reactionForm = document.getElementById("reactionForm");
if (reactionForm) {
  reactionForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("responseStatus");
    const message = document.getElementById("reactionMessage");
    const normalizedNumber = WHATSAPP_NUMBER.replace(/\D/g, "");
    if (normalizedNumber.length < 8 || normalizedNumber.length > 15) {
      if (status) status.textContent = "Periksa format nomor WhatsApp di script.js.";
      await showAlert({ icon: "error", title: "Nomor WhatsApp belum valid", text: "Gunakan kode negara dan angka saja." });
      return;
    }
    if (!selectedReaction && !(message?.value || "").trim()) {
      if (status) status.textContent = "Pilih reaksi atau tulis pesan terlebih dahulu ya.";
      await showAlert({ icon: "warning", title: "Pilih reaksi dulu", text: "Pilih salah satu reaksi atau tulis pesan kecil." });
      return;
    }
    const lines = ["Hai Sayang! Aku sudah melihat halaman ulang tahunnya 💗"];
    if (selectedReaction) lines.push(`Reaksiku: ${selectedReaction}`);
    if ((message?.value || "").trim()) lines.push(`Pesanku: ${message.value.trim()}`);
    const result = await showAlert({
      icon: "success", title: "Kirim reaksimu? 💌", text: "Membuka WhatsApp untuk mengirim reaksi.",
      showCancelButton: true, confirmButtonText: "Kirim", cancelButtonText: "Nanti dulu", reverseButtons: true
    });
    if (result.isConfirmed) {
      if (status) status.textContent = "Membuka WhatsApp…";
      window.location.assign(`https://wa.me/${normalizedNumber}?text=${encodeURIComponent(lines.join("\n\n"))}`);
    }
  });
}

// Scroll reveal animations.
document.body.classList.add("reveal-ready");
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle("is-visible", entry.isIntersecting));
  }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
