// ===== ANIMATION DES SPINS =====
const svgs = document.querySelectorAll('.spin');
let currentIndex = 0;

svgs.forEach((svg, index) => {
  const angle = index * 45; // 0°, 45°, 90°, 135°, etc.
  svg.style.setProperty('--base-rotation', angle + 'deg');
});

function updateOpacities() {
  svgs.forEach((svg, index) => {
    // L'opacité est 1 seulement pour l'élément courant
    if (index === currentIndex) {
      svg.style.opacity = '1';
    } else {
      svg.style.opacity = '0.5';
    }
  });

  currentIndex = (currentIndex + 1) % svgs.length;
}

// Initialisation
updateOpacities();

// Changer toutes les 600ms
setInterval(updateOpacities, 600);

// ===== SYSTÈME AUDIO =====

// Créer l'élément audio
// const backgroundMusic = new Audio('./public/music/NujabesLuv.mp3');
console.log();

backgroundMusic.loop = true; // La musique boucle à l'infini
backgroundMusic.volume = 0; // Commence à 0 pour le fade in

// Sélectionner les éléments
const btn = document.getElementById("toggle-btn");
const iconOn = btn.querySelector(".on");
const iconOff = btn.querySelector(".off");

console.log(btn, iconOn, iconOff);

// État de la musique
let isMusicPlaying = false;
let isAudioReady = false; // Pour savoir si l'utilisateur a déjà interagi

// Fade in/out pour des transitions plus douces
function fadeIn(audio, duration = 1000) {
  const targetVolume = 0.5;
  audio.volume = 0;
  
  return audio.play()
    .then(() => {
      const step = 0.05;
      const time = duration / (targetVolume / step);
      
      const fadeInterval = setInterval(() => {
        if (audio.volume < targetVolume - step) {
          audio.volume = Math.min(audio.volume + step, targetVolume);
        } else {
          audio.volume = targetVolume;
          clearInterval(fadeInterval);
        }
      }, time);
    })
    .catch(error => {
      console.error('Erreur lors de la lecture:', error);
    });
}

function fadeOut(audio, duration = 1000) {
  const step = 0.05;
  const currentVolume = audio.volume;
  const time = duration / (currentVolume / step);
  
  const fadeInterval = setInterval(() => {
    if (audio.volume > step) {
      audio.volume = Math.max(audio.volume - step, 0);
    } else {
      audio.volume = 0;
      audio.pause();
      clearInterval(fadeInterval);
    }
  }, time);
}

// Fonction pour jouer la musique
function playMusic() {
  fadeIn(backgroundMusic)
    .then(() => {
      console.log('Musique lancée');
      isMusicPlaying = true;
      isAudioReady = true;
      iconOn.style.display = "block";
      iconOff.style.display = "none";
    });
}

// Fonction pour mettre en pause la musique
function pauseMusic() {
  fadeOut(backgroundMusic);
  console.log('Musique mise en pause');
  isMusicPlaying = false;
  iconOn.style.display = "none";
  iconOff.style.display = "block";
}

// Toggle au clic sur le bouton
btn.addEventListener("click", () => {
  if (isMusicPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
});

// ===== DÉMARRAGE AU PREMIER CLIC =====
// La musique démarre automatiquement au premier clic n'importe où sur la page
let hasFirstInteraction = false;

document.addEventListener('click', (e) => {
  // Si c'est la première interaction ET que la musique n'est pas déjà en cours
  if (!hasFirstInteraction && !isMusicPlaying) {
    // Si le clic n'est PAS sur le bouton de toggle
    if (!btn.contains(e.target)) {
      playMusic();
    }
    hasFirstInteraction = true;
  }
}, { once: true });

// Initialiser l'icône au chargement (musique éteinte par défaut)
iconOn.style.display = "none";
iconOff.style.display = "block";