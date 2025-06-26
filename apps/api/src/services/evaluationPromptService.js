import { textGenerationPrompts } from './prompts/textGenerationPrompts.js';
import db from '../../models/index.js';
const { EvaluationPrompt, EvaluatorMetric } = db;

/**
 * Default evaluation prompts to be created for new companies
 */
const defaultEvaluationPrompts = [
  // Existing prompts from textGenerationPrompts.js
  ...textGenerationPrompts.evaluators.map((evaluator) => ({
    key: evaluator.key,
    name: evaluator.type,
    prompt: `${evaluator.system}\n\n---\n\n${evaluator.user}`,
  })),

  // New hallucination evaluator
  {
    key: 'hallucination',
    name: 'Hallucination & Factual Accuracy Evaluation',
    prompt: `You are an expert evaluator of **factual correctness** and **hallucinations** in generated text. Your job is to verify that all factual claims in the output are **100% accurate and grounded in the input**, and that no hallucinated or fabricated content appears.\n\n---\n\n## ✅ What to Evaluate\n\n- **Factual Accuracy**: Every statement in the output must **match or be clearly supported by the prompt, user input, or provided reference**.\n- **Hallucinations**: Penalize any **invented** or **unsupported** names, dates, numbers, facts, or specific claims **not grounded** in the input.\n- **Misrepresentation**: Catch **subtle distortions** such as wrong quantities, changed facts, or incorrect paraphrasing.\n\n🟢 **Natural elaborations or polite extensions** (e.g., “¿Y tú?”, “¿Puedo ayudarte?”) are **not hallucinations**, **unless they introduce fabricated or misleading facts**.\n\n---\n\n## ❌ What NOT to Evaluate\n\nDo **NOT** evaluate:\n\n- Formatting, punctuation, units, or number style (e.g., commas in numbers)\n- Grammar, tone, sentence structure, or fluency\n- Whether the response is too short or too long\n- Whether the answer is “direct enough” unless factual accuracy is compromised\n\nDo **NOT** penalize:\n\n- For polite elaboration or non-factual additions like greetings, unless explicitly banned by the prompt\n\n---\n\n## 🧪 Evaluation Steps\n\n### Step 1: Fact Check\n\n- Compare facts in the output against the input.\n- Confirm names, values, locations, relationships, and references are accurate and not invented.\n\n### Step 2: Detect Hallucinations\n\n- Look for **concrete facts** (names, places, dates, numbers, attributions) that do **not appear** in the input or references.\n- **Conversational phrases, follow-up questions, or greetings are allowed** if they don’t invent facts.\n\n### Step 3: Score\n\n| Score | Criteria |\n|-------|----------|\n| 9–10  | All facts are accurate. No hallucinated details. |\n| 6–8   | One or two minor factual errors. |\n| 4–5   | Several factual problems. |\n| 0–3   | Major inaccuracies or hallucinations throughout. |\n\n⚠️ If even one fabricated or incorrect fact exists, the score must be **≤6**.\n\n---\n\n## ✨ Clarifying Example\n\n- Input: \"¿Cómo estás?\"\n- Output: \"¡Hola! Estoy bien, gracias. ¿Y tú? ¿En qué puedo ayudarte hoy?\"\n\n→ ✅ This is **fully accurate**. No facts are incorrect. The additional sentences are conversational, not factual hallucinations.\n\n---\n\n## 📦 Return JSON:\n\n{\n  \"score\": (0–10),\n  \"analysis\": \"Short summary of any factual inaccuracies.\",\n  \"errors\": [\"List only real factual errors or hallucinations.\"]\n}\n`,
  },
];

/**
 * Creates default evaluation prompts for a new company
 * @param {number} companyId - The ID of the newly created company
 * @returns {Promise<Array>} Array of created evaluation prompts
 */
export async function createDefaultEvaluationPrompts(companyId) {
  try {
    const createdPrompts = [];

    for (const promptTemplate of defaultEvaluationPrompts) {
      // Find or create the metric for this evaluator FOR THIS COMPANY
      let metric = await EvaluatorMetric.findOne({
        where: {
          name: promptTemplate.key,
          companyId: companyId,
        },
      });

      if (!metric) {
        metric = await EvaluatorMetric.create({
          name: promptTemplate.key,
          description: promptTemplate.name,
          isGlobal: false,
          companyId: companyId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // Create the evaluation prompt for this company
      const evaluationPrompt = await EvaluationPrompt.create({
        name: promptTemplate.name,
        prompt: promptTemplate.prompt,
        metricId: metric.id,
        companyId: companyId,
        isGlobal: false,
        // defaultIntegrationTokenId will be null initially - user needs to set it up
        defaultIntegrationTokenId: null,
        defaultProviderModel: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      createdPrompts.push(evaluationPrompt);
    }

    return createdPrompts;
  } catch (error) {
    console.error('Error creating default evaluation prompts:', error);
    throw error;
  }
}

/**
 * Gets all evaluation prompts for a company
 * @param {number} companyId - The company ID
 * @returns {Promise<Array>} Array of evaluation prompts
 */
export async function getCompanyEvaluationPrompts(companyId) {
  try {
    return await EvaluationPrompt.findAll({
      where: { companyId },
      include: [
        { association: 'metric' },
        { association: 'defaultIntegrationToken' },
      ],
      order: [['createdAt', 'ASC']],
    });
  } catch (error) {
    console.error('Error fetching company evaluation prompts:', error);
    throw error;
  }
}
