// Animation d'entrée avec GSAP
document.addEventListener('DOMContentLoaded', () => {
  
  // Créer un SVG pour animer le contour de la window
  
  
  // Timeline GSAP
  const tl = gsap.timeline({ 
    defaults: { ease: "power3.out" }
  });
  
  // 1. Initialiser le contour à 0
 
  // Cacher tous les éléments au début
  gsap.set("h1", { opacity: 0, y: 300 });
  gsap.set(".secondary-button", { opacity: 0 });
//   gsap.set(".button", { scale: 0.3, opacity: 0, rotation: -10 });
  
  // 2. Animer le contour de 0 à 100%
  
  // 3. Animer le titre (commence avant la fin du contour)
  tl.to("h1", {
    opacity: 1,
    y: 0,
    duration: 0.8
  }, );
  
//   4. Animer les boutons de langue avec un effet échelonné
  tl.to(".secondary-button", {
     scale: 1,
    opacity: 1,
    duration: 0.4,
    ease: "back.out(1.7)",
    stagger: 0.1,
    onComplete: () => gsap.set(".secondary-button", { clearProps: "transform" })  

  }, "-=0.4");
  
  // 5. Animer la navigation latérale
tl.fromTo(
  ".button-primary",
  { scale: 0, opacity: 1, },        // fromVars
  { 
    scale: 1,
    opacity: 1,
    duration: 0.4,
    ease: "back.out(1.7)",
    stagger: 0.1,
    onComplete: () => gsap.set(".button", { clearProps: "transform" }) 
  },
  "-=0.2"
);
tl.fromTo(
  ".button",
  { scale: 0, opacity: 1, },        // fromVars
  { 
    scale: 1,
    opacity: 1,
    duration: 0.4,
    ease: "back.out(1.7)",
    stagger: 0.1,
    onComplete: () => gsap.set(".button", { clearProps: "transform" }) 
  },
  "-=0.2"
);
});