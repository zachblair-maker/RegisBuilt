/* ===== BloodCheck — application engine =====
   Consumes the knowledge base in data.js:
     MARKERS      – array of marker objects (see data.js for schema)
     MARKER_GROUPS– display order of groups
     COMPOUNDS    – array of compound objects
     INTERVENTIONS– array of intervention objects
   Everything runs client-side. No data leaves the browser.
*/
(function () {
  "use strict";

  const byId = {};
  MARKERS.forEach((m) => (byId[m.id] = m));

  const state = {
    selected: new Set(),     // compound ids
    panel: [],               // marker ids recommended
    values: {},              // markerId -> number
  };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  /* ---------- STEP 1: compounds ---------- */
  function renderCompounds() {
    const groups = {};
    COMPOUNDS.forEach((c) => {
      (groups[c.category] = groups[c.category] || []).push(c);
    });
    const order = [
      "Injectable AAS",
      "Oral AAS",
      "Growth / Peptide",
      "SARM",
      "Ancillary",
      "Other",
    ];
    const container = $("#compoundGroups");
    container.innerHTML = order
      .filter((cat) => groups[cat])
      .map((cat) => {
        const items = groups[cat]
          .map(
            (c) => `
          <label class="comp" data-id="${c.id}" data-search="${(
              c.name +
              " " +
              (c.aka || "")
            ).toLowerCase()}">
            <input type="checkbox" value="${c.id}" />
            <span>
              <span class="comp__name">${c.name}${
              c.aka ? ` <span class="muted">(${c.aka})</span>` : ""
            }</span>
              <span class="comp__effect">${c.effects}</span>
            </span>
          </label>`
          )
          .join("");
        return `<div class="cgroup"><div class="cgroup__title"><span class="dot"></span>${cat}</div>${items}</div>`;
      })
      .join("");

    container.addEventListener("change", (e) => {
      if (e.target.matches('input[type="checkbox"]')) {
        const id = e.target.value;
        const label = e.target.closest(".comp");
        if (e.target.checked) {
          state.selected.add(id);
          label.classList.add("is-checked");
        } else {
          state.selected.delete(id);
          label.classList.remove("is-checked");
        }
        computePanel();
        renderPanel();
        updateSelectedCount();
        buildMarkerForm();
      }
    });
  }

  function updateSelectedCount() {
    const n = state.selected.size;
    $("#selectedCount").textContent = n
      ? `${n} compound${n > 1 ? "s" : ""} selected.`
      : "No compounds selected yet.";
  }

  $("#compoundSearch").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    $$(".comp").forEach((el) => {
      el.style.display =
        !q || el.dataset.search.includes(q) ? "" : "none";
    });
  });

  $("#clearCompounds").addEventListener("click", () => {
    state.selected.clear();
    $$("#compoundGroups input[type=checkbox]").forEach((c) => (c.checked = false));
    $$(".comp").forEach((el) => el.classList.remove("is-checked"));
    computePanel();
    renderPanel();
    updateSelectedCount();
    buildMarkerForm();
  });

  /* ---------- STEP 2: panel ---------- */
  function computePanel() {
    const set = new Set();
    // Always-useful baseline markers for anyone enhanced
    const baseline = [
      "TotalTestosterone",
      "Estradiol",
      "Hematocrit",
      "Hemoglobin",
      "LDL",
      "HDL",
      "Triglycerides",
      "ALT",
      "AST",
      "Glucose",
      "BloodPressure",
    ];
    if (state.selected.size) baseline.forEach((id) => set.add(id));
    state.selected.forEach((cid) => {
      const c = COMPOUNDS.find((x) => x.id === cid);
      if (c) c.monitor.forEach((mid) => byId[mid] && set.add(mid));
    });
    // order by MARKERS order
    state.panel = MARKERS.filter((m) => set.has(m.id)).map((m) => m.id);
  }

  function whyMarker(mid) {
    const reasons = [];
    state.selected.forEach((cid) => {
      const c = COMPOUNDS.find((x) => x.id === cid);
      if (c && c.monitor.includes(mid)) reasons.push(c.name);
    });
    if (!reasons.length) return "Core health baseline for enhanced athletes.";
    return "Relevant to: " + reasons.slice(0, 4).join(", ") +
      (reasons.length > 4 ? "…" : "");
  }

  function renderPanel() {
    const out = $("#panelOutput");
    const empty = $("#panelEmpty");
    const foot = $("#panelFoot");
    if (!state.panel.length) {
      out.innerHTML = "";
      empty.style.display = "";
      foot.hidden = true;
      return;
    }
    empty.style.display = "none";
    foot.hidden = false;

    // group panel markers
    const groups = {};
    state.panel.forEach((mid) => {
      const m = byId[mid];
      (groups[m.group] = groups[m.group] || []).push(m);
    });
    out.innerHTML = MARKER_GROUPS.filter((g) => groups[g])
      .map((g) => {
        const cards = groups[g]
          .map(
            (m) => `
        <div class="panel-card">
          <h4>${m.name} <span class="unit">${m.abbr}</span></h4>
          <div class="ref">Healthy: ${m.displayRange} ${m.unit}</div>
          <p class="why">${whyMarker(m.id)}</p>
        </div>`
          )
          .join("");
        return `<h3 class="panel-section-title">${g}</h3><div class="panel-grid">${cards}</div>`;
      })
      .join("");
  }

  $("#copyPanelBtn").addEventListener("click", () => {
    const lines = ["Recommended blood panel (BloodCheck):", ""];
    const groups = {};
    state.panel.forEach((mid) => {
      const m = byId[mid];
      (groups[m.group] = groups[m.group] || []).push(m);
    });
    MARKER_GROUPS.filter((g) => groups[g]).forEach((g) => {
      lines.push(g.toUpperCase());
      groups[g].forEach((m) =>
        lines.push(`  • ${m.name} (${m.abbr}) — healthy ${m.displayRange} ${m.unit}`)
      );
      lines.push("");
    });
    lines.push("Educational only — not medical advice.");
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      const b = $("#copyPanelBtn");
      const t = b.textContent;
      b.textContent = "Copied ✓";
      setTimeout(() => (b.textContent = t), 1600);
    });
  });

  /* ---------- STEP 3: enter results ---------- */
  function markersToShow() {
    const showAll = $("#showAllMarkers").checked;
    if (showAll || !state.panel.length) return MARKERS.map((m) => m.id);
    return state.panel;
  }

  function buildMarkerForm() {
    const ids = markersToShow();
    const groups = {};
    ids.forEach((mid) => {
      const m = byId[mid];
      (groups[m.group] = groups[m.group] || []).push(m);
    });
    const form = $("#markerForm");
    form.innerHTML = MARKER_GROUPS.filter((g) => groups[g])
      .map((g) => {
        const fields = groups[g]
          .map((m) => {
            const val = state.values[m.id] != null ? state.values[m.id] : "";
            return `
          <div class="mfield ${val !== "" ? "is-filled" : ""}" data-id="${m.id}">
            <label>${m.name}
              <span class="hint">— ${m.displayRange} ${m.unit}</span>
            </label>
            <div class="row">
              <input type="number" step="any" inputmode="decimal"
                     value="${val}" data-marker="${m.id}"
                     placeholder="${m.placeholder || ""}" aria-label="${m.name}" />
              <span class="u">${m.unit}</span>
            </div>
          </div>`;
          })
          .join("");
        return `<div class="mgroup-label">${g}</div>${fields}`;
      })
      .join("");
  }

  function onMarkerInput(e) {
    if (!e.target.matches("input[data-marker]")) return;
    const id = e.target.dataset.marker;
    const v = e.target.value.trim();
    const field = e.target.closest(".mfield");
    if (v === "" || isNaN(parseFloat(v))) {
      delete state.values[id];
      field.classList.remove("is-filled");
    } else {
      state.values[id] = parseFloat(v);
      field.classList.add("is-filled");
    }
  }

  $("#showAllMarkers").addEventListener("change", buildMarkerForm);

  $("#resetValuesBtn").addEventListener("click", () => {
    state.values = {};
    buildMarkerForm();
    $("#parseResult").hidden = true;
    $("#pasteArea").value = "";
  });

  /* ---------- paste / upload parsing ---------- */
  function escapeRe(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function parseLabText(text) {
    const found = {};
    const lines = text.split(/\r?\n/);
    // alias -> markerId (cleaned to letters/digits/space)
    const aliasPairs = [];
    MARKERS.forEach((m) => {
      const names = [m.name, m.abbr, ...(m.aliases || [])];
      names.forEach((n) => {
        const a = n.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
        if (a) aliasPairs.push([a, m.id, new RegExp("\\b" + escapeRe(a) + "\\b")]);
      });
    });

    const numRe = /-?\d+(?:\.\d+)?/;
    lines.forEach((raw) => {
      // keep letters, digits, spaces and decimal points (so numbers survive)
      const line = raw.toLowerCase().replace(/[^a-z0-9. ]/g, " ").replace(/\s+/g, " ");
      // find the single best (longest) alias that matches this line on word boundaries
      let best = null;
      for (const [alias, id, re] of aliasPairs) {
        if (re.test(line) && (!best || alias.length > best.alias.length)) {
          best = { alias, id, idx: line.search(re) };
        }
      }
      if (!best || found[best.id] != null) return;
      // take the first number that appears AFTER the marker name on this line
      const after = line.slice(best.idx + best.alias.length);
      const m = after.match(numRe);
      if (m) {
        const val = parseFloat(m[0]);
        if (!isNaN(val)) found[best.id] = val;
      }
    });
    return found;
  }

  $("#parseBtn").addEventListener("click", () => {
    const text = $("#pasteArea").value;
    runParse(text);
  });

  $("#fileInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      $("#pasteArea").value = reader.result;
      runParse(reader.result);
    };
    reader.readAsText(file);
  });

  function runParse(text) {
    const res = $("#parseResult");
    if (!text || !text.trim()) {
      res.hidden = false;
      res.textContent = "Nothing to read — paste your results or upload a file first.";
      return;
    }
    const found = parseLabText(text);
    const ids = Object.keys(found);
    if (!ids.length) {
      res.hidden = false;
      res.textContent =
        "Couldn't confidently match any markers. Try entering them by hand below — the field names show exactly what's recognised.";
      return;
    }
    // ensure those markers are visible: if not in panel, switch to show all
    const visible = new Set(markersToShow());
    if (ids.some((id) => !visible.has(id))) {
      $("#showAllMarkers").checked = true;
    }
    ids.forEach((id) => (state.values[id] = found[id]));
    buildMarkerForm();
    res.hidden = false;
    res.innerHTML =
      `Read <strong>${ids.length}</strong> value${ids.length > 1 ? "s" : ""}: ` +
      ids.map((id) => `${byId[id].name} = ${found[id]}`).join("; ") +
      `. <strong>Please double-check each one against your report.</strong>`;
  }

  /* ---------- STEP 4: analysis ---------- */
  function statusOf(m, v) {
    // returns {level:'danger-high'|'high'|'normal'|'low'|'danger-low', dir:'high'|'low'|null}
    if (m.dangerHigh != null && v >= m.dangerHigh) return { level: "danger", dir: "high" };
    if (m.dangerLow != null && v <= m.dangerLow) return { level: "danger", dir: "low" };
    if (m.max != null && v > m.max) return { level: "high", dir: "high" };
    if (m.min != null && v < m.min) return { level: "low", dir: "low" };
    return { level: "normal", dir: null };
  }

  function interventionsFor(mid, dir) {
    return INTERVENTIONS.filter(
      (iv) =>
        iv.markers.includes(mid) &&
        (iv.when === "any" || iv.when === dir || !iv.when)
    );
  }

  function meterHTML(m, v) {
    if (m.min == null || m.max == null) return "";
    const span = m.max - m.min;
    const lo = m.min - span * 0.6;
    const hi = m.max + span * 0.6;
    const total = hi - lo;
    const clamp = (x) => Math.max(0, Math.min(100, x));
    const rangeL = clamp(((m.min - lo) / total) * 100);
    const rangeW = clamp(((m.max - m.min) / total) * 100);
    const markPos = clamp(((v - lo) / total) * 100);
    return `<div class="meter">
      <div class="meter__range" style="left:${rangeL}%;width:${rangeW}%"></div>
      <div class="meter__mark" style="left:${markPos}%"></div>
    </div>`;
  }

  function analyze() {
    const ids = Object.keys(state.values);
    const out = $("#analysisOutput");
    const empty = $("#analysisEmpty");
    const foot = $("#analysisFoot");
    const summary = $("#analysisSummary");
    if (!ids.length) {
      out.innerHTML = "";
      summary.innerHTML = "";
      empty.style.display = "";
      foot.hidden = true;
      return;
    }
    empty.style.display = "none";
    foot.hidden = false;

    const results = ids.map((id) => {
      const m = byId[id];
      const v = state.values[id];
      return { m, v, st: statusOf(m, v) };
    });

    // sort: danger > high/low > normal
    const rank = { danger: 0, high: 1, low: 1, normal: 2 };
    results.sort((a, b) => rank[a.st.level] - rank[b.st.level]);

    const counts = { danger: 0, flag: 0, ok: 0 };
    results.forEach((r) => {
      if (r.st.level === "danger") counts.danger++;
      else if (r.st.level === "normal") counts.ok++;
      else counts.flag++;
    });

    summary.innerHTML = `<div class="summary">
      <div class="summary__stat s-ok"><b>${counts.ok}</b><span>in range</span></div>
      <div class="summary__stat s-warn"><b>${counts.flag}</b><span>out of range</span></div>
      <div class="summary__stat s-bad"><b>${counts.danger}</b><span>need urgent attention</span></div>
    </div>` +
      (counts.danger
        ? `<div class="acard__doctor" style="margin-bottom:18px">⚠️ One or more values are in a range that can be dangerous. Please contact a clinician promptly — and seek emergency care if you have symptoms like chest pain, severe headache, shortness of breath, or fainting.</div>`
        : "");

    out.innerHTML = results
      .map(({ m, v, st }) => {
        const badgeClass =
          st.level === "danger" ? "b-danger"
            : st.level === "high" ? "b-high"
            : st.level === "low" ? "b-low"
            : "b-normal";
        const badgeText =
          st.level === "danger" ? (st.dir === "high" ? "Critically high" : "Critically low")
            : st.level === "high" ? "High"
            : st.level === "low" ? "Low"
            : "In range";

        let explain = "";
        if (st.dir === "high" && m.high)
          explain = `<div class="acard__sec"><h5>What a high result can mean</h5><p>${m.high}</p></div>`;
        else if (st.dir === "low" && m.low)
          explain = `<div class="acard__sec"><h5>What a low result can mean</h5><p>${m.low}</p></div>`;

        let danger = "";
        if (st.level === "danger" && m.danger)
          danger = `<div class="acard__danger">⚠️ ${m.danger}</div>`;

        let interv = "";
        if (st.dir) {
          const ivs = interventionsFor(m.id, st.dir);
          if (ivs.length) {
            interv = ivs
              .map((iv) => {
                const sup = (iv.supplements || []).length
                  ? `<div class="acard__sec"><h5>Supplements that may help (educational)</h5><ul>${iv.supplements
                      .map((s) => `<li>${s}</li>`)
                      .join("")}</ul></div>`
                  : "";
                const life = (iv.lifestyle || []).length
                  ? `<div class="acard__sec"><h5>Diet &amp; lifestyle</h5><ul>${iv.lifestyle
                      .map((s) => `<li>${s}</li>`)
                      .join("")}</ul></div>`
                  : "";
                const doc = iv.doctorNote
                  ? `<div class="acard__doctor">🩺 ${iv.doctorNote}</div>`
                  : "";
                return sup + life + doc;
              })
              .join("");
          }
        }

        return `<div class="acard st-${st.level}">
        <div class="acard__top">
          <span class="acard__name">${m.name}</span>
          <span>
            <span class="acard__value">${v} ${m.unit}</span>
            <span class="badge ${badgeClass}">${badgeText}</span>
          </span>
        </div>
        ${meterHTML(m, v)}
        <div class="acard__ref">Healthy reference: <b>${m.displayRange} ${m.unit}</b></div>
        <div class="acard__sec"><h5>What it is</h5><p>${m.what}</p></div>
        ${explain}
        ${danger}
        ${interv}
      </div>`;
      })
      .join("");

    const sec = document.getElementById("step-analysis");
    if (sec.scrollIntoView) sec.scrollIntoView({ behavior: "smooth" });
  }

  $("#analyzeBtn").addEventListener("click", analyze);
  $("#printBtn").addEventListener("click", () => window.print());

  /* ---------- scroll-spy for nav ---------- */
  const sections = ["step-compounds", "step-panel", "step-enter", "step-analysis"].map(
    (id) => document.getElementById(id)
  );
  const navItems = $$(".steps-nav__item");
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          const idx = sections.indexOf(en.target);
          navItems.forEach((n, i) => n.classList.toggle("is-active", i === idx));
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => s && spy.observe(s));

  /* ---------- init ---------- */
  $("#markerForm").addEventListener("input", onMarkerInput); // delegated, attach once
  renderCompounds();
  computePanel();
  renderPanel();
  buildMarkerForm();
  updateSelectedCount();
})();
