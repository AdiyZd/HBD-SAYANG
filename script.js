// Masukkan nomor WhatsApp tujuan dengan kode negara, tanpa tanda +, spasi, atau strip.
// Contoh format Indonesia: 6281234567890
const WHATSAPP_NUMBER = "GANTI_DENGAN_NOMOR_WA";

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const backgroundMusic = document.getElementById("backgroundMusic");
const musicControl = document.getElementById("musicControl");
const musicIcon = document.getElementById("musicIcon");
const reactionForm = document.getElementById("reactionForm");
const reactionMessage = document.getElementById("reactionMessage");
const responseStatus = document.getElementById("responseStatus");
let selectedReaction = "";

function updateMusicControl() {
  const isPlaying = !backgroundMusic.paused;
  musicControl.setAttribute("aria-label", isPlaying ? "Jeda musik" : "Putar musik");
  musicControl.setAttribute("aria-pressed", String(isPlaying));
  musicIcon.innerHTML = isPlaying
    ? '<path d="M6 5h4v14H6zm8 0h4v14h-4z" />'
    : '<path d="M8 5v14l11-7z" />';
}

musicControl.addEventListener("click", async () => {
  if (backgroundMusic.paused) {
    try {
      await backgroundMusic.play();
    } catch (error) {
      updateMusicControl();
    }
  } else {
    backgroundMusic.pause();
  }
  updateMusicControl();
});

backgroundMusic.addEventListener("play", updateMusicControl);
backgroundMusic.addEventListener("pause", updateMusicControl);
backgroundMusic.play().catch(updateMusicControl);

document.querySelectorAll(".photo").forEach((photo) => {
  photo.addEventListener("click", () => {
    lightboxImage.src = photo.querySelector("img").src;
    lightboxImage.alt = photo.querySelector("img").alt;
    lightbox.classList.add("open");
  });
});

function closeLightbox() {
  lightbox.classList.remove("open");
  lightboxImage.src = "";
}

document.getElementById("closeLightbox").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

document.querySelectorAll(".reaction-option").forEach((button) => {
  button.addEventListener("click", () => {
    selectedReaction = button.dataset.reaction;
    document.querySelectorAll(".reaction-option").forEach((option) => {
      option.setAttribute("aria-pressed", String(option === button));
    });
    responseStatus.textContent = `Reaksi dipilih: ${selectedReaction}`;
  });
});

reactionForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!/^\d{8,15}$/.test(WHATSAPP_NUMBER)) {
    responseStatus.textContent = "Nomor WhatsApp tujuan belum diatur. Isi WHATSAPP_NUMBER di file script.js terlebih dahulu.";
    return;
  }

  if (!selectedReaction && !reactionMessage.value.trim()) {
    responseStatus.textContent = "Pilih reaksi atau tulis pesan terlebih dahulu ya.";
    return;
  }

  const lines = ["Hai Adi! Aku sudah melihat halaman ulang tahunnya 💗"];
  if (selectedReaction) lines.push(`Reaksiku: ${selectedReaction}`);
  if (reactionMessage.value.trim()) lines.push(`Pesanku: ${reactionMessage.value.trim()}`);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n\n"))}`;
  window.location.href = whatsappUrl;
});

document.body.classList.add("reveal-ready");
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -30px 0px"
  });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
