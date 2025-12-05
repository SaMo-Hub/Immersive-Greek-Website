// ===== SYSTÈME DE BLOCAGE DU SCROLL =====

// Variable pour suivre l'état du déblocage
let isScrollUnlocked = true;
let isChapitreNavigation = true; // Flag pour la navigation entre chapitres

// Fonction pour calculer précisément la position de blocage
function calculateBlockPosition() {
  const illustrationList = document.querySelector('.illustration-list');
  const gaiaFrame = document.getElementById('gaia-talk');
  const gaiaInteraction = document.getElementById('gaia-interaction');
  
  if (!illustrationList || !gaiaFrame || !gaiaInteraction) {
    console.error('Éléments requis non trouvés pour le calcul');
    return 0;
  }
  
  // Obtenir les rectangles des éléments
  const illustrationListRect = illustrationList.getBoundingClientRect();
  const gaiaInteractionRect = gaiaInteraction.getBoundingClientRect();
  
  // Calculer la position absolue de l'interaction dans le conteneur
  const interactionAbsoluteLeft = gaiaInteractionRect.left - illustrationListRect.left + illustrationList.scrollLeft;
  
  // Calculer la position pour centrer l'interaction à l'écran
  const centerOffset = (window.innerWidth / 2) - (gaiaInteractionRect.width / 2);
  
  // Position de blocage = position de l'interaction - offset pour la centrer
  const blockPosition = interactionAbsoluteLeft - centerOffset;
  
  console.log('Position de blocage calculée:', blockPosition);
  
  return blockPosition;
}

// Initialiser le système de blocage
function initScrollBlock() {
  const gaiaFrame = document.getElementById('gaia-talk');
  const gaiaInteraction = document.getElementById('gaia-interaction');
  const bulle = document.querySelector('.bulle');
  
  if (!gaiaFrame || !gaiaInteraction || !bulle) {
    console.error('Éléments requis non trouvés');
    return;
  }
  
  // Cacher la bulle initialement
  bulle.style.opacity = '0';
  bulle.style.pointerEvents = 'none';
  
  // Ajouter une classe au body pour indiquer le blocage
  document.body.classList.add('scroll-blocked');
  
  // Calculer la position de blocage précise
  const maxScroll = calculateBlockPosition();
  
  // Intercepter le scroll
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', function(e) {
    // Ne pas bloquer si c'est une navigation entre chapitres
    if (!isScrollUnlocked && !isChapitreNavigation) {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      
      // Si on essaie d'aller au-delà de la limite
      if (currentScroll > maxScroll) {
        window.scrollTo(0, maxScroll);
      }
      
      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }
  }, false);
  
  // Gestion du clic sur l'interaction
  gaiaInteraction.addEventListener('click', function() {
    if (!isScrollUnlocked) {
      // Débloquer le scroll
      isScrollUnlocked = true;
      document.body.classList.remove('scroll-blocked');
      document.body.classList.add('scroll-unlocked');
      
      // Afficher la bulle avec animation
      gsap.to(bulle, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      });
      
      bulle.style.pointerEvents = 'auto';
      
      // Animation de l'icône d'interaction (disparition)
      gsap.to(gaiaInteraction, {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: "back.in(1.7)",
        onComplete: () => {
          gaiaInteraction.style.display = 'none';
        }
      });
      
      // Animation du bouton de fermeture de la modal
      const closeModal = document.querySelector('.close-modal');
      if (closeModal) {
        gsap.to(closeModal, {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          delay: 0.2,
          ease: "back.out(1.7)"
        });
      }
      
      console.log('Scroll débloqué !');
    }
  });
  
  // Ajouter un style visuel au bouton d'interaction
  gaiaInteraction.style.cursor = 'pointer';
  gaiaInteraction.style.transition = 'transform 0.3s ease';
  
  gaiaInteraction.addEventListener('mouseenter', function() {
    if (!isScrollUnlocked) {
      gsap.to(this, {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  });
  
  gaiaInteraction.addEventListener('mouseleave', function() {
    if (!isScrollUnlocked) {
      gsap.to(this, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  });
  
  // ===== GESTION DE LA NAVIGATION ENTRE CHAPITRES =====
  // Intercepter les clics sur les octogones
  const octogones = document.querySelectorAll('.octogone');
  
  octogones.forEach((octogone, index) => {
    octogone.addEventListener('click', function() {
      // Si on change de chapitre et qu'on n'est pas au chapitre 1
      if (index !== 0) {
        // Débloquer temporairement pour la navigation
        isChapitreNavigation = true;
        
        // Débloquer complètement le scroll
        isScrollUnlocked = true;
        document.body.classList.remove('scroll-blocked');
        document.body.classList.add('scroll-unlocked');
        
        // Afficher la bulle
        if (bulle) {
          gsap.to(bulle, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out"
          });
          bulle.style.pointerEvents = 'auto';
        }
        
        // Cacher l'interaction
        if (gaiaInteraction) {
          gsap.to(gaiaInteraction, {
            scale: 0,
            opacity: 0,
            duration: 0.4,
            ease: "back.in(1.7)",
            onComplete: () => {
              gaiaInteraction.style.display = 'none';
            }
          });
        }
        
        console.log('Navigation vers chapitre', index + 1, '- Scroll débloqué');
      }
    });
  });
}

// Attendre que GSAP et le DOM soient prêts
window.addEventListener('load', () => {
  // Petit délai pour s'assurer que tout est initialisé
  setTimeout(() => {
    initScrollBlock();
  }, 500);
});

// ===== STYLES CSS À AJOUTER =====
// Ajout dynamique des styles pour l'indicateur
const style = document.createElement('style');
style.textContent = `
  body.scroll-blocked::after {
    content: "Cliquez sur l'icône pour continuer";
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(235, 115, 51, 0.9);
    color: #140100;
    padding: 12px 24px;
    border-radius: 8px;
    font-family: var(--font-primary);
    font-size: 16px;
    font-weight: bold;
    z-index: 1000;
    animation: pulseIndicator 2s ease-in-out infinite;
    pointer-events: none;
  }
  
  @keyframes pulseIndicator {
    0%, 100% {
      opacity: 1;
      transform: translateX(-50%) scale(1);
    }
    50% {
      opacity: 0.7;
      transform: translateX(-50%) scale(1.05);
    }
  }
  
  body.scroll-unlocked::after {
    display: none;
  }
  
  #gaia-interaction.blocked {
    animation: pulseInteraction 2s ease-in-out infinite;
  }
  
  @keyframes pulseInteraction {
    0%, 100% {
      transform: scale(1);
      filter: drop-shadow(0 0 10px rgba(255, 255, 158, 0.5));
    }
    50% {
      transform: scale(1.1);
      filter: drop-shadow(0 0 20px rgba(255, 255, 158, 0.8));
    }
  }
`;
document.head.appendChild(style);