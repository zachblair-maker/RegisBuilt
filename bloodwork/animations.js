/* ===== BloodCheck — GSAP animation layer =====
   Progressive enhancement: if GSAP fails to load (offline, blocked CDN) or the
   user prefers reduced motion, BCAnim becomes a set of no-ops and all content
   stays fully visible. Nothing here is required for the tool to function.
*/
(function () {
  "use strict";

  const reduce =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gsap = window.gsap;

  // Fallback: no GSAP or reduced motion -> no-op API, content untouched.
  if (!gsap || reduce) {
    window.BCAnim = { reveal() {}, analysis() {} };
    return;
  }

  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  /* ---------- Hero entrance ---------- */
  const heroItems = gsap.utils.toArray('[data-anim="hero"]');
  const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });
  tl.from(heroItems, { y: 26, opacity: 0, stagger: 0.1 }, 0.1);
  const vial = document.querySelector('[data-anim="vial"]');
  if (vial) tl.from(vial, { y: 30, opacity: 0, scale: 0.94, duration: 1 }, 0.25);
  const chips = gsap.utils.toArray(".hero__chips .chip");
  if (chips.length) tl.from(chips, { y: 14, opacity: 0, stagger: 0.08, duration: 0.5 }, 0.6);

  /* ---------- Section reveals on scroll ---------- */
  if (window.ScrollTrigger) {
    gsap.utils.toArray("[data-reveal]").forEach((sec) => {
      const parts = sec.querySelectorAll(":scope > .step__head, :scope > *:not(.step__head)");
      gsap.from(parts, {
        y: 34,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: { trigger: sec, start: "top 82%", once: true },
      });
    });
  }

  /* ---------- Public hooks ---------- */
  function reveal(selector) {
    const els = gsap.utils.toArray(selector);
    if (!els.length) return;
    gsap.from(els, {
      y: 18,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      stagger: 0.04,
      overwrite: true,
    });
  }

  function analysis() {
    // count-up the summary stats
    gsap.utils.toArray(".summary__stat b").forEach((el) => {
      const target = parseFloat(el.textContent) || 0;
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target,
        duration: 0.9,
        ease: "power2.out",
        onUpdate: () => (el.textContent = Math.round(obj.v)),
      });
    });
    // reveal analysis cards
    const cards = gsap.utils.toArray("#analysisOutput .acard");
    gsap.from(cards, {
      y: 26,
      opacity: 0,
      duration: 0.55,
      ease: "power2.out",
      stagger: 0.07,
      overwrite: true,
    });
    // animate range meters filling + marker dropping in
    gsap.fromTo(
      "#analysisOutput .meter__range",
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 0.8, ease: "power2.out", delay: 0.2, stagger: 0.07 }
    );
    gsap.from("#analysisOutput .meter__mark", {
      opacity: 0,
      y: -6,
      duration: 0.4,
      delay: 0.5,
      stagger: 0.07,
    });
  }

  window.BCAnim = { reveal, analysis };

  // Recompute triggers after fonts/layout settle
  if (window.ScrollTrigger) {
    window.addEventListener("load", () => window.ScrollTrigger.refresh());
  }
})();
