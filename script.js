// Gunakan kode negara, tanpa tanda +, spasi, atau strip (contoh: 6281234567890).
const WHATSAPP_NUMBER = "6288216796297";

const swalReady = () => typeof window.Swal !== "undefined";
const sweetAlertTheme = {
  confirmButtonColor: "#d86f91",
  cancelButtonColor: "#8d727d",
  background: "#fffafd",
  color: "#38252d"
};

function showAlert(options) {
  if (swalReady()) return window.Swal.fire({ ...sweetAlertTheme, ...options });
  window.alert(options.text || options.title || "");
  return Promise.resolve({ isConfirmed: true });
}

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
      updateMusicControl();
      if (swalReady()) {
        window.Swal.fire({ ...sweetAlertTheme, toast: true, position: "top", icon: "success", title: "Musik diputar", showConfirmButton: false, timer: 1400, timerProgressBar: true });
      }
    } catch (error) {
      updateMusicControl();
      showAlert({ icon: "error", title: "Musik belum bisa diputar", text: "Coba tekan tombol musik sekali lagi." });
    }
  } else {
    backgroundMusic.pause();
    updateMusicControl();
    if (swalReady()) {
      window.Swal.fire({ ...sweetAlertTheme, toast: true, position: "top", icon: "info", title: "Musik dijeda", showConfirmButton: false, timer: 1200, timerProgressBar: true });
    }
  }
});

backgroundMusic.addEventListener("play", updateMusicControl);
backgroundMusic.addEventListener("pause", updateMusicControl);
backgroundMusic.play().catch(updateMusicControl);

document.querySelectorAll(".photo").forEach((photo) => {
  photo.addEventListener("click", () => {
    const image = photo.querySelector("img");
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
    } else {
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightbox.classList.add("open");
    }
  });
});

function closeLightbox() {
  lightbox.classList.remove("open");
  lightboxImage.src = "";
}

document.getElementById("closeLightbox")?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
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
    if (swalReady()) {
      window.Swal.fire({ ...sweetAlertTheme, toast: true, position: "top", icon: "success", title: "Reaksi tersimpan", text: selectedReaction, showConfirmButton: false, timer: 1600, timerProgressBar: true });
    }
  });
});

reactionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // wa.me hanya menerima digit: kode negara dan nomor, tanpa +, spasi, atau tanda baca.
  const normalizedNumber = WHATSAPP_NUMBER.replace(/\D/g, "");
  if (normalizedNumber.length < 8 || normalizedNumber.length > 15) {
    responseStatus.textContent = "Periksa format nomor WhatsApp di script.js (gunakan kode negara, tanpa tanda +).";
    await showAlert({ icon: "error", title: "Nomor WhatsApp belum valid", text: "Gunakan kode negara dan angka saja, tanpa tanda +, spasi, atau strip." });
    return;
  }

  if (!selectedReaction && !reactionMessage.value.trim()) {
    responseStatus.textContent = "Pilih reaksi atau tulis pesan terlebih dahulu ya.";
    await showAlert({ icon: "warning", title: "Pilih reaksi dulu", text: "Pilih salah satu reaksi atau tulis pesan kecil untuk Adi." });
    return;
  }

  const lines = ["Hai Sayang! Aku sudah melihat halaman ulang tahunnya 💗"];
  if (selectedReaction) lines.push(`Reaksiku: ${selectedReaction}`);
  if (reactionMessage.value.trim()) lines.push(`Pesanku: ${reactionMessage.value.trim()}`);

  const whatsappUrl = `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(lines.join("\n\n"))}`;
  responseStatus.textContent = "Konfirmasi untuk membuka WhatsApp.";

  const result = await showAlert({
    icon: "success",
    title: "Kirim reaksimu? 💌",
    text: "Membuka whatsapp untuk mengirim reaksi.",
    showCancelButton: true,
    confirmButtonText: "Kirim",
    cancelButtonText: "Nanti dulu",
    reverseButtons: true
  });

  if (result.isConfirmed) {
    responseStatus.textContent = "Membuka WhatsApp…";
    window.location.assign(whatsappUrl);
  }
});

document.body.classList.add("reveal-ready");
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
