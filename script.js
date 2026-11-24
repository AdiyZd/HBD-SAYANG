const WHATSAPP_NUMBER = "6288216796297";
const swalReady = () => typeof window.Swal !== "undefined";
const sweetAlertTheme = { confirmButtonColor: "#d86f91", cancelButtonColor: "#8d727d", background: "#fffafd", color: "#38252d" };

function showAlert(options) {
  if (swalReady()) return window.Swal.fire({ ...sweetAlertTheme, ...options });
  window.alert(options.text || options.title || "");
  return Promise.resolve({ isConfirmed: true });
}

const intro = document.getElementById("letterIntro");
const openLetterButton = document.getElementById("openLetterButton");
const backgroundMusic = document.getElementById("backgroundMusic");
const musicControl = document.getElementById("musicControl");
const musicIcon = document.getElementById("musicIcon");
let letterOpened = false;
let selectedReaction = "";

function openBirthdayLetter(event) {
  if (event) event.preventDefault();
  if (!intro || letterOpened) return;
  letterOpened = true;
  openLetterButton?.setAttribute("disabled", "true");

  // Pastikan posisi halaman selalu di atas saat kartu ucapan dibuka.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });

  intro.classList.add("is-opening");
  if (backgroundMusic) {
    const playback = backgroundMusic.play();
    if (playback && typeof playback.catch === "function") playback.catch(() => {});
  }
  window.setTimeout(() => {
    intro.classList.add("is-hidden");
    intro.setAttribute("aria-hidden", "true");
    document.body.classList.remove("intro-locked");
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, 2300);
}

openLetterButton?.addEventListener("pointerup", openBirthdayLetter, { passive: false });
openLetterButton?.addEventListener("click", openBirthdayLetter);

// Jaga agar reload dan kembali ke halaman ini selalu dimulai dari bagian atas.
window.addEventListener("pageshow", () => {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
});

function updateMusicControl() {
  if (!backgroundMusic || !musicControl || !musicIcon) return;
  const playing = !backgroundMusic.paused;
  musicControl.setAttribute("aria-label", playing ? "Jeda musik" : "Putar musik");
  musicControl.setAttribute("aria-pressed", String(playing));
  musicIcon.innerHTML = playing ? '<path d="M6 5h4v14H6zm8 0h4v14h-4z" />' : '<path d="M8 5v14l11-7z" />';
}

musicControl?.addEventListener("click", async () => {
  if (!backgroundMusic) return;
  if (backgroundMusic.paused) {
    try { await backgroundMusic.play(); updateMusicControl(); }
    catch (error) { updateMusicControl(); showAlert({ icon:"error", title:"Musik belum bisa diputar", text:"Coba tekan tombol musik sekali lagi." }); }
  } else {
    backgroundMusic.pause(); updateMusicControl();
  }
});
backgroundMusic?.addEventListener("play", updateMusicControl);
backgroundMusic?.addEventListener("pause", updateMusicControl);

const reactionForm = document.getElementById("reactionForm");
const reactionMessage = document.getElementById("reactionMessage");
const responseStatus = document.getElementById("responseStatus");

document.querySelectorAll(".photo").forEach((photo) => {
  photo.addEventListener("click", () => {
    const image = photo.querySelector("img");
    if (!image) return;
    if (swalReady()) window.Swal.fire({ ...sweetAlertTheme, imageUrl:image.src, imageAlt:image.alt, showConfirmButton:false, showCloseButton:true, backdrop:"rgba(45,25,34,.88)", width:"min(900px,92vw)", padding:"1rem", customClass:{popup:"photo-swal-popup"} });
  });
});

document.querySelectorAll(".reaction-option").forEach((button) => {
  button.addEventListener("click", () => {
    selectedReaction = button.dataset.reaction || "";
    document.querySelectorAll(".reaction-option").forEach((option) => option.setAttribute("aria-pressed", String(option === button)));
    if (responseStatus) responseStatus.textContent = `Reaksi dipilih: ${selectedReaction}`;
  });
});

reactionForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = reactionMessage?.value?.trim() || "";
  if (!selectedReaction && !text) {
    if (responseStatus) responseStatus.textContent = "Pilih reaksi atau tulis pesan terlebih dahulu ya.";
    await showAlert({ icon:"warning", title:"Pilih reaksi dulu", text:"Pilih salah satu reaksi atau tulis pesan kecil." });
    return;
  }
  const lines = ["Hai Sayang! Aku sudah melihat halaman ulang tahunnya 💗"];
  if (selectedReaction) lines.push(`Reaksiku: ${selectedReaction}`);
  if (text) lines.push(`Pesanku: ${text}`);
  const result = await showAlert({ icon:"success", title:"Kirim reaksimu? 💌", text:"Membuka WhatsApp untuk mengirim reaksi.", showCancelButton:true, confirmButtonText:"Kirim", cancelButtonText:"Nanti saja" });
  if (result.isConfirmed) window.location.assign(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n\n"))}`);
});

document.body.classList.add("reveal-ready");
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.target.classList.toggle("is-visible", entry.isIntersecting)), { threshold:.12, rootMargin:"0px 0px -30px 0px" });
  revealItems.forEach((item) => observer.observe(item));
} else revealItems.forEach((item) => item.classList.add("is-visible"));
