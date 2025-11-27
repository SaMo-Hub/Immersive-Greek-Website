// Configuration du scroll horizontal avec GSAP
gsap.registerPlugin(ScrollTrigger);

// Sélectionner le conteneur des illustrations
const illustrationList = document.querySelector('.illustration-list');
const sections = gsap.utils.toArray('.illustration-list > *');
const chapitreFrames = gsap.utils.toArray('.chapitre-frame');

console.log('Sections:', sections);
console.log('Chapitre frames:', chapitreFrames);

// Calculer la largeur totale à scroller
const getScrollAmount = () => {
  return illustrationList.scrollWidth - window.innerWidth;
};

const SCROLL_SPEED = 2; // 1 = normal, 2 = 2x plus lent, 3 = lent, etc.

const setBodyHeight = () => {
  document.body.style.height = `${(getScrollAmount() * SCROLL_SPEED) + window.innerHeight}px`;
};

// Initialiser la hauteur
setBodyHeight();

// Créer un wrapper pour le scroll horizontal
gsap.to(illustrationList, {
  x: () => -getScrollAmount(),
  ease: "none",
  scrollTrigger: {
    trigger: "body",
    start: "top top",
end: () => "+=" + (getScrollAmount() * SCROLL_SPEED),
    scrub: 1,
    pin: ".illustration-list",
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onRefresh: setBodyHeight
  }
});

// Animation du méandre (défilement parallaxe)
gsap.to('.meandre', {
  x: () => -illustrationList.scrollWidth * 0.5,
  ease: "none",
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: () => "+=" + (illustrationList.scrollWidth - window.innerWidth),
    scrub: 0.5
  }
});

// Animation parallax des textes
gsap.utils.toArray('.frame-texte').forEach((texte, index) => {
  gsap.to(texte, {
    x: () => {
      // Calculer la position de base de ce texte
      let basePosition = 0;
      for (let i = 0; i < sections.length; i++) {
        if (sections[i] === texte) break;
        basePosition += sections[i].offsetWidth;
      }
      // Le texte bouge moins vite (70% de la vitesse normale) = effet parallax
      return -(basePosition * 0.1);
    },
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: () => "+=" + getScrollAmount(),
      scrub: 1
    }
  });
});



