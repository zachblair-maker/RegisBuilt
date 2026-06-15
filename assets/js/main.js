/* =================================================================
   RegisBuilt — interactions
   Vanilla JS, no dependencies. Progressive enhancement only.
   ================================================================= */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----- Sticky header state ----- */
  var header = document.getElementById("header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ----- Mobile nav ----- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ----- Scroll reveal with stagger ----- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if ("IntersectionObserver" in window && !prefersReduced) {
    // Stagger siblings sharing the same parent for a fluid cascade.
    revealEls.forEach(function (el) {
      var siblings = el.parentElement.children;
      var idx = Array.prototype.indexOf.call(siblings, el);
      el.style.setProperty("--reveal-delay", Math.min(idx, 6) * 80 + "ms");
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ----- Animated stat counters ----- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    if (prefersReduced) { el.textContent = prefix + target + suffix; return; }
    var dur = 1600, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ----- Hero parallax (pointer) ----- */
  var mesh = document.querySelector(".hero__mesh");
  var skyline = document.querySelector(".hero__skyline");
  if (mesh && !prefersReduced && window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener("mousemove", function (e) {
      var x = (e.clientX / window.innerWidth - 0.5);
      var y = (e.clientY / window.innerHeight - 0.5);
      mesh.style.transform = "translate3d(" + x * -26 + "px," + y * -26 + "px,0)";
      if (skyline) skyline.style.transform = "translate3d(" + x * 14 + "px,0,0)";
    }, { passive: true });
  }

  /* ----- Active nav link on scroll ----- */
  var sections = ["services", "projects", "process", "about", "contact"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav a"));
  if ("IntersectionObserver" in window && sections.length) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { so.observe(s); });
  }

  /* ----- Contact form (demo handler) ----- */
  var form = document.querySelector(".contact__form");
  var note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var val = function (n) { var el = form.elements[n]; return el ? el.value.trim() : ""; };
      var subject = "Project enquiry — " + (val("name") || "RegisBuilt website");
      var body = [
        "Name: " + val("name"),
        "Email: " + val("email"),
        "Phone: " + val("phone"),
        "Project type: " + val("type"),
        "",
        val("message")
      ].join("\n");
      // No backend required: compose the enquiry in the visitor's email client.
      // To send automatically instead, point the form at Formspree/Netlify Forms.
      window.location.href = "mailto:info@regisbuilt.com.au?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      if (note) { note.hidden = false; }
    });
  }

  /* ----- Footer year ----- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
