# BloodCheck — Bloodwork Analyzer for Enhanced Athletes

An educational, **harm-reduction** web tool for athletes using performance-enhancing
compounds (AAS, SARMs, GH/peptides and ancillaries). It is a single, self-contained
static site — no build step, no backend, no tracking. **Everything entered stays in
the browser.**

> ⚠️ **Not medical advice.** This tool cannot diagnose or treat anything and does not
> replace a doctor or laboratory. Reference ranges vary by lab, assay, age and
> individual — always interpret results with the ranges on your own report and a
> clinician who knows your history.

## What it does

1. **Pick your compounds** — choose what you're running from a categorized list
   (injectable AAS, oral AAS, growth/peptides, SARMs, ancillaries, other). Each item
   shows how it affects your bloodwork.
2. **Get a recommended panel** — the tool combines your selection into one monitoring
   panel (plus a sensible baseline), grouped by system, with the healthy reference
   range for each marker and why it matters for you.
3. **Enter your results** — type values by hand, or paste/upload a `.txt`/`.csv` lab
   export and the parser fills the form (word-boundary matching, one marker per line,
   with a "double-check this" prompt).
4. **Read the analysis** — every entered marker is sorted worst-first and broken down:
   status vs. range, what the marker is, what a high/low result can mean and feel like,
   a visual range meter, evidence-informed supplement / diet / lifestyle options, and a
   "see a doctor" note. Dangerous values (e.g. hematocrit > 54%, triglycerides ≥ 500,
   BP > 180, potassium > 6.0) are flagged for urgent care.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure (4 steps + disclaimer) |
| `styles.css` | All styling (dark clinical theme, responsive, print-friendly) |
| `data.js` | Knowledge base: 37 markers, 29 compounds, 12 intervention sets |
| `app.js` | Engine: panel builder, lab-report parser, status + analysis logic |

## Running

It's a static site. Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000/bloodwork/
```

## Data & sourcing

The marker ranges, compound effects and interventions were compiled from authoritative
medical and peer-reviewed sources (LabCorp/Quest, Cleveland Clinic, Mayo Clinic,
MedlinePlus, NIH/PMC, Endocrine Society, AHA/ADA guidelines, and published case
reports). Key interpretation caveats encoded in the tool:

- **Free testosterone & estradiol are assay-dependent** — use your lab's printed range.
- **Creatinine/eGFR read falsely "worse" in muscular and creatine-using people** — the
  tool surfaces cystatin C as the better kidney marker.
- **Nandrolone cross-reacts with testosterone immunoassays** — LC-MS is preferred.
- **The most effective intervention is usually reducing/stopping the offending
  compound** (especially oral 17-aa steroids), not a supplement.

This is reference education, not a substitute for professional medical care.
