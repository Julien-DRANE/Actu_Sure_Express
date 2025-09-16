// script.js
document.addEventListener("DOMContentLoaded", () => {
  // ---- Menu mobile ----
  const menuToggle = document.getElementById("menu-toggle");
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      document.getElementById("mobile-menu")?.classList.toggle("hidden");
    });
  }

  // ---- Quiz & Révélation ----
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
    document.querySelectorAll(".chip").forEach(ch => ch.classList.remove("correct", "wrong"));
    document.querySelectorAll(".explain").forEach(ex => (ex.hidden = true));
    document.querySelectorAll(".q-card").forEach(card => { card.dataset.answered = ""; });
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
            card.querySelector(`.chip[data-choice="${ans}"]`)?.classList.add("correct");
          } else {
            score++;
            const scoreEl = document.getElementById("score");
            if (scoreEl) scoreEl.textContent = String(score);
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
  if (quizBtn && quiz) quizBtn.addEventListener("click", () => (quiz.hidden = !quiz.hidden));
  attachQuiz();

  // ---- Notices pédagogiques ----
  const toggleNoticeBtn = document.getElementById("toggleNoticeBtn");
  let noticesVisible = false; // masquées par défaut

  function updateNotices() {
    document.querySelectorAll(".notice").forEach(notice => {
      notice.classList.toggle("hidden", !noticesVisible);
    });
    const revealBtnLocal = document.getElementById("revealBtn");
    if (revealBtnLocal) {
      revealBtnLocal.classList.toggle("hidden", !noticesVisible);
    }
    if (toggleNoticeBtn) {
      toggleNoticeBtn.textContent = noticesVisible ? "Cacher bandeaux" : "Afficher bandeaux";
    }
  }
  updateNotices();
  if (toggleNoticeBtn) {
    toggleNoticeBtn.addEventListener("click", () => {
      noticesVisible = !noticesVisible;
      updateNotices();
    });
  }

  // ---- Popup abonnement factice ----
  const fakePopup = document.getElementById("fakePopup");
  const closePopup = document.getElementById("closePopup");

  // Affiche après 10s si présent sur la page
  setTimeout(() => {
    if (fakePopup) {
      fakePopup.classList.remove("hidden");
    }
  }, 10000);

  if (closePopup) {
    closePopup.addEventListener("click", () => {
      fakePopup.classList.add("hidden");
    });
  }

  const fakeForm = fakePopup ? fakePopup.querySelector("form") : null;
  if (fakeForm) {
    fakeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("⚠️ Attention : ceci est un faux formulaire, ne jamais saisir vos informations réelles en ligne !");
      fakePopup.classList.add("hidden");
    });
  }

  // ---- Rotation PUB (index + articles) ----
  const adImage = document.getElementById("carAdImage");
  const adText  = document.getElementById("carAdText");

  if (adImage && adText) {
    // Détecter si on est dans /articles/ (chemin relatif à ajuster)
    const inArticles = /\/articles\//.test(location.pathname);
    const base = inArticles ? "../assets/images/" : "assets/images/";

    const ads = [
      { img: base + "pub-voiture-electrique.png", text: "NovaCar E-Drive – L’avenir est déjà là ⚡" },
      { img: base + "pub-suv-familial.png",       text: "RoadMaster X – L’espace et la sécurité avant tout 🚙" },
      { img: base + "pub-burger-xxl.png",         text: "MegaBurger XXL – Plus grand, plus juteux 🍔" },
      { img: base + "pub-montre-connectee.png",   text: "TimeX Pro – La montre connectée du futur ⏱️" }
    ];

    let current = Math.floor(Math.random() * ads.length);

    function applyAd(i) {
      adImage.classList.add("fade-out");
      setTimeout(() => {
        adImage.src = ads[i].img;
        adText.textContent = ads[i].text;
        adImage.classList.remove("fade-out");
        adImage.classList.add("fade-in");
        setTimeout(() => adImage.classList.remove("fade-in"), 700);
      }, 300);
    }

    // Affiche la première pub
    adImage.src = ads[current].img;
    adText.textContent = ads[current].text;

    // Change toutes les 10 secondes
    setInterval(() => {
      current = (current + 1) % ads.length;
      applyAd(current);
    }, 10000);
  }

  // ---- Icônes + animations (safe) ----
  if (window.feather) feather.replace();
  if (window.AOS) AOS.init();
});
document.addEventListener("DOMContentLoaded", () => {
  // ... tout ton code existant au-dessus (menu, quiz, pubs, etc.) ...

  // ----- Barre flottante : masquée par défaut + mémoire -----
  (function initEduBar() {
    const eduActions = document.getElementById('eduActions');
    const eduMiniToggle = document.getElementById('eduMiniToggle');
    if (!eduActions || !eduMiniToggle) return; // la page ne contient pas ces éléments

    const EDU_KEY = 'eduActionsVisible';

    function setEduVisible(v) {
      eduActions.classList.toggle('hidden', !v);
      // assure un z-index au-dessus du header
      eduActions.classList.add('z-50');
      try { localStorage.setItem(EDU_KEY, v ? '1' : '0'); } catch {}
    }

    // Au chargement : masqué par défaut, sauf si l'utilisateur l'avait ouverte
    const saved = (typeof localStorage !== 'undefined') ? localStorage.getItem(EDU_KEY) : null;
    setEduVisible(saved === '1');

    // Toggle sur le bouton "?"
    eduMiniToggle.addEventListener('click', () => {
      const willShow = eduActions.classList.contains('hidden');
      setEduVisible(willShow);
    });
  })();
});


// À l’ouverture : si pas de préférence -> masqué (false)
const saved = (typeof localStorage !== 'undefined') ? localStorage.getItem(EDU_KEY) : null;
setEduVisible(saved === '1');  // true si l'utilisateur l'avait ouverte, sinon hidden

eduMiniToggle?.addEventListener('click', () => {
  const nowHidden = eduActions.classList.contains('hidden');
  setEduVisible(nowHidden); // si c’est caché, on l’affiche, sinon on recache
});
