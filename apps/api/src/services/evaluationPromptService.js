import { textGenerationPrompts } from './prompts/textGenerationPrompts.js';
import db from '../../models/index.js';
const { EvaluationPrompt, EvaluatorMetric } = db;

/**
 * Default evaluation prompts to be created for new companies
 */
const defaultEvaluationPrompts = [
  // Existing prompts from textGenerationPrompts.js
  ...textGenerationPrompts.evaluators.map(evaluator => ({
    key: evaluator.key,
    name: evaluator.type,
    prompt: `${evaluator.system}\n\n---\n\n${evaluator.user}`,
  })),
  
  // New hallucination evaluator
  {
    key: 'hallucination',
    name: 'Hallucination & Factual Accuracy Evaluation',
    prompt: `You are an expert evaluator of **factual correctness** and **hallucinations** in generated text. Your job is to verify that all factual claims in the output are **100% accurate and grounded in the input**, and that no hallucinated or fabricated content appears.

---

## ✅ What to Evaluate

- **Factual Accuracy**: Ensure every statement in the output **matches or is supported by the prompt, user input, or provided reference**.
- **Hallucinations**: Penalize any **fabricated or unsupported** names, dates, places, numbers, or facts.
- **Misrepresentation**: Catch subtle errors — incorrect paraphrasing, changed quantities, or factual distortions.

---

## ❌ What NOT to Evaluate

🚫 **Do NOT evaluate formatting, punctuation, or number style**  
- Ignore commas, decimal separators, units, or text styling unless explicitly required.  
- Example: "163,400 COP" is equivalent to "163400 COP" unless the prompt explicitly states formatting rules.

🚫 **Do NOT evaluate fluency, grammar, coherence, tone, or sentence structure**.

🚫 **Do NOT penalize for missing info unless the prompt explicitly requires it**.

---

## 🧪 Evaluation Steps

### Step 1: Fact Check
- Compare output facts to the original input.
- Confirm names, values, locations, relationships, and references are **accurate** and **not invented**.

### Step 2: Detect Hallucinations
- Look for details that **do not exist** in the input.
- Even minor fabrications are considered hallucinations.

### Step 3: Score
| **Score** | **Criteria** |
|-----------|--------------|
| **7–10** | Fully factually correct. No hallucinated details. |
| **5–6** | One or two minor factual errors. |
| **4–5** | Several factual problems. |
| **0–3** | Major inaccuracies or hallucinations throughout.

⚠️ **If even one hallucinated or factually wrong statement exists, the score must be ≤6.**

---

### Example:

- Input: "The coffee maker costs 163400 COP."
- Output: "The coffee maker costs 163,400 COP." → ✅ This is **factually correct**. The number formatting **must not be penalized**.

---

### 🔍 Evaluate factual accuracy only:
- Check if each fact is correct and based on the input.
- Do **not** penalize for formatting, number separators, punctuation, or phrasing style.

---

### ✅ Scoring:
| **Score** | **Meaning** |
|-----------|-------------|
| **7–10** | All facts are accurate. No hallucinations. |
| **5–6** | One or two minor factual errors. |
| **4–5** | Moderate factual issues. |
| **0–3** | Severe hallucinations or incorrect facts.

---

❗ If the output **fabricates or distorts any fact**, the score must be **≤6**.  
❗ If the issue is **only formatting** (e.g., comma vs. no comma in a number), **do not treat it as an error**.

---

### 📦 Return JSON:
{
  "score": (0–10),
  "analysis": "Short summary of any factual inaccuracies.",
  "errors": ["List only real factual errors or hallucinations."]
}`
  }
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
          companyId: companyId
        }
      });
      
      if (!metric) {
        metric = await EvaluatorMetric.create({
          name: promptTemplate.key,
          description: promptTemplate.name,
          isGlobal: false,
          companyId: companyId,
          createdAt: new Date(),
          updatedAt: new Date()
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
        updatedAt: new Date()
      });
      
      createdPrompts.push(evaluationPrompt);
    }
    
    console.log(`Created ${createdPrompts.length} default evaluation prompts for company ${companyId}`);
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
        { association: 'defaultIntegrationToken' }
      ],
      order: [['createdAt', 'ASC']]
    });
  } catch (error) {
    console.error('Error fetching company evaluation prompts:', error);
    throw error;
  }
} 