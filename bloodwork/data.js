/* ===== BloodCheck — knowledge base =====
   Educational, harm-reduction reference data. NOT medical advice.
   Reference ranges are commonly cited US adult-male values and vary by
   lab, assay, age and individual. Always defer to your own lab report
   and a clinician.

   Marker schema:
     id          unique key (used by COMPOUNDS.monitor & INTERVENTIONS.markers)
     name, abbr, unit
     group       display bucket (see MARKER_GROUPS)
     min, max    numeric healthy bounds (null = that side is not flagged)
     dangerLow,
     dangerHigh  numeric thresholds that trigger an urgent-care flag (null = none)
     displayRange human-readable range string
     what        plain-language explanation
     high, low   what an out-of-range result can mean / feel like
     danger      urgent-care note (or null)
     aliases     extra strings used when parsing a pasted lab report
     placeholder example value for the input field
*/

const MARKER_GROUPS = [
  "Hormones",
  "Blood count",
  "Liver",
  "Lipids",
  "Kidney",
  "Metabolic",
  "Thyroid",
  "Other",
];

const MARKERS = [
  /* ---------------- HORMONES ---------------- */
  {
    id: "TotalTestosterone", name: "Total Testosterone", abbr: "Total T", unit: "ng/dL",
    group: "Hormones", min: 264, max: 916, dangerLow: null, dangerHigh: null,
    displayRange: "264–916", placeholder: "600",
    aliases: ["total testosterone", "testosterone total", "testosterone, total", "total t", "testosterone"],
    what: "The total amount of testosterone in the blood, including hormone bound to proteins (SHBG, albumin) plus the small unbound fraction. The primary screen for the main male sex hormone.",
    high: "Acne, oily skin, irritability/aggression, sleep apnea and a rising red-blood-cell count (polycythemia). Supraphysiologic levels reflect testosterone/AAS use and suppress your natural production and fertility.",
    low: "Low libido, erectile dysfunction, fatigue, low mood, loss of muscle and strength, more body fat and reduced bone density.",
    danger: null,
  },
  {
    id: "FreeTestosterone", name: "Free Testosterone", abbr: "Free T", unit: "pg/mL",
    group: "Hormones", min: 35, max: 155, dangerLow: null, dangerHigh: null,
    displayRange: "35–155 (assay-dependent — use your lab's range)", placeholder: "100",
    aliases: ["free testosterone", "testosterone free", "free t", "testosterone, free"],
    what: "The biologically active testosterone not bound to SHBG or albumin, freely available to tissues. Most useful when SHBG is abnormal and total testosterone may mislead. Ranges differ a lot between assays.",
    high: "Excess bioavailable androgen — acne, increased red-cell mass and mood changes. Common with AAS use or low SHBG.",
    low: "Hypogonadal symptoms (low libido, fatigue, ED, low mood) even when total testosterone looks normal — often from high SHBG.",
    danger: null,
  },
  {
    id: "Estradiol", name: "Estradiol (sensitive)", abbr: "E2", unit: "pg/mL",
    group: "Hormones", min: 8, max: 35, dangerLow: null, dangerHigh: null,
    displayRange: "8–35 (sensitive LC/MS assay)", placeholder: "25",
    aliases: ["estradiol", "oestradiol", "e2", "estradiol sensitive"],
    what: "The most potent estrogen; in men it is made largely by aromatization of testosterone and matters for libido, bone health and brain function. Use the sensitive assay in men — standard immunoassays read inaccurately at low male levels.",
    high: "Gynecomastia, water retention, moodiness, reduced libido and erectile difficulty. Common with high testosterone/aromatization or higher body fat.",
    low: "Often from over-aggressive aromatase-inhibitor use: low libido, erectile difficulty, joint aches and loss of bone mineral density.",
    danger: null,
  },
  {
    id: "SHBG", name: "Sex Hormone Binding Globulin", abbr: "SHBG", unit: "nmol/L",
    group: "Hormones", min: 10, max: 57, dangerLow: null, dangerHigh: null,
    displayRange: "10–57", placeholder: "30",
    aliases: ["shbg", "sex hormone binding globulin", "sex hormone-binding globulin"],
    what: "A liver protein that binds and transports sex hormones, controlling how much is biologically available. It strongly shapes how total testosterone should be read.",
    high: "Lowers free (active) testosterone and can cause low-T symptoms despite a normal total. Linked to hyperthyroidism, liver disease, aging and estrogen excess.",
    low: "Raises the free hormone fraction. Linked to insulin resistance, obesity, type 2 diabetes, metabolic syndrome, hypothyroidism and fatty liver.",
    danger: null,
  },
  {
    id: "LH", name: "Luteinizing Hormone", abbr: "LH", unit: "mIU/mL",
    group: "Hormones", min: 1.7, max: 8.6, dangerLow: null, dangerHigh: null,
    displayRange: "1.7–8.6", placeholder: "4",
    aliases: ["lh", "luteinizing hormone", "luteinising hormone"],
    what: "A pituitary hormone that signals the testes to produce testosterone. Helps locate whether a testosterone problem is in the testes or the pituitary/brain.",
    high: "High LH with low testosterone points to primary (testicular) hypogonadism — the brain signals but the testes can't respond.",
    low: "Low LH is the expected effect of exogenous testosterone/AAS (shut-down signalling); with low testosterone it indicates secondary hypogonadism.",
    danger: null,
  },
  {
    id: "FSH", name: "Follicle Stimulating Hormone", abbr: "FSH", unit: "mIU/mL",
    group: "Hormones", min: 1.5, max: 12.4, dangerLow: null, dangerHigh: null,
    displayRange: "1.5–12.4", placeholder: "4",
    aliases: ["fsh", "follicle stimulating hormone", "follicle-stimulating hormone"],
    what: "A pituitary hormone that drives sperm production. A key marker of fertility and pituitary–gonadal signalling.",
    high: "Suggests primary testicular failure — the pituitary is compensating for testes that aren't responding.",
    low: "Suppressed signalling (also the expected effect of testosterone/AAS use); associated with impaired sperm production and reduced fertility.",
    danger: null,
  },
  {
    id: "Prolactin", name: "Prolactin", abbr: "PRL", unit: "ng/mL",
    group: "Hormones", min: 4.0, max: 15.2, dangerLow: null, dangerHigh: 200,
    displayRange: "4.0–15.2", placeholder: "10",
    aliases: ["prolactin", "prl"],
    what: "A pituitary hormone that normally stays low in men; excess suppresses testosterone and libido. Checked when low-T or sexual dysfunction is present.",
    high: "Low libido, erectile dysfunction, infertility, low testosterone and sometimes gynecomastia or nipple discharge. Often driven by 19-nor compounds (nandrolone, trenbolone).",
    low: "Rarely clinically significant in men and usually needs no treatment.",
    danger: "A prolactin above ~200 ng/mL strongly suggests a prolactin-secreting pituitary tumor (macroadenoma) — get prompt endocrine evaluation and imaging.",
  },
  {
    id: "IGF1", name: "IGF-1", abbr: "IGF-1", unit: "ng/mL",
    group: "Hormones", min: 115, max: 307, dangerLow: null, dangerHigh: null,
    displayRange: "~115–307 (age-dependent)", placeholder: "180",
    aliases: ["igf-1", "igf 1", "igf1", "insulin-like growth factor", "insulin like growth factor 1", "somatomedin c"],
    what: "Produced by the liver in response to growth hormone (GH); it mediates most of GH's effects and is the main stable blood marker of GH status. Compare against your age band.",
    high: "Reflects GH excess (or GH/IGF use). Sustained excess from a tumor causes acromegaly — enlarged hands/feet/jaw, joint pain, organ enlargement and metabolic problems.",
    low: "GH deficiency in adults: fatigue, reduced muscle mass and strength, more body fat and low mood; can also reflect poor nutrition or liver disease.",
    danger: null,
  },

  /* ---------------- BLOOD COUNT ---------------- */
  {
    id: "Hemoglobin", name: "Hemoglobin", abbr: "Hgb", unit: "g/dL",
    group: "Blood count", min: 13.5, max: 17.5, dangerLow: 7, dangerHigh: 18,
    displayRange: "13.5–17.5", placeholder: "15",
    aliases: ["hemoglobin", "haemoglobin", "hgb", "hb"],
    what: "The iron-containing protein in red blood cells that carries oxygen. The primary measure of the blood's oxygen-carrying capacity.",
    high: "On testosterone it commonly rises (stimulated red-cell production). High values thicken the blood: headache, flushing, dizziness and increased clotting risk.",
    low: "Anemia — fatigue, weakness, pale skin, breathlessness and a fast heartbeat.",
    danger: "Hemoglobin above ~18 g/dL (alongside high hematocrit) raises thrombosis/stroke risk; below ~7–8 g/dL is severe anemia that may need urgent care.",
  },
  {
    id: "Hematocrit", name: "Hematocrit", abbr: "Hct", unit: "%",
    group: "Blood count", min: 38, max: 50, dangerLow: null, dangerHigh: 54,
    displayRange: "38–50 (keep < 52–54)", placeholder: "45",
    aliases: ["hematocrit", "haematocrit", "hct"],
    what: "The percentage of blood volume made up of red blood cells — a proxy for red-cell mass and blood thickness (viscosity). The single most important CBC marker for AAS users.",
    high: "Testosterone frequently raises it (erythrocytosis). Thicker blood means more clotting risk, headache, flushing and dizziness.",
    low: "Anemia, blood loss, overhydration or nutritional deficiency — fatigue, weakness, pallor and breathlessness.",
    danger: "Hematocrit above 54% markedly raises clot, heart-attack and stroke risk. Guidelines say pause testosterone until it normalizes; phlebotomy may be considered under a clinician (targets often < 45–50%).",
  },
  {
    id: "RBC", name: "Red Blood Cell count", abbr: "RBC", unit: "M/µL",
    group: "Blood count", min: 4.6, max: 6.2, dangerLow: null, dangerHigh: null,
    displayRange: "4.6–6.2", placeholder: "5.2",
    aliases: ["rbc", "red blood cell count", "red blood cells", "red blood cell"],
    what: "The number of red blood cells per microlitre. Red cells carry oxygen via hemoglobin, so this helps assess oxygen delivery and anemia.",
    high: "Rises on testosterone and with dehydration, smoking or altitude. Very high counts thicken the blood and raise clotting risk.",
    low: "Anemia, blood loss or nutritional deficiency — fatigue, weakness and breathlessness.",
    danger: null,
  },

  /* ---------------- LIVER ---------------- */
  {
    id: "ALT", name: "Alanine Aminotransferase", abbr: "ALT", unit: "U/L",
    group: "Liver", min: 7, max: 56, dangerLow: null, dangerHigh: 250,
    displayRange: "7–56", placeholder: "30",
    aliases: ["alt", "sgpt", "alanine aminotransferase", "alt sgpt"],
    what: "A liver enzyme released into the blood when liver cells are damaged — one of the most specific markers of liver-cell injury. Note: hard training also leaks ALT/AST from muscle.",
    high: "Liver inflammation/injury from oral steroids, alcohol, medications, fatty liver or hepatitis. Often silent early; may bring fatigue, nausea or jaundice. Retest rested and off orals, with CK to separate muscle from liver.",
    low: "Uncommon and usually not concerning; very low can reflect B6 deficiency or malnutrition.",
    danger: "ALT more than ~5–10× the upper limit (≳250–500 U/L), especially with jaundice, dark urine or confusion, suggests acute liver injury needing urgent care.",
  },
  {
    id: "AST", name: "Aspartate Aminotransferase", abbr: "AST", unit: "U/L",
    group: "Liver", min: 10, max: 40, dangerLow: null, dangerHigh: 250,
    displayRange: "10–40", placeholder: "24",
    aliases: ["ast", "sgot", "aspartate aminotransferase", "ast sgot"],
    what: "An enzyme in liver, heart and muscle that leaks into the blood when those tissues are injured. Used with ALT to assess liver health.",
    high: "Liver injury, but also heart/muscle damage and strenuous exercise. Usually symptomless early; severe cases bring fatigue, nausea or jaundice.",
    low: "Rarely significant; most often linked to B6 deficiency and generally benign.",
    danger: "AST above ~250–1000 U/L points to severe injury and needs urgent evaluation — particularly with jaundice or confusion, or with very high CK and dark urine (possible rhabdomyolysis).",
  },
  {
    id: "GGT", name: "Gamma-Glutamyl Transferase", abbr: "GGT", unit: "U/L",
    group: "Liver", min: null, max: 65, dangerLow: null, dangerHigh: null,
    displayRange: "< 65", placeholder: "30",
    aliases: ["ggt", "gamma glutamyl transferase", "gamma-glutamyl transferase", "gamma gt"],
    what: "An enzyme concentrated in the liver and bile ducts — a sensitive, liver-specific marker of bile-duct problems and alcohol stress (it does not rise from muscle).",
    high: "Alcohol, bile-duct obstruction, fatty liver and certain medications. Often no specific symptoms on its own, but useful to confirm a true liver (vs muscle) signal.",
    low: "Low GGT is normal and not concerning.",
    danger: null,
  },
  {
    id: "Bilirubin", name: "Total Bilirubin", abbr: "T. Bili", unit: "mg/dL",
    group: "Liver", min: null, max: 1.3, dangerLow: null, dangerHigh: 3,
    displayRange: "0.2–1.3", placeholder: "0.6",
    aliases: ["bilirubin", "total bilirubin", "t. bili", "tbili", "bilirubin total"],
    what: "A yellow pigment from the breakdown of old red blood cells, processed by the liver. Reflects how well the liver and bile ducts clear this waste.",
    high: "Rapid red-cell breakdown, liver disease or blocked bile ducts; benign Gilbert syndrome also raises it. Signs: jaundice, dark urine, itching.",
    low: "Not clinically significant.",
    danger: "Bilirubin above ~3 mg/dL usually shows as visible jaundice; rapidly rising levels with abdominal pain or confusion warrant urgent care.",
  },
  {
    id: "Albumin", name: "Albumin", abbr: "ALB", unit: "g/dL",
    group: "Liver", min: 3.5, max: 5.5, dangerLow: 2.5, dangerHigh: null,
    displayRange: "3.5–5.5", placeholder: "4.5",
    aliases: ["albumin", "alb"],
    what: "The most abundant protein made by the liver; it keeps fluid in blood vessels and transports hormones, calcium and drugs. Reflects liver synthetic function and nutrition.",
    high: "Usually just dehydration (a concentration effect) rather than disease.",
    low: "Liver or kidney disease, malnutrition or inflammation; can cause swelling (edema) in legs or abdomen.",
    danger: "Albumin below ~2.5 g/dL often causes fluid leakage/edema and signals serious underlying illness needing evaluation.",
  },

  /* ---------------- LIPIDS ---------------- */
  {
    id: "TotalCholesterol", name: "Total Cholesterol", abbr: "TC", unit: "mg/dL",
    group: "Lipids", min: null, max: 200, dangerLow: null, dangerHigh: null,
    displayRange: "< 200 desirable", placeholder: "180",
    aliases: ["total cholesterol", "cholesterol total", "cholesterol, total", "cholesterol"],
    what: "The sum of all cholesterol in your blood (LDL, HDL and a portion of triglyceride-rich particles). A broad snapshot of cardiovascular risk, less specific than its parts.",
    high: "Usually symptomless but raises long-term risk of atherosclerosis, heart attack and stroke.",
    low: "Very low is uncommon — occasionally malnutrition, liver disease or hyperthyroidism.",
    danger: null,
  },
  {
    id: "LDL", name: "LDL Cholesterol", abbr: "LDL-C", unit: "mg/dL",
    group: "Lipids", min: null, max: 130, dangerLow: null, dangerHigh: null,
    displayRange: "< 100 optimal", placeholder: "110",
    aliases: ["ldl", "ldl-c", "ldl cholesterol", "ldl-cholesterol", "ldl chol calc"],
    what: "The main 'bad' cholesterol that deposits into artery walls to form plaque. The primary lipid target for reducing heart-disease risk.",
    high: "Typically symptomless but drives plaque buildup and the risk of heart attack, stroke and peripheral artery disease. Oral 17-aa steroids raise it directly (largely reversible after stopping).",
    low: "Generally favourable for heart health.",
    danger: null,
  },
  {
    id: "HDL", name: "HDL Cholesterol", abbr: "HDL-C", unit: "mg/dL",
    group: "Lipids", min: 40, max: null, dangerLow: null, dangerHigh: null,
    displayRange: "≥ 40 (≥ 60 protective)", placeholder: "50",
    aliases: ["hdl", "hdl-c", "hdl cholesterol", "hdl-cholesterol"],
    what: "The 'good' cholesterol that carries excess cholesterol back to the liver for removal. Unlike other lipids, higher is generally better.",
    high: "Around 60 mg/dL or above is considered protective; very high is usually benign.",
    low: "Below 40 is a major independent heart-disease risk factor. Oral 17-aa steroids crush HDL hard (recovers in ~6–10 weeks after stopping).",
    danger: null,
  },
  {
    id: "Triglycerides", name: "Triglycerides", abbr: "TG", unit: "mg/dL",
    group: "Lipids", min: null, max: 150, dangerLow: null, dangerHigh: 500,
    displayRange: "< 150 normal", placeholder: "120",
    aliases: ["triglycerides", "triglyceride", "trig", "tg"],
    what: "The most common fat in blood, storing unused calories. High levels usually reflect diet, alcohol, excess weight or poorly controlled blood sugar.",
    high: "Raise heart-disease risk and, when very high, the risk of acute pancreatitis; often cluster with insulin resistance.",
    low: "Usually not a concern; occasionally malnutrition, malabsorption or an overactive thyroid.",
    danger: "Triglycerides ≥ 500 mg/dL sharply raise the risk of acute pancreatitis and warrant prompt medical attention; risk climbs further above 1,000.",
  },
  {
    id: "ApoB", name: "Apolipoprotein B", abbr: "ApoB", unit: "mg/dL",
    group: "Lipids", min: null, max: 90, dangerLow: null, dangerHigh: null,
    displayRange: "< 90 optimal (< 80 better)", placeholder: "85",
    aliases: ["apob", "apo b", "apolipoprotein b"],
    what: "Counts the total number of artery-clogging particles (each LDL/VLDL carries one ApoB). Often a more accurate predictor of cardiovascular risk than LDL-C.",
    high: "Many atherogenic particles and elevated risk of heart attack and stroke; above ~130 mg/dL signals substantially increased risk.",
    low: "Few atherogenic particles — generally lower cardiovascular risk.",
    danger: null,
  },

  /* ---------------- KIDNEY ---------------- */
  {
    id: "Creatinine", name: "Creatinine", abbr: "Cr", unit: "mg/dL",
    group: "Kidney", min: 0.7, max: 1.3, dangerLow: null, dangerHigh: 4,
    displayRange: "0.7–1.3", placeholder: "1.0",
    aliases: ["creatinine", "creat", "cr"],
    what: "A waste product from muscle turnover that the kidneys filter — a core marker of kidney filtration. It depends on muscle mass, so very muscular people and creatine users can run high without kidney disease.",
    high: "Reduced filtration, dehydration or muscle breakdown — but also just high muscle mass, a high-protein diet or creatine supplementation. Confirm with cystatin C and a urine albumin test before worrying.",
    low: "Usually not a concern; can reflect low muscle mass or aging.",
    danger: "Rapidly rising creatinine or levels above ~4 mg/dL warrant prompt evaluation for acute kidney injury.",
  },
  {
    id: "eGFR", name: "Estimated GFR", abbr: "eGFR", unit: "mL/min/1.73m²",
    group: "Kidney", min: 60, max: null, dangerLow: 15, dangerHigh: null,
    displayRange: "≥ 60 (≥ 90 ideal)", placeholder: "95",
    aliases: ["egfr", "gfr", "estimated gfr", "estimated glomerular filtration"],
    what: "A calculated estimate of how much blood the kidneys filter per minute (from creatinine or cystatin C, age and sex). The main number used to stage kidney function.",
    high: "Higher is generally healthy. eGFR naturally declines with age.",
    low: "Below 60 for 3+ months indicates chronic kidney disease; the lower it falls the more advanced (fatigue, swelling, nausea at later stages). A creatinine-based eGFR can read falsely low in muscular/creatine users — confirm with cystatin C.",
    danger: "eGFR below 15 indicates kidney failure and is life-threatening without dialysis or transplant; persistently below 60 needs medical follow-up.",
  },
  {
    id: "BUN", name: "Blood Urea Nitrogen", abbr: "BUN", unit: "mg/dL",
    group: "Kidney", min: 6, max: 20, dangerLow: null, dangerHigh: 100,
    displayRange: "6–20", placeholder: "14",
    aliases: ["bun", "blood urea nitrogen", "urea nitrogen"],
    what: "Urea nitrogen, a waste product from breaking down dietary protein, cleared by the kidneys. Read alongside creatinine and eGFR for kidney function and hydration.",
    high: "Reduced kidney function, dehydration, a high-protein diet or GI bleeding — not always kidney disease on its own.",
    low: "Less common; may reflect liver disease, malnutrition or overhydration.",
    danger: "Very high BUN (≳100 mg/dL) with confusion, severe fatigue or nausea suggests kidney failure/uremia and needs urgent care.",
  },
  {
    id: "CystatinC", name: "Cystatin C", abbr: "CysC", unit: "mg/L",
    group: "Kidney", min: 0.5, max: 1.0, dangerLow: null, dangerHigh: null,
    displayRange: "~0.5–1.0 (lab-dependent)", placeholder: "0.8",
    aliases: ["cystatin c", "cystatin-c", "cystatin", "cysc"],
    what: "A protein filtered by the kidneys that is largely independent of muscle mass — the better kidney-filtration marker for muscular and creatine-using people. Can detect decline earlier than creatinine.",
    high: "Reduced filtration and possible chronic kidney disease; it rises before creatinine, so it may flag early decline.",
    low: "Generally reflects good kidney filtration.",
    danger: null,
  },

  /* ---------------- METABOLIC ---------------- */
  {
    id: "Glucose", name: "Fasting Glucose", abbr: "FPG", unit: "mg/dL",
    group: "Metabolic", min: 70, max: 99, dangerLow: 54, dangerHigh: 250,
    displayRange: "70–99", placeholder: "90",
    aliases: ["glucose", "fasting glucose", "fasting blood glucose", "blood glucose", "glucose fasting"],
    what: "Blood sugar after 8+ hours without food — baseline glucose control and the standard screen for prediabetes and diabetes.",
    high: "100–125 mg/dL is prediabetes and ≥126 (confirmed) is diabetes. Chronic elevation: thirst, frequent urination, fatigue, blurred vision. GH and some AAS directly worsen insulin sensitivity.",
    low: "Below 70 is hypoglycemia — shakiness, sweating, hunger, confusion, palpitations.",
    danger: "Glucose below 54 is severe hypoglycemia needing immediate action; above ~250 with symptoms or any confusion needs urgent care.",
  },
  {
    id: "HbA1c", name: "Hemoglobin A1c", abbr: "HbA1c", unit: "%",
    group: "Metabolic", min: null, max: 5.7, dangerLow: null, dangerHigh: 10,
    displayRange: "< 5.7", placeholder: "5.2",
    aliases: ["hba1c", "a1c", "hemoglobin a1c", "glycated hemoglobin", "hgb a1c", "hb a1c"],
    what: "Average blood glucose over ~2–3 months (the percent of glucose-bound hemoglobin). Used to diagnose and monitor diabetes without fasting.",
    high: "5.7–6.4% is prediabetes and ≥6.5% is diabetes. Sustained highs raise risk of nerve, kidney, eye and cardiovascular complications.",
    low: "Uncommon; may reflect recent lows, anemia or recent blood loss/transfusion.",
    danger: "A1c above ~10% indicates markedly uncontrolled diabetes warranting prompt management.",
  },
  {
    id: "Insulin", name: "Fasting Insulin", abbr: "Insulin", unit: "µIU/mL",
    group: "Metabolic", min: 2.6, max: 24.9, dangerLow: null, dangerHigh: null,
    displayRange: "2.6–24.9 (optimal often < 8)", placeholder: "6",
    aliases: ["insulin", "fasting insulin"],
    what: "The hormone insulin after fasting — how hard the pancreas works to keep blood sugar normal. High fasting values often signal insulin resistance even when glucose still looks normal.",
    high: "Insulin resistance, prediabetes, metabolic syndrome or obesity. Many clinicians consider metabolically optimal levels well below the wide lab upper limit.",
    low: "Can reflect inadequate insulin production (type 1 or advanced type 2 diabetes); interpret with glucose.",
    danger: null,
  },

  /* ---------------- THYROID ---------------- */
  {
    id: "TSH", name: "Thyroid Stimulating Hormone", abbr: "TSH", unit: "mIU/L",
    group: "Thyroid", min: 0.4, max: 4.5, dangerLow: null, dangerHigh: null,
    displayRange: "0.4–4.5", placeholder: "2.0",
    aliases: ["tsh", "thyroid stimulating hormone", "thyroid-stimulating hormone"],
    what: "A pituitary hormone that signals the thyroid — the most sensitive screen for thyroid function. Because of the feedback loop, TSH moves opposite to thyroid activity.",
    high: "Usually an underactive thyroid (hypothyroidism): fatigue, weight gain, cold intolerance, dry skin, constipation, low mood.",
    low: "Usually an overactive thyroid (hyperthyroidism): weight loss, fast/irregular heartbeat, anxiety, tremor, heat intolerance, poor sleep.",
    danger: "Very low TSH with high thyroid hormones plus fever, racing heart and agitation can precede thyroid storm — a medical emergency.",
  },
  {
    id: "FreeT3", name: "Free Triiodothyronine", abbr: "Free T3", unit: "pg/mL",
    group: "Thyroid", min: 2.3, max: 4.1, dangerLow: null, dangerHigh: null,
    displayRange: "2.3–4.1", placeholder: "3.2",
    aliases: ["free t3", "ft3", "free triiodothyronine", "t3 free"],
    what: "The active, unbound thyroid hormone that drives metabolism in tissues. Helps clarify thyroid status, especially in suspected hyperthyroidism.",
    high: "Hyperthyroidism: fast heartbeat, weight loss, anxiety, tremor, sweating, heat intolerance.",
    low: "Hypothyroidism or non-thyroidal illness: fatigue, sluggishness, cold intolerance, weight gain.",
    danger: null,
  },
  {
    id: "FreeT4", name: "Free Thyroxine", abbr: "Free T4", unit: "ng/dL",
    group: "Thyroid", min: 0.8, max: 1.8, dangerLow: null, dangerHigh: null,
    displayRange: "0.8–1.8", placeholder: "1.2",
    aliases: ["free t4", "ft4", "free thyroxine", "t4 free"],
    what: "The unbound form of the main thyroid hormone T4, converted into the more active T3. With TSH, it distinguishes the type and severity of thyroid disorders.",
    high: "Hyperthyroidism: weight loss, palpitations, tremor, anxiety, heat intolerance, insomnia.",
    low: "Hypothyroidism: fatigue, weight gain, cold intolerance, dry skin, constipation.",
    danger: null,
  },

  /* ---------------- OTHER ---------------- */
  {
    id: "PSA", name: "Prostate Specific Antigen", abbr: "PSA", unit: "ng/mL",
    group: "Other", min: null, max: 4.0, dangerLow: null, dangerHigh: 10,
    displayRange: "< 4.0 (age-adjusted)", placeholder: "1.0",
    aliases: ["psa", "prostate specific antigen", "prostate-specific antigen"],
    what: "A protein made by the prostate, measured to screen for prostate problems including cancer. Levels rise naturally with age and prostate size; testosterone can nudge it up.",
    high: "Prostate cancer, benign enlargement (BPH), prostatitis, infection or recent ejaculation/procedures. PSA 4–10 carries roughly a 25% chance of cancer and warrants follow-up.",
    low: "Generally desirable and not a health concern.",
    danger: "PSA above 10 ng/mL substantially raises prostate-cancer likelihood — get prompt urology evaluation. A rapidly rising PSA also needs assessment.",
  },
  {
    id: "CRP", name: "hs-CRP (inflammation)", abbr: "hs-CRP", unit: "mg/L",
    group: "Other", min: null, max: 3.0, dangerLow: null, dangerHigh: 10,
    displayRange: "< 1.0 low risk (< 3.0 ok)", placeholder: "0.8",
    aliases: ["crp", "hs-crp", "hscrp", "c-reactive protein", "c reactive protein", "high-sensitivity crp"],
    what: "A sensitive measure of body-wide inflammation used to estimate cardiovascular risk. Lower means less vascular inflammation and lower heart-disease risk.",
    high: "More inflammation and elevated cardiovascular risk (> 3.0 mg/L is high-risk). Test when rested — acute infection, injury or a hard training session also raise it.",
    low: "Below 1.0 mg/L indicates low inflammation and low cardiovascular risk — favourable.",
    danger: "hs-CRP above 10 mg/L usually reflects acute infection/inflammation; with fever or localized pain, seek medical evaluation rather than self-treating, and re-test after recovery.",
  },
  {
    id: "Potassium", name: "Potassium", abbr: "K", unit: "mEq/L",
    group: "Other", min: 3.5, max: 5.2, dangerLow: 3.0, dangerHigh: 6.0,
    displayRange: "3.5–5.2", placeholder: "4.2",
    aliases: ["potassium", "serum potassium"],
    what: "An essential electrolyte critical for nerve signalling, muscle contraction and a steady heartbeat. The body keeps it in a narrow range.",
    high: "Hyperkalemia (> 5.5): muscle weakness, numbness, nausea and dangerous heart-rhythm changes — often silent until severe.",
    low: "Hypokalemia: muscle weakness or cramps, fatigue, constipation and palpitations/arrhythmias.",
    danger: "Potassium above 6.0 or below 3.0 mEq/L can cause life-threatening cardiac arrhythmias — emergency care.",
  },
  {
    id: "Sodium", name: "Sodium", abbr: "Na", unit: "mEq/L",
    group: "Other", min: 135, max: 145, dangerLow: 125, dangerHigh: 160,
    displayRange: "135–145", placeholder: "140",
    aliases: ["sodium", "serum sodium"],
    what: "The main electrolyte governing fluid balance, blood pressure and nerve/muscle function. Reflects the balance of water and salt in the body.",
    high: "Hypernatremia (> 145), usually dehydration: intense thirst, confusion, weakness, irritability, muscle twitching.",
    low: "Hyponatremia (< 135): headache, nausea, confusion, fatigue, cramps and, when severe, seizures from brain swelling.",
    danger: "Sodium below 125 (brain edema/seizure risk) or above 160 mEq/L (seizures, coma) is a medical emergency.",
  },
  {
    id: "BloodPressure", name: "Blood Pressure (systolic)", abbr: "BP", unit: "mmHg",
    group: "Other", min: 90, max: 120, dangerLow: null, dangerHigh: 180,
    displayRange: "< 120 / 80 (enter systolic)", placeholder: "118",
    aliases: ["blood pressure", "bp", "systolic"],
    what: "The pressure of blood against artery walls — systolic (heart beating) over diastolic (heart resting). Enter your systolic (top) number; normal is below 120/80 mmHg.",
    high: "Elevated 120–129, Stage 1 130–139, Stage 2 ≥140 systolic. Strains the heart and arteries and raises risk of heart attack, stroke and kidney disease; usually symptomless. AAS, high hematocrit and orals all push it up.",
    low: "Hypotension (often below ~90 systolic): dizziness, lightheadedness, blurred vision, fatigue or fainting, especially on standing.",
    danger: "Above 180 systolic (or 120 diastolic) is a hypertensive crisis — with chest pain, shortness of breath, severe headache or vision/neurological changes, call emergency services.",
  },
  {
    id: "VitaminD", name: "Vitamin D (25-OH)", abbr: "Vit D", unit: "ng/mL",
    group: "Other", min: 30, max: 100, dangerLow: null, dangerHigh: 150,
    displayRange: "30–100 (target ~30–50)", placeholder: "40",
    aliases: ["vitamin d", "vit d", "25-oh", "25 oh", "25-hydroxyvitamin d", "25 hydroxy vitamin d", "vitamin d 25"],
    what: "A hormone-like vitamin important for bone health, immune function and muscle. Commonly low, especially in indoor athletes and higher latitudes. Test rather than guess.",
    high: "Usually only from over-supplementation. Very high 25-OH-D (toxicity) causes hypercalcemia: nausea, excess thirst/urination, confusion and kidney stones.",
    low: "Deficiency (< 20) or insufficiency (21–29): fatigue, low mood, bone/muscle aches, reduced strength and more frequent illness.",
    danger: "25-OH-D above ~150 ng/mL can cause dangerous hypercalcemia — stop high-dose supplements and seek evaluation if you have nausea, confusion or kidney-stone symptoms.",
  },
];

/* ===== COMPOUNDS =====
   id, name, aka (alt names, also searched), category, effects, monitor[]
*/
const COMPOUNDS = [
  /* ---- Injectable AAS ---- */
  {
    id: "test", name: "Testosterone", aka: "Test, Cyp, Enanthate, Sustanon, TRT", category: "Injectable AAS",
    effects: "Raises total/free T; aromatizes to estradiol; suppresses LH/FSH; raises hematocrit; lowers HDL and raises LDL; can raise PSA and blood pressure.",
    monitor: ["TotalTestosterone", "FreeTestosterone", "Estradiol", "SHBG", "LH", "FSH", "Hemoglobin", "Hematocrit", "RBC", "HDL", "LDL", "ApoB", "Triglycerides", "PSA", "BloodPressure", "Glucose"],
  },
  {
    id: "deca", name: "Nandrolone", aka: "Deca, NPP, Durabolin", category: "Injectable AAS",
    effects: "Deeply suppresses LH/FSH and natural T; a progestin that can raise prolactin; markedly lowers HDL; raises hematocrit. Falsely elevates immunoassay testosterone (use LC-MS) and creatinine.",
    monitor: ["TotalTestosterone", "FreeTestosterone", "Estradiol", "Prolactin", "LH", "FSH", "HDL", "LDL", "ApoB", "Triglycerides", "Hematocrit", "Hemoglobin", "RBC", "Creatinine", "CystatinC", "BloodPressure"],
  },
  {
    id: "tren", name: "Trenbolone", aka: "Tren, Parabolan", category: "Injectable AAS",
    effects: "Highly suppressive; a progestin that can raise prolactin; among the harshest on lipids (big HDL drop); strongly raises hematocrit and blood pressure; stresses the kidneys.",
    monitor: ["TotalTestosterone", "FreeTestosterone", "Prolactin", "LH", "FSH", "HDL", "LDL", "ApoB", "Triglycerides", "Hematocrit", "Hemoglobin", "RBC", "Creatinine", "CystatinC", "eGFR", "BUN", "BloodPressure", "ALT", "AST"],
  },
  {
    id: "eq", name: "Boldenone", aka: "EQ, Equipoise", category: "Injectable AAS",
    effects: "Among the strongest at raising hematocrit/RBC; aromatizes about half as much as testosterone and a metabolite can drive estradiol low; gradually worsens lipids; suppresses LH/FSH.",
    monitor: ["TotalTestosterone", "FreeTestosterone", "Estradiol", "LH", "FSH", "Hemoglobin", "Hematocrit", "RBC", "HDL", "LDL", "ApoB", "Triglycerides", "BloodPressure", "Creatinine", "CystatinC"],
  },
  {
    id: "mast", name: "Drostanolone", aka: "Masteron, Mast", category: "Injectable AAS",
    effects: "Non-aromatizing DHT-derivative with mild anti-estrogen activity (can lower E2); lowers SHBG (raising free T of stacked compounds); shifts lipids negatively; high androgenic load (PSA, hair).",
    monitor: ["TotalTestosterone", "FreeTestosterone", "Estradiol", "SHBG", "LH", "FSH", "HDL", "LDL", "ApoB", "Triglycerides", "Hematocrit", "PSA", "BloodPressure"],
  },
  {
    id: "primo", name: "Methenolone", aka: "Primobolan, Primo", category: "Injectable AAS",
    effects: "Non-aromatizing DHT-derivative; milder overall; suppresses LH/FSH; injectable form relatively liver-friendly but still lowers HDL and raises LDL; mild hematocrit rise.",
    monitor: ["TotalTestosterone", "FreeTestosterone", "SHBG", "LH", "FSH", "HDL", "LDL", "ApoB", "Triglycerides", "Hematocrit", "ALT", "AST"],
  },

  /* ---- Oral AAS ---- */
  {
    id: "var", name: "Oxandrolone", aka: "Anavar, Var", category: "Oral AAS",
    effects: "Mild on the liver but a serious lipid offender — strongly crashes HDL and raises LDL/ApoB despite not aromatizing; suppresses the HPTA.",
    monitor: ["ALT", "AST", "GGT", "Bilirubin", "TotalCholesterol", "LDL", "HDL", "Triglycerides", "ApoB", "TotalTestosterone", "FreeTestosterone", "LH", "FSH", "Estradiol", "SHBG", "Hemoglobin", "Hematocrit", "RBC"],
  },
  {
    id: "dbol", name: "Methandrostenolone", aka: "Dianabol, Dbol", category: "Oral AAS",
    effects: "Markedly hepatotoxic and a strong lipid offender; aromatizes to methylestradiol — water retention and raised blood pressure; strongly suppresses the HPTA; raises hematocrit.",
    monitor: ["ALT", "AST", "GGT", "Bilirubin", "TotalCholesterol", "LDL", "HDL", "Triglycerides", "ApoB", "Estradiol", "BloodPressure", "TotalTestosterone", "FreeTestosterone", "LH", "FSH", "SHBG", "Hemoglobin", "Hematocrit", "RBC"],
  },
  {
    id: "winny", name: "Stanozolol", aka: "Winstrol, Winny", category: "Oral AAS",
    effects: "One of the worst HDL-crushers (strongly atherogenic); hepatotoxic (cholestatic jaundice, peliosis risk); does not aromatize; suppresses the HPTA.",
    monitor: ["ALT", "AST", "GGT", "Bilirubin", "TotalCholesterol", "LDL", "HDL", "Triglycerides", "ApoB", "TotalTestosterone", "FreeTestosterone", "LH", "FSH", "SHBG", "Hematocrit", "Hemoglobin", "BloodPressure"],
  },
  {
    id: "drol", name: "Oxymetholone", aka: "Anadrol, Drol, A-bombs", category: "Oral AAS",
    effects: "Among the most hepatotoxic AAS (cholestatic jaundice, peliosis, tumors); estrogenic via a non-aromatase route; powerfully raises RBC/Hgb/Hct (polycythemia risk); crashes HDL; suppresses the HPTA.",
    monitor: ["ALT", "AST", "GGT", "Bilirubin", "Hemoglobin", "Hematocrit", "RBC", "TotalCholesterol", "LDL", "HDL", "Triglycerides", "ApoB", "Estradiol", "TotalTestosterone", "FreeTestosterone", "LH", "FSH", "SHBG", "BloodPressure"],
  },
  {
    id: "sdrol", name: "Methyldrostanolone", aka: "Superdrol, Sdrol", category: "Oral AAS",
    effects: "One of the most hepatotoxic AAS (many liver-injury reports, high bilirubin) with frequent secondary kidney injury (raised creatinine); brutally crashes HDL; non-aromatizing; suppresses the HPTA.",
    monitor: ["ALT", "AST", "GGT", "Bilirubin", "TotalCholesterol", "LDL", "HDL", "Triglycerides", "ApoB", "Creatinine", "eGFR", "BUN", "LH", "FSH", "TotalTestosterone", "FreeTestosterone", "SHBG", "Hemoglobin", "Hematocrit", "BloodPressure"],
  },
  {
    id: "tbol", name: "Turinabol", aka: "Tbol, Oral Turinabol", category: "Oral AAS",
    effects: "Milder than Superdrol but still hepatotoxic and lipid-suppressive (lowers HDL, raises LDL/ApoB); non-aromatizing (no estradiol rise); suppresses the HPTA.",
    monitor: ["ALT", "AST", "GGT", "Bilirubin", "TotalCholesterol", "LDL", "HDL", "Triglycerides", "ApoB", "LH", "FSH", "TotalTestosterone", "FreeTestosterone", "SHBG", "Hemoglobin", "Hematocrit", "BloodPressure"],
  },

  /* ---- Growth / Peptide ---- */
  {
    id: "hgh", name: "HGH (Growth Hormone)", aka: "GH, Somatropin", category: "Growth / Peptide",
    effects: "Strongly raises IGF-1; diabetogenic (raises fasting glucose, insulin and HbA1c); can suppress thyroid markers; fluid retention with raised blood pressure.",
    monitor: ["IGF1", "Glucose", "HbA1c", "Insulin", "TSH", "FreeT3", "FreeT4", "BloodPressure", "HDL", "LDL"],
  },
  {
    id: "insulin", name: "Insulin", aka: "Humalog, Novolog, slin", category: "Growth / Peptide",
    effects: "Drives glucose into cells, lowering blood sugar. Acute, potentially fatal hypoglycemia is the dominant danger — needs real-time/CGM glucose monitoring, not just periodic labs.",
    monitor: ["Glucose", "HbA1c", "Insulin"],
  },
  {
    id: "igf1lr3", name: "IGF-1 LR3", aka: "Long R3 IGF-1", category: "Growth / Peptide",
    effects: "Raises effective IGF-1 with long activity; enhances muscle glucose uptake (hypoglycemia risk, especially fasted); chronic use can drive insulin resistance.",
    monitor: ["IGF1", "Glucose", "Insulin", "HbA1c"],
  },
  {
    id: "mk677", name: "MK-677", aka: "Ibutamoren, Nutrobal", category: "Growth / Peptide",
    effects: "GH secretagogue raising GH and IGF-1; diabetogenic (raises fasting glucose/insulin, HbA1c can rise); mild prolactin rise; fluid retention with possible BP rise.",
    monitor: ["IGF1", "Glucose", "HbA1c", "Insulin", "Prolactin", "BloodPressure"],
  },

  /* ---- SARMs ---- */
  {
    id: "rad140", name: "RAD-140", aka: "Testolone", category: "SARM",
    effects: "Suppresses LH/FSH and natural T, lowers SHBG, worsens HDL/LDL; hepatotoxic with published liver-injury case reports (severe jaundice); can raise hematocrit.",
    monitor: ["TotalTestosterone", "FreeTestosterone", "LH", "FSH", "Estradiol", "SHBG", "HDL", "LDL", "ALT", "AST", "Bilirubin", "Hematocrit"],
  },
  {
    id: "lgd", name: "LGD-4033", aka: "Ligandrol", category: "SARM",
    effects: "Dose-dependent suppression of testosterone, SHBG and HDL; suppresses LH/FSH; multiple biopsy-confirmed liver-injury case reports; can raise hematocrit.",
    monitor: ["TotalTestosterone", "FreeTestosterone", "LH", "FSH", "Estradiol", "SHBG", "HDL", "LDL", "ALT", "AST", "Bilirubin", "Hematocrit"],
  },
  {
    id: "ostarine", name: "Ostarine", aka: "MK-2866, Enobosarm", category: "SARM",
    effects: "Lowers testosterone and SHBG; suppresses LH/FSH (less consistently); worsens HDL/LDL; less hepatotoxic than RAD-140/LGD but enzymes still warrant monitoring.",
    monitor: ["TotalTestosterone", "FreeTestosterone", "LH", "FSH", "Estradiol", "SHBG", "HDL", "LDL", "ALT", "AST", "Hematocrit"],
  },
  {
    id: "yk11", name: "YK-11", aka: "Myostatin SARM", category: "SARM",
    effects: "Myostatin-affecting, methylated compound; dose-dependently suppresses the HPTA; can crash lipids; potential hepatotoxicity; very limited human data.",
    monitor: ["TotalTestosterone", "FreeTestosterone", "LH", "FSH", "Estradiol", "SHBG", "HDL", "LDL", "ALT", "AST", "Bilirubin", "Hematocrit"],
  },
  {
    id: "s23", name: "S23", aka: "", category: "SARM",
    effects: "One of the most suppressive SARMs (studied as a male contraceptive); strongly suppresses the HPTA; worsens lipids; largely preclinical safety data.",
    monitor: ["TotalTestosterone", "FreeTestosterone", "LH", "FSH", "Estradiol", "SHBG", "HDL", "LDL", "ALT", "AST", "Hematocrit"],
  },

  /* ---- Ancillaries ---- */
  {
    id: "ai", name: "Aromatase Inhibitor", aka: "Anastrozole, Arimidex, Aromasin, Exemestane", category: "Ancillary",
    effects: "Lowers estradiol (and secondarily raises LH/FSH/testosterone). Overuse crashes E2 — lowering HDL, harming bone density, libido and mood. Monitor E2 with a sensitive assay.",
    monitor: ["Estradiol", "TotalTestosterone", "LH", "FSH", "HDL", "LDL"],
  },
  {
    id: "nolva", name: "Tamoxifen", aka: "Nolvadex, SERM", category: "Ancillary",
    effects: "Raises LH, FSH and testosterone and blocks breast tissue (gyno/PCT). Estrogenic in the liver, so can substantially raise triglycerides and occasionally transaminases.",
    monitor: ["TotalTestosterone", "LH", "FSH", "Estradiol", "Triglycerides", "ALT", "AST"],
  },
  {
    id: "clomid", name: "Clomiphene", aka: "Clomid, SERM", category: "Ancillary",
    effects: "Raises LH, FSH and testosterone with a mild estradiol rise (PCT/restart). Can cause reversible visual disturbances and mood changes.",
    monitor: ["TotalTestosterone", "LH", "FSH", "Estradiol", "ALT", "AST", "Prolactin"],
  },
  {
    id: "hcg", name: "hCG", aka: "Human Chorionic Gonadotropin, Pregnyl", category: "Ancillary",
    effects: "Mimics LH to preserve testicular function/fertility; raises testosterone and increases aromatization to estradiol (often paired with an AI).",
    monitor: ["TotalTestosterone", "Estradiol", "LH", "FSH"],
  },
  {
    id: "caber", name: "Cabergoline", aka: "Caber, Dostinex", category: "Ancillary",
    effects: "Dopamine agonist that lowers elevated prolactin (e.g. from nandrolone/trenbolone) and can restore prolactin-suppressed testosterone. Use under medical guidance.",
    monitor: ["Prolactin", "TotalTestosterone", "LH"],
  },

  /* ---- Other ---- */
  {
    id: "clen", name: "Clenbuterol", aka: "Clen", category: "Other",
    effects: "Beta-2 agonist for fat loss (not a steroid); raises heart rate and blood pressure, can cause cardiac strain/arrhythmia; drives potassium into cells (hypokalemia) and raises blood glucose.",
    monitor: ["Potassium", "Glucose", "BloodPressure"],
  },
  {
    id: "t3", name: "T3 (Cytomel)", aka: "Liothyronine, Triiodothyronine", category: "Other",
    effects: "Thyroid hormone for fat loss; suppresses TSH, raises Free T3 and suppresses your own thyroid output (lowers Free T4). Overdosing causes a hyperthyroid state — tachycardia, arrhythmia, bone loss.",
    monitor: ["TSH", "FreeT3", "FreeT4", "BloodPressure"],
  },
  {
    id: "dnp", name: "DNP (2,4-Dinitrophenol)", aka: "Dinitrophenol", category: "Other",
    effects: "⚠ POTENTIALLY LETHAL with no antidote. Causes uncontrollable hyperthermia that can escalate to death within hours, plus hyperkalemia, acidosis, kidney and liver injury. Bloodwork CANNOT make it safe — the only safe choice is not to use it.",
    monitor: ["Potassium", "ALT", "AST", "Creatinine", "Glucose", "BloodPressure"],
  },
];

/* ===== INTERVENTIONS =====
   when: "high" | "low" | "any"  — which direction of result this advice applies to.
*/
const INTERVENTIONS = [
  {
    issue: "High LDL / Total Cholesterol / ApoB",
    markers: ["LDL", "TotalCholesterol", "ApoB"], when: "high",
    supplements: [
      "Soluble fiber / psyllium — ~10 g/day (~7 g soluble fiber) — lowers LDL ~5–7% and reduces non-HDL-C and ApoB; very safe.",
      "Plant sterols/stanols — ~2 g/day — lowers LDL ~7–10% (avoid in the rare sitosterolemia).",
      "Berberine — 500 mg 2–3×/day with meals — lowers LDL and ApoB; can cause GI upset and has many drug interactions.",
      "Bergamot polyphenols — 500–1000 mg/day — modest reduction; weaker evidence, adjunct only.",
      "Caution — red yeast rice contains lovastatin (a real statin) at uncontrolled doses with possible contaminants; a prescribed statin is the safer, dose-controlled choice.",
    ],
    lifestyle: [
      "Cut saturated fat and replace it with unsaturated fats — the single biggest dietary lever for LDL/ApoB.",
      "Add soluble fiber from food (oats/beta-glucan, legumes) and lose excess body fat.",
      "Aerobic exercise ≥150 min/week; a plant-forward dietary pattern.",
      "Reduce or stop oral 17-aa steroids, which raise LDL directly — largely reversible after cessation.",
    ],
    doctorNote: "ApoB is a better risk marker than LDL-C. If it stays high despite diet and supplements, talk to a doctor about statins (first-line), ezetimibe, or PCSK9 inhibitors. Don't stack red yeast rice with a statin. Markedly high LDL plus active oral AAS warrants cardiology input.",
  },
  {
    issue: "Low HDL",
    markers: ["HDL"], when: "low",
    supplements: [
      "No supplement reliably raises HDL in a way that lowers cardiovascular risk — HDL is more a marker than a target; don't chase it with pills.",
      "Caution — niacin can raise HDL but outcome trials showed no benefit and added harm (glucose intolerance, liver stress, flushing); not recommended for this.",
    ],
    lifestyle: [
      "Aerobic exercise ≥150 min/week — the most consistent non-drug HDL raiser.",
      "Lose excess weight and stop smoking (HDL often rises within ~3 weeks of quitting).",
      "Replace trans/refined carbs with unsaturated fats.",
      "Reduce/stop oral 17-aa steroids — the dominant driver of crushed HDL; recovers in ~6–10 weeks after stopping.",
    ],
    doctorNote: "Isolated low HDL isn't treated with drugs, because HDL-raising medications don't reduce cardiac events. Focus on overall risk (LDL/ApoB, triglycerides) and removing the offending oral compound; discuss your whole risk picture with a doctor.",
  },
  {
    issue: "High Triglycerides",
    markers: ["Triglycerides"], when: "high",
    supplements: [
      "Omega-3 (EPA+DHA) — 2–4 g/day of combined EPA+DHA (read the label, not total fish-oil weight) — lowers triglycerides ~20–30%.",
      "Berberine — 500 mg 2–3×/day — also lowers triglycerides modestly.",
      "Soluble fiber/psyllium and weight loss help modestly.",
    ],
    lifestyle: [
      "Cut alcohol — often the dominant driver; removing it can move the number dramatically.",
      "Cut refined carbs and added sugar (especially sugary drinks/fructose) — triglycerides are very carb-sensitive.",
      "Lose weight, do regular aerobic exercise, emphasize fish/unsaturated fats.",
    ],
    doctorNote: "Above ~500 mg/dL the pancreatitis risk rises and guidelines favour drug therapy (fibrates such as fenofibrate; prescription icosapent ethyl 4 g/day is the pharmaceutical omega-3). Above 1,000 is a medical urgency. For an AAS user, stopping the offending compound and alcohol are priorities alongside prompt care.",
  },
  {
    issue: "Elevated Liver Enzymes (ALT / AST / GGT / bilirubin)",
    markers: ["ALT", "AST", "GGT", "Bilirubin"], when: "high",
    supplements: [
      "TUDCA — ~250–500 mg/day (cholestatic-liver studies used ~750 mg/day) — a bile acid that reduces hepatocyte stress; best-supported for the cholestatic pattern oral AAS produce.",
      "Silymarin (milk thistle) — 140 mg standardized extract 2–3×/day — antioxidant; human evidence is weak/mixed but generally safe.",
      "NAC — 600 mg 1–3×/day — glutathione precursor; better for oxidative stress than for normalizing enzymes.",
    ],
    lifestyle: [
      "Discontinue/avoid oral 17-aa steroids — the highest-yield step for true AAS hepatotoxicity.",
      "Minimize or eliminate alcohol (GGT is alcohol-sensitive).",
      "If fatty liver is the driver, lose weight: ~5% reduces liver fat, ≥7–10% improves it and can normalize ALT/GGT.",
      "Retest after ~1 week off heavy lifting and orals, adding CK and GGT to separate muscle from liver.",
    ],
    doctorNote: "See a clinician for ALT/AST > 5× the upper limit, persistent 3–5× elevation, a rising cholestatic pattern (GGT/ALP/bilirubin up), or jaundice/dark urine/pale stool/right-upper-quadrant pain. Very high AST/ALT with very high CK and dark urine can mean rhabdomyolysis (emergency). Supplements don't replace stopping the offending oral.",
  },
  {
    issue: "High Hematocrit / Hemoglobin (polycythemia)",
    markers: ["Hematocrit", "Hemoglobin", "RBC"], when: "high",
    supplements: [
      "No supplement treats true AAS-induced erythrocytosis — the lever is the dose, not a pill.",
      "Hydration — harmless and sensible; avoids a falsely high reading from a concentrated sample, but doesn't treat real erythrocytosis.",
      "Caution — low-dose aspirin has no evidence base here and carries bleeding risk; that's a physician decision.",
    ],
    lifestyle: [
      "Lower the testosterone/AAS dose (or stop) — best-supported first step, since hematocrit is dose-dependent; more frequent smaller injections blunt the peaks.",
      "Therapeutic phlebotomy / blood donation can lower it acutely, but evidence is weak and repeated draws deplete iron — best as a temporary measure under a clinician.",
      "Treat sleep apnea and stop smoking — both independently raise hematocrit.",
    ],
    doctorNote: "Hematocrit > 54% (or hemoglobin > 18) — guidelines recommend withholding/reducing testosterone for clot/stroke risk. Seek urgent care for severe headache, visual changes, chest pain, breathlessness, one-sided leg swelling, or stroke signs (face droop, arm weakness, speech trouble). Phlebotomy and any antiplatelet decision should be physician-directed.",
  },
  {
    issue: "High Blood Pressure",
    markers: ["BloodPressure"], when: "high",
    supplements: [
      "Magnesium — ~300–400 mg/day elemental — a modest effect (~−3/−2 mmHg), mainly if you're low/deficient.",
      "Potassium — best from food (~3,500–4,700 mg/day); supplements only under medical supervision because of hyperkalemia/arrhythmia risk, especially with kidney issues.",
    ],
    lifestyle: [
      "DASH-style diet plus sodium reduction (< 2,300 mg/day, ideally ~1,500) — one of the most effective single levers.",
      "Aerobic exercise ~150 min/week (~−5 to −7 mmHg); avoid heavy breath-holding sets, which spike BP acutely.",
      "Lose body fat (~1 mmHg per kg) and cut alcohol.",
      "Reduce/stop the AAS or lower the dose and manage high hematocrit — the most direct levers for drug-driven BP.",
    ],
    doctorNote: "Above 180/120 WITH chest pain, breathlessness, severe headache, vision changes or neurological symptoms = call emergency services. Asymptomatic > 180/110 needs urgent same/next-day contact. Persistent ≥130/80 despite lifestyle change needs medication — AAS users frequently do, because lifestyle alone can't offset the drug effect.",
  },
  {
    issue: "High Estradiol (before reaching for an AI)",
    markers: ["Estradiol"], when: "high",
    supplements: [
      "Evidence for lowering estradiol with supplements is genuinely weak — fat loss and dose reduction do the heavy lifting.",
      "DIM — ~100–200 mg/day — shifts estrogen metabolism, but changes metabolite ratios more than it reliably lowers serum E2.",
      "Calcium-D-glucarate — ~500–1,500 mg/day — aids estrogen elimination; mechanistic only, no good human data in men.",
      "Zinc — ~15–30 mg/day (avoid > 40 mg/day long-term) — may reduce aromatase only if you're actually zinc-deficient.",
    ],
    lifestyle: [
      "Reduce body fat — fat tissue aromatizes testosterone to estrogen, so less fat means less conversion.",
      "Lower the testosterone/AAS dose — directly reduces the substrate available to aromatize.",
      "Limit alcohol (it impairs estrogen clearance); plenty of fiber and cruciferous vegetables.",
    ],
    doctorNote: "Don't crush estradiol — E2 drives bone health, libido and mood in men (~20–30 pg/mL is a commonly cited functional floor). A prescribed AI (e.g., anastrozole) is appropriate only when E2 is clearly and persistently high on a sensitive assay AND you have estrogenic symptoms (gyno, water retention, nipple tenderness) that don't resolve with fat loss and dose reduction — titrated and monitored by a clinician.",
  },
  {
    issue: "High Prolactin",
    markers: ["Prolactin"], when: "high",
    supplements: [
      "Vitamin B6 (pyridoxine) — ~100–300 mg/day short-term — supports dopamine, which suppresses prolactin; keep it modest and time-limited, as chronic high-dose B6 can cause nerve damage.",
      "Vitamin E has no solid evidence for lowering prolactin — don't rely on it.",
    ],
    lifestyle: [
      "Reduce or stop 19-nor compounds (nandrolone/Deca, trenbolone), whose progestin activity drives prolactin up — the most direct fix.",
      "Avoid excess alcohol; treat any contributing hypothyroidism; manage stress.",
      "Ensure a fasting, rested draw and ask the lab about macroprolactin for borderline values.",
    ],
    doctorNote: "Get a workup for genuine elevation — especially > 100 ng/mL or any elevation with low libido, ED, gyno/galactorrhea, or headaches/vision changes. Markedly high levels suggest a prolactinoma needing a pituitary MRI. Cabergoline is the standard prescription but must be diagnosed, titrated and monitored — not self-prescribed.",
  },
  {
    issue: "Impaired Glucose / High HbA1c / Insulin Resistance",
    markers: ["Glucose", "HbA1c", "Insulin"], when: "high",
    supplements: [
      "Berberine — 500 mg 2–3×/day with meals — the best-supported botanical; HbA1c reductions ~0.6–0.7% and improved insulin sensitivity (GI upset, drug interactions).",
      "Myo-inositol — 2 g twice daily — lowers insulin and insulin resistance; well tolerated.",
      "Magnesium — ~250–365 mg/day elemental — improves fasting glucose/insulin, especially if deficient.",
      "Cinnamon — weak evidence, ~1–2 g/day Ceylon (not Cassia) — small, inconsistent effect; not a primary agent.",
    ],
    lifestyle: [
      "Lose body fat (reduce visceral fat) — the highest-leverage lever for insulin sensitivity.",
      "Combine resistance training with aerobic/zone-2 cardio; take post-meal walks.",
      "Lower-glycemic whole-food diet; minimize refined carbs and sugary drinks; time carbs around training.",
      "Be aware GH (and some AAS) directly cause insulin resistance — cycling off is often the most effective step.",
    ],
    doctorNote: "See a doctor for fasting glucose ≥100 or HbA1c ≥5.7% (confirmed): metformin is the appropriate first-line prescription. Urgent care for marked-hyperglycemia symptoms (excess thirst/urination, blurred vision, weight loss) or glucose > 250. Misusing insulin to 'control blood sugar' is dangerous and can cause fatal hypoglycemia.",
  },
  {
    issue: "Elevated Creatinine / Reduced eGFR (kidney strain)",
    markers: ["Creatinine", "eGFR", "BUN", "CystatinC"], when: "any",
    supplements: [
      "Creatine monohydrate is NOT nephrotoxic in healthy kidneys — but it (plus high muscle mass and high-protein diets) raises creatinine and lowers estimated eGFR without real damage. Disclose it; consider holding it ~3 weeks before re-testing.",
      "There's no supplement to 'add' for kidney strain — management is mostly removals (see lifestyle).",
      "Ask for a cystatin-C-based eGFR — it's unaffected by muscle mass/creatine and is the better marker for muscular users.",
    ],
    lifestyle: [
      "Stay well hydrated (dehydration transiently raises creatinine).",
      "Control blood pressure — the #1 protective lever; uncontrolled hypertension (common with AAS) damages kidneys.",
      "Avoid chronic high-dose NSAIDs (ibuprofen, naproxen) and be cautious with high-stimulant pre-workouts.",
      "Keep protein reasonable rather than extreme; disclose all PEDs, since AAS can genuinely injure kidneys.",
    ],
    doctorNote: "Confirm with cystatin C and a urine albumin-to-creatinine ratio before assuming real disease — proteinuria is the key sign of true damage. See a nephrologist for persistent eGFR < 30, heavy proteinuria, or abnormal markers over 3+ months. Real proteinuria plus rising creatinine in an AAS user is a red flag to stop and seek care.",
  },
  {
    issue: "High hs-CRP / Systemic Inflammation",
    markers: ["CRP"], when: "high",
    supplements: [
      "Omega-3 (EPA+DHA) — 1–3 g/day combined — the best-supported supplement; consistently lowers CRP.",
      "Curcumin — ~500–1,000 mg/day, bioavailability-enhanced (with piperine or as a phytosome) — significant CRP reduction, especially when baseline is high.",
    ],
    lifestyle: [
      "Lose visceral fat — the biggest lever; fat tissue secretes inflammatory cytokines.",
      "Regular aerobic + resistance exercise, but test CRP when rested (training transiently raises it).",
      "Mediterranean-style anti-inflammatory diet; limit refined carbs, processed meat and added sugar.",
      "Limit alcohol, don't smoke, prioritize sleep.",
    ],
    doctorNote: "hs-CRP gauges chronic cardiovascular risk (< 1 low, 1–3 average, > 3 higher). A value > 10 mg/L — or a sudden rise with fever/pain/malaise — suggests an acute problem (infection, clot) and needs prompt evaluation, not supplements. Persistent unexplained elevation should be worked up by a physician.",
  },
  {
    issue: "Low Vitamin D",
    markers: ["VitaminD"], when: "low",
    supplements: [
      "Vitamin D3 — 1,000–2,000 IU/day maintenance (3,000–6,000 IU/day if obese or malabsorbing); dose to your 25-OH-D level.",
      "Documented deficiency (under guidance): ~6,000 IU/day or 50,000 IU weekly for 8 weeks, then maintenance.",
      "Vitamin K2 (MK-7) — ~90–180 mcg/day — helps direct calcium to bone (supportive evidence).",
      "Magnesium — ~200–400 mg/day — required to activate vitamin D; deficiency blunts the response.",
    ],
    lifestyle: [
      "Sensible sun (UVB) exposure drives your own synthesis (unreliable by latitude/season/skin tone).",
      "Eat fatty fish (salmon, mackerel, sardines), egg yolks and fortified dairy/alternatives.",
      "Test, don't guess — check 25-OH-D, dose to it, and re-test after ~8–12 weeks.",
    ],
    doctorNote: "Targets: deficiency < 20, insufficiency 21–29, sufficiency 30–100 ng/mL (practical target ~30–50). Confirm by lab before high-dose loading, and get guidance in kidney disease, hyperparathyroidism or sarcoidosis. Routine upper limit ~4,000 IU/day; don't chronically mega-dose without testing.",
  },
];
