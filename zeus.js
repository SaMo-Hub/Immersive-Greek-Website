gsap.registerPlugin(ScrollTrigger);

const list = document.querySelector(".illustration-list");
const totalWidth = list.scrollWidth;

gsap.to(".illustration-list", {
  x: () => -(totalWidth - window.innerWidth),
  ease: "none",
  scrollTrigger: {
    trigger: ".illustration-container", // IMPORTANT
    start: "top top",
    end: () => "+=" + totalWidth,
    scrub: 1,
    pin: true,
    anticipatePin: 1
  }
});
