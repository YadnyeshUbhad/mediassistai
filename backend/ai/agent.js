/**
 * agent.js — MedAssist AI Agent (Core Brain)
 * Orchestrates: NLP extraction → Validation → AI instruction generation
 */

const { extractEntities } = require("./nlp");
const { validatePrescription } = require("./validator");
const { generatePatientInstructions } = require("./genai");

/**
 * Full agent pipeline: text → entities → validation → instructions
 * @param {string} text - Raw doctor speech / transcript
 * @returns {Promise<{ entities: object[], validation: object, instructions: string }>}
 */
async function processConsultation(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Valid text input is required for agent processing.");
  }

  console.log("🧠 Agent: Starting consultation processing...");

  // Step 1: Extract medical entities using NLP
  const entities = extractEntities(text);
  console.log(`📝 Agent: Extracted ${entities.length} entity/entities`);

  // Step 2: Validate prescription
  const validation = validatePrescription(entities);
  console.log(`✅ Agent: Validation complete — isValid: ${validation.isValid}, warnings: ${validation.warnings.length}`);

  // Step 3: Generate patient-friendly instructions using AI
  const instructions = await generatePatientInstructions(entities, text);
  console.log("💬 Agent: Instructions generated");

  return {
    entities,        // Array of { medicine, dosage, frequency, duration }
    validation,      // { isValid: boolean, warnings: string[] }
    instructions,    // Patient-friendly string
  };
}

module.exports = { processConsultation };
