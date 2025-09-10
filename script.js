// --- Quiz & Révélation ---
const revealBtn = document.getElementById("revealBtn");
const resetBtn = document.getElementById("resetBtn");
const quizBtn = document.getElementById("quizBtn");
const quiz = document.getElementById("quiz");
let revealed = false;
let score = 0;

function setReveal(on) {
  revealed = on;
  document.body.classList.toggle("reveal", revealed);
  if (revealBtn) {
    revealBtn.textContent = revealed ? "Masquer les indices" : "Révéler les indices 🔎";
  }
}

function resetAll() {
  setReveal(false);
  score = 0;
  const scoreEl = document.getElementById("score");
  if (scoreEl) scoreEl.textContent = "0";
  if (quiz) quiz.hidden = true;
  document.querySelectorAll(".chip").forEach(ch => {
    ch.classList.remove("correct", "wrong");
  });
  document.querySelectorAll(".explain").forEach(ex => (ex.hidden = true));
  document.querySelectorAll(".q-card").forEach(card => {
    card.dataset.answered = "";
  });
}

function attachQuiz() {
  document.querySelectorAll(".q-card").forEach(card => {
    const ans = card.dataset.answer;
    card.querySelectorAll(".chip").forEach(chip => {
      chip.addEventListener("click", () => {
        if (card.dataset.answered) return;
        const choice = chip.dataset.choice;
        const correct = choice === ans;
        chip.classList.add(correct ? "correct" : "wrong");
        if (!correct) {
          card.querySelector(`.chip[data-choice="${ans}"]`).classList.add("correct");
        } else {
          score++;
          document.getElementById("score").textContent = score;
        }
        card.dataset.answered = "1";
        card.querySelector(".explain").hidden = false;
      });
    });
  });

  const retryBtn = document.getElementById("retryQuiz");
  if (retryBtn) retryBtn.addEventListener("click", () => resetAll());
}

if (revealBtn) revealBtn.addEventListener("click", () => setReveal(!revealed));
if (resetBtn) resetBtn.addEventListener("click", resetAll);
if (quizBtn) quizBtn.addEventListener("click", () => (quiz.hidden = !quiz.hidden));

attachQuiz();


// --- Pub voiture dynamique avec fondu ---
const carAds = [
  {
    img: "assets/images/pub-voiture-electrique.png",
    text: "NovaCar E-Drive – L’avenir est déjà là ⚡"
  },
  {
    img: "assets/images/pub-suv-familial.png",
    text: "RoadMaster X – L’espace et la sécurité avant tout 🚙"
  }
];

let carAdIndex = 0;
function rotateCarAd() {
  const carAdImage = document.getElementById("carAdImage");
  const carAdText = document.getElementById("carAdText");

  if (!carAdImage || !carAdText) return; // sécurité si pas de pub sur la page

  // lancer le fondu sortant
  carAdImage.classList.add("fade-out");

  setTimeout(() => {
    // changer l’image et le texte après le fondu
    carAdIndex = (carAdIndex + 1) % carAds.length;
    carAdImage.src = carAds[carAdIndex].img;
    carAdText.textContent = carAds[carAdIndex].text;

    // remettre l’opacité à 1 avec fondu entrant
    carAdImage.classList.remove("fade-out");
    carAdImage.classList.add("fade-in");

    // nettoyer la classe fade-in après l’animation (1s = durée CSS)
    setTimeout(() => carAdImage.classList.remove("fade-in"), 1000);
  }, 1000); // durée du fondu sortant
}

setInterval(rotateCarAd, 5000); // pub change toutes les 5s


// --- Toggle notices & bouton indices ---
const toggleNoticeBtn = document.getElementById("toggleNoticeBtn");
let noticesVisible = false; // masqués par défaut

function updateNotices() {
  document.querySelectorAll(".notice").forEach(notice => {
    notice.classList.toggle("hidden", !noticesVisible);
  });

  // masquer aussi le bouton "Révéler les indices" si les notices sont cachées
  const revealBtn = document.getElementById("revealBtn");
  if (revealBtn) {
    revealBtn.classList.toggle("hidden", !noticesVisible);
  }

  if (toggleNoticeBtn) {
    toggleNoticeBtn.textContent = noticesVisible 
      ? "Cacher bandeaux" 
      : "Afficher bandeaux";
  }
}

// appliquer à l’ouverture
updateNotices();

if (toggleNoticeBtn) {
  toggleNoticeBtn.addEventListener("click", () => {
    noticesVisible = !noticesVisible;
    updateNotices();
  });
}

// --- Popup abonnement factice ---
const fakePopup = document.getElementById("fakePopup");
const closePopup = document.getElementById("closePopup");

// Afficher le popup automatiquement après 10s
setTimeout(() => {
  if (fakePopup) fakePopup.classList.remove("hidden");
}, 10000);

// Bouton fermer
if (closePopup) {
  closePopup.addEventListener("click", () => {
    fakePopup.classList.add("hidden");
  });
}

// Bloquer l’envoi du formulaire (ne rien stocker)
const fakeForm = fakePopup ? fakePopup.querySelector("form") : null;
if (fakeForm) {
  fakeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("⚠️ Attention : ceci est un faux formulaire, ne jamais saisir vos informations réelles en ligne !");
    fakePopup.classList.add("hidden");
  });
}
