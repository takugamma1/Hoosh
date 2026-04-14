/* ═══════════════════════════════════════
   HOOSH — Scroll Reveal Animations
   Uses IntersectionObserver for fade-ups
═══════════════════════════════════════ */
(function () {
  const els = document.querySelectorAll('.h-reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(function (el) { observer.observe(el); });
})();
