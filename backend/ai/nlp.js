/**
 * nlp.js — Medical NLP entity extractor
 * Extracts medicine names, dosages, frequencies, and durations
 * from doctor speech/transcript text using rule-based regex patterns.
 */

// Common medicine keywords for detection
const MEDICINE_KEYWORDS = [
  "paracetamol","amoxicillin","amoxiclave","ibuprofen","aspirin","metformin",
  "amlodipine","atorvastatin","omeprazole","pantoprazole","cetirizine",
  "salbutamol","azithromycin","ciprofloxacin","doxycycline","metronidazole",
  "clopidogrel","losartan","ramipril","telmisartan","enalapril","lisinopril",
  "furosemide","spironolactone","hydrochlorothiazide","warfarin","enoxaparin",
  "insulin","glibenclamide","glimepiride","sitagliptin","vildagliptin",
  "prednisolone","dexamethasone","betamethasone","hydrocortisone",
  "codeine","tramadol","morphine","diclofenac","naproxen","etoricoxib",
  "pantoprazole","rabeprazole","esomeprazole","ranitidine","famotidine",
  "ondansetron","domperidone","metoclopramide","loperamide",
  "cetirizine","loratadine","fexofenadine","chlorpheniramine",
  "amiodarone","digoxin","bisoprolol","carvedilol","metoprolol",
  "gabapentin","pregabalin","phenytoin","carbamazepine","valproate",
  "sertraline","fluoxetine","escitalopram","duloxetine","venlafaxine",
  "alprazolam","diazepam","clonazepam","lorazepam","zolpidem",
  "calcium","vitamin","iron","folic","zinc","magnesium","potassium",
  "sumatriptan","rizatriptan","eletriptan",
];

const FREQUENCY_PATTERNS = [
  { regex: /once\s+(?:a\s+)?daily|once\s+per\s+day|1\s*(?:time|x)\s*(?:a\s+)?day/i, label: "Once daily" },
  { regex: /twice\s+(?:a\s+)?daily|twice\s+per\s+day|2\s*(?:times?|x)\s*(?:a\s+)?day|bid/i, label: "Twice daily" },
  { regex: /three\s+times\s+(?:a\s+)?day|thrice\s+daily|3\s*(?:times?|x)\s*(?:a\s+)?day|tid/i, label: "Three times daily" },
  { regex: /four\s+times\s+(?:a\s+)?day|4\s*(?:times?|x)\s*(?:a\s+)?day|qid/i, label: "Four times daily" },
  { regex: /every\s+(?:4|four)\s+hours/i, label: "Every 4 hours" },
  { regex: /every\s+(?:6|six)\s+hours/i, label: "Every 6 hours" },
  { regex: /every\s+(?:8|eight)\s+hours/i, label: "Every 8 hours" },
  { regex: /every\s+(?:12|twelve)\s+hours/i, label: "Every 12 hours" },
  { regex: /as\s+needed|when\s+required|prn/i, label: "As needed" },
  { regex: /at\s+bedtime|at\s+night|at\s+hs/i, label: "At bedtime" },
  { regex: /with\s+meals|after\s+meals|before\s+meals/i, label: "With meals" },
  { regex: /morning\s+and\s+evening|morning\s+&\s+evening/i, label: "Morning and evening" },
];

const DURATION_PATTERNS = [
  { regex: /(\d+)\s*days?/i, template: (m) => `${m[1]} day${m[1] === "1" ? "" : "s"}` },
  { regex: /(\d+)\s*weeks?/i, template: (m) => `${m[1]} week${m[1] === "1" ? "" : "s"}` },
  { regex: /(\d+)\s*months?/i, template: (m) => `${m[1]} month${m[1] === "1" ? "" : "s"}` },
  { regex: /ongoing|indefinitely|long[-\s]term/i, template: () => "Ongoing" },
  { regex: /per\s+episode|when\s+needed/i, template: () => "Per episode" },
];

const DOSAGE_REGEX = /(\d+(?:\.\d+)?)\s*(?:mg|mcg|ml|mg\/ml|iu|units?|g|gm|mmol|mEq)/gi;

/**
 * Extract medical entities from free-form text
 * @param {string} text
 * @returns {{ medicine: string, dosage: string, frequency: string, duration: string }[]}
 */
function extractEntities(text) {
  if (!text) return [];

  const lower = text.toLowerCase();
  const results = [];
  const foundMedicines = [];

  // 1. Find medicine names
  for (const med of MEDICINE_KEYWORDS) {
    if (lower.includes(med.toLowerCase())) {
      foundMedicines.push({ name: med.charAt(0).toUpperCase() + med.slice(1), index: lower.indexOf(med) });
    }
  }

  if (foundMedicines.length === 0) {
    // Fallback: try to pick any capitalized medical-sounding word near numbers
    const capWords = text.match(/\b[A-Z][a-z]{3,}(?:\s+[A-Z][a-z]+)?\s+\d/g);
    if (capWords) {
      foundMedicines.push(...capWords.map((w) => ({ name: w.replace(/\s+\d.*/, "").trim(), index: 0 })));
    }
  }

  // 2. Extract dosages from entire text
  const allDosages = [...text.matchAll(DOSAGE_REGEX)].map((m) => m[0]);

  // 3. Extract frequency
  let frequency = "";
  for (const fp of FREQUENCY_PATTERNS) {
    if (fp.regex.test(text)) { frequency = fp.label; break; }
  }

  // 4. Extract duration
  let duration = "";
  for (const dp of DURATION_PATTERNS) {
    const m = text.match(dp.regex);
    if (m) { duration = dp.template(m); break; }
  }

  // 5. Combine — one entity per found medicine
  foundMedicines.forEach((med, i) => {
    results.push({
      medicine:  med.name,
      dosage:    allDosages[i] || allDosages[0] || "As prescribed",
      frequency: frequency || "As directed",
      duration:  duration  || "As directed",
    });
  });

  // If medicines found but no entities built, return at least one generic
  if (results.length === 0 && text.trim()) {
    results.push({
      medicine:  "Medication",
      dosage:    allDosages[0] || "As prescribed",
      frequency: frequency || "As directed",
      duration:  duration  || "As directed",
    });
  }

  return results;
}

module.exports = { extractEntities };
