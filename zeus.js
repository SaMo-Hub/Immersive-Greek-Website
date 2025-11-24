/* GSAP horizontal illustration scroller + text parallax
   - pin each `.illustration-container` while scrolling horizontally through its `.illustration` children
   - images move faster; text elements move slower for parallax
*/
console.log("lsdikjfsl");

if (typeof gsap !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  const init = () => {
    // clean previously created ScrollTriggers when re-initializing
    ScrollTrigger.getAll().forEach(st => st.kill());

    document.querySelectorAll('.illustration-container').forEach(container => {
      const scroller = container.querySelector('.illustration');
      if (!scroller) return;

      // total horizontal distance to scroll the illustrations
      const totalScroll = Math.max(0, scroller.scrollWidth - window.innerWidth + 100);

      // main horizontal animation for illustrations (faster)
      gsap.to(scroller, {
        x: () => -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => '+=' + (totalScroll + window.innerHeight),
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
        }
      });

      // parallax: text inside the same window moves slower (smaller offset)
      const parentWindow = container.closest('.window');
      if (parentWindow) {
        const slowElems = parentWindow.querySelectorAll('.explication, .chapitre-name, .nav-chapitre, .chapitre, p');
        // move text a fraction of the illustrations' distance (slower)
        const slowDist = Math.round(totalScroll * 0.22);

        slowElems.forEach(el => {
          gsap.to(el, {
            x: () => -slowDist,
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: 'top top',
              end: () => '+=' + (totalScroll + window.innerHeight),
              scrub: 0.8,
            }
          });
        });
      }
    });

    // refresh ScrollTrigger after layout changes
    ScrollTrigger.refresh();
  };

  // init on load
  window.addEventListener('load', init);
  // re-init on resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => init(), 150);
  });

} else {
  // GSAP not loaded — silently fail but log for debugging
  console.warn('GSAP not found. Horizontal scroller not initialized.');
}
