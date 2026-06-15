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

  /* ----- Portfolio filter ----- */
  var grid = document.getElementById("portfolioGrid");
  if (grid) {
    var filterBtns = Array.prototype.slice.call(document.querySelectorAll(".filter-btn"));
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".project"));
    var empty = document.getElementById("portfolioEmpty");
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-filter");
        filterBtns.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-selected", String(active));
        });
        var shown = 0;
        cards.forEach(function (c) {
          var match = f === "all" || c.getAttribute("data-category") === f;
          c.classList.toggle("is-hidden", !match);
          if (match) shown++;
        });
        // restart the stagger-in animation
        grid.classList.remove("is-filtering");
        void grid.offsetWidth;
        grid.classList.add("is-filtering");
        if (empty) empty.hidden = shown > 0;
      });
    });
  }

  /* ----- Cinematic parallax (full-bleed showcase media) ----- */
  var pxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  if (pxEls.length && !prefersReduced && window.matchMedia("(min-width: 760px)").matches) {
    var pxTick = false;
    function pxUpdate() {
      var vh = window.innerHeight;
      pxEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;          // skip off-screen
        var prog = (r.top + r.height / 2 - vh / 2) / vh;  // -1 .. 1 through centre
        el.style.transform = "translate3d(0," + (prog * -64).toFixed(1) + "px,0) scale(1.14)";
      });
      pxTick = false;
    }
    window.addEventListener("scroll", function () {
      if (!pxTick) { pxTick = true; requestAnimationFrame(pxUpdate); }
    }, { passive: true });
    window.addEventListener("resize", pxUpdate, { passive: true });
    pxUpdate();
  }

  /* ----- Feasibility calculator ----- */
  var calc = document.getElementById("feasibility");
  if (calc) {
    var fp = document.getElementById("calcFootprint");
    var effEl = document.getElementById("calcEff");
    var seg = document.getElementById("calcStoreys");
    var fpOut = document.getElementById("calcFootprintOut");
    var effOut = document.getElementById("calcEffOut");
    var grossEl = document.getElementById("calcGross");
    var nraEl = document.getElementById("calcNra");
    var unitsEl = document.getElementById("calcUnits");
    var storeys = 1;
    var AVG_UNIT = 8; // m² average unit (indicative)
    var cur = { gross: 0, nra: 0, units: 0 };
    function fmt(n) { return Math.round(n).toLocaleString("en-AU"); }
    function tween(el, key, target) {
      if (prefersReduced) { el.textContent = fmt(target); cur[key] = target; return; }
      var from = cur[key], start = null, dur = 450;
      (function stepFn(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(from + (target - from) * e);
        if (p < 1) requestAnimationFrame(stepFn);
        else cur[key] = target;
      })(performance.now());
    }
    function update(animate) {
      var footprint = +fp.value, eff = +effEl.value / 100;
      var gross = footprint * storeys, nra = gross * eff, units = nra / AVG_UNIT;
      fpOut.textContent = (+fp.value).toLocaleString("en-AU") + " m²";
      effOut.textContent = effEl.value + "%";
      if (animate === false) {
        grossEl.textContent = fmt(gross); nraEl.textContent = fmt(nra); unitsEl.textContent = fmt(units);
        cur = { gross: gross, nra: nra, units: units };
      } else {
        tween(grossEl, "gross", gross); tween(nraEl, "nra", nra); tween(unitsEl, "units", units);
      }
    }
    fp.addEventListener("input", function () { update(true); });
    effEl.addEventListener("input", function () { update(true); });
    seg.addEventListener("click", function (e) {
      var btn = e.target.closest("button"); if (!btn) return;
      storeys = +btn.getAttribute("data-v");
      Array.prototype.forEach.call(seg.children, function (c) { c.classList.toggle("is-active", c === btn); });
      update(true);
    });
    update(false);
  }

  /* ----- Scroll progress bar ----- */
  var progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);
  var progTick = false;
  function progUpdate() {
    var st = window.scrollY || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (st / max) * 100 : 0) + "%";
    progTick = false;
  }
  window.addEventListener("scroll", function () {
    if (!progTick) { progTick = true; requestAnimationFrame(progUpdate); }
  }, { passive: true });
  progUpdate();

  var fine = window.matchMedia("(pointer: fine)").matches;

  /* ----- Custom cursor (dot + lagging ring) ----- */
  if (fine && !prefersReduced) {
    var dot = document.createElement("div"); dot.className = "cursor-dot";
    var ring = document.createElement("div"); ring.className = "cursor-ring";
    document.body.appendChild(dot); document.body.appendChild(ring);
    document.body.classList.add("cursor-on");
    var mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my, seen = false;
    window.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate(" + mx + "px," + my + "px)";
      if (!seen) { seen = true; rx = mx; ry = my; }
    }, { passive: true });
    (function ringLoop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = "translate(" + rx + "px," + ry + "px)";
      requestAnimationFrame(ringLoop);
    })();
    var hoverSel = "a,button,input,textarea,select,label,.filter-btn,.calc__seg button,.project,.logo-chip";
    document.addEventListener("mouseover", function (e) { if (e.target.closest(hoverSel)) ring.classList.add("is-hover"); });
    document.addEventListener("mouseout", function (e) { if (e.target.closest(hoverSel)) ring.classList.remove("is-hover"); });
    document.addEventListener("mousedown", function () { ring.classList.add("is-down"); });
    document.addEventListener("mouseup", function () { ring.classList.remove("is-down"); });
    document.addEventListener("mouseleave", function () { dot.style.opacity = ring.style.opacity = "0"; });
    document.addEventListener("mouseenter", function () { dot.style.opacity = ring.style.opacity = "1"; });
  }

  /* ----- Magnetic CTAs ----- */
  if (fine && !prefersReduced) {
    Array.prototype.forEach.call(document.querySelectorAll(".btn--primary, .btn--lg"), function (m) {
      m.addEventListener("mousemove", function (e) {
        var r = m.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        m.style.transform = "translate(" + (x * 0.18).toFixed(1) + "px," + (y * 0.32).toFixed(1) + "px)";
      });
      m.addEventListener("mouseleave", function () { m.style.transform = ""; });
    });
  }

  /* ----- Load intro ----- */
  function markLoaded() { document.body.classList.add("is-loaded"); }
  if (document.readyState === "complete") requestAnimationFrame(markLoaded);
  else window.addEventListener("load", function () { requestAnimationFrame(markLoaded); });
  setTimeout(markLoaded, 1400); // safety fallback

  /* ----- Footer year ----- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
