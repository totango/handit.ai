// Migration to create default evaluator metrics and evaluation prompts for existing companies

export const up = async (queryInterface) => {
  const now = new Date();
  
  // Get all existing companies
  const [companies] = await queryInterface.sequelize.query(
    `SELECT id FROM "Companies" WHERE deleted_at IS NULL`
  );
  
  // Default evaluator metrics for text generation
  const defaultMetrics = [
    {
      name: 'correctness',
      description: 'Correctness Evaluation',
    },
    {
      name: 'coherence',
      description: 'Coherence Evaluation',
    },
    {
      name: 'format_adherence',
      description: 'Formatting Evaluation',
    },
    {
      name: 'hallucination',
      description: 'Hallucination & Factual Accuracy Evaluation',
    },
  ];

  // Evaluation prompt templates
  const promptTemplates = {
    correctness: `You are an expert evaluator of **text generation accuracy**, responsible for verifying whether the generated text strictly follows the **System Prompt's rules**, the **User Input's content**, and maintains factual correctness.

## **Your Role:**
- **Evaluate only the factual accuracy of the generated text**—do not assess coherence, formatting, or style.
- **Check for factual correctness**—the output should not introduce false information, contradictions, or hallucinations.
- **Compare the generated text to the user input, reference materials, or task-specific constraints** to detect **misinterpretations, contradictions, or fabrications**.
- **Do not infer the LLM's reasoning**—only assess whether the output is **factually accurate**.
- **Strictly penalize factual inaccuracies**—even minor distortions can reduce correctness.

---

### **Return a structured JSON response** in the following format:

{
  "score": (score from 0-10),
  "analysis": "Concise summary of the evaluation focusing strictly on accuracy.",
  "errors": ["List of errors"]
}`,

    coherence: `You are an expert evaluator of **text generation coherence**, responsible for verifying whether the generated text is **logically structured, internally consistent, and maintains a clear, natural flow of ideas**.

## **Your Role:**
- **Focus only on coherence**—do not assess factual accuracy or formatting.
- **Check for logical consistency**—the output should not contain contradictions or abrupt topic shifts.
- **Ensure smooth flow**—the text should be easy to follow and well-organized.
- **Strictly penalize disjointed or nonsensical text**—even minor disruptions can reduce coherence.

---

Return a structured JSON response with your assessment.

{
  "score": (score from 0-10),
  "analysis": "Concise summary of the evaluation focusing strictly on accuracy.",
  "errors": ["List of errors"]
}`,

    format_adherence: `You are an expert evaluator of **text generation formatting and adherence to structural guidelines**, responsible for verifying whether the generated text follows the **System Prompt's required format, style, and structural rules**.

## **Your Role:**
- **Focus only on formatting**—do not assess factual accuracy or coherence.
- **Check if the output follows the required structure**—such as paragraphs, lists, tables, or predefined text formats.
- **Verify compliance with grammar, punctuation, and stylistic consistency**.
- **Strictly penalize outputs that deviate from the expected format** unless flexibility is explicitly allowed.

---

Return a structured JSON response with your assessment.

{
  "score": (score from 0-10),
  "analysis": "Concise summary of the evaluation focusing strictly on accuracy.",
  "errors": ["List of errors"]
}`,

    hallucination: `You are an expert evaluator of **factual correctness** and **hallucinations** in generated text. Your job is to verify that all factual claims in the output are **100% accurate and grounded in the input**, and that no hallucinated or fabricated content appears.

---

## ✅ What to Evaluate

- **Factual Accuracy**: Ensure every statement in the output **matches or is supported by the prompt, user input, or provided reference**.
- **Hallucinations**: Penalize any **fabricated or unsupported** names, dates, places, numbers, or facts.
- **Misrepresentation**: Catch subtle errors — incorrect paraphrasing, changed quantities, or factual distortions.

---

### 📦 Return JSON:
{
  "score": (0–10),
  "analysis": "Short summary of any factual inaccuracies.",
  "errors": ["List only real factual errors or hallucinations."]
}`
  };

  // Create metrics and evaluation prompts for each existing company
  for (const company of companies) {
    for (const metric of defaultMetrics) {
      // Check if metric already exists for this company
      const [existingMetric] = await queryInterface.sequelize.query(
        `SELECT id FROM "EvaluatorMetrics" WHERE name = '${metric.name}' AND company_id = ${company.id}`
      );
      
      let metricId;
      if (existingMetric.length === 0) {
        // Create the metric
        const [createdMetric] = await queryInterface.sequelize.query(`
          INSERT INTO "EvaluatorMetrics" (name, description, is_global, company_id, created_at, updated_at)
          VALUES ('${metric.name}', '${metric.description}', false, ${company.id}, '${now.toISOString()}', '${now.toISOString()}')
          RETURNING id
        `);
        metricId = createdMetric[0].id;
      } else {
        metricId = existingMetric[0].id;
      }

      // Check if evaluation prompt already exists for this company and metric
      const [existingPrompt] = await queryInterface.sequelize.query(
        `SELECT id FROM "EvaluationPrompts" WHERE name = '${metric.description}' AND company_id = ${company.id}`
      );

      if (existingPrompt.length === 0) {
        // Create the evaluation prompt
        await queryInterface.sequelize.query(`
          INSERT INTO "EvaluationPrompts" (name, prompt, metric_id, company_id, is_global, created_at, updated_at)
          VALUES ('${metric.description}', $prompts$${promptTemplates[metric.name]}$prompts$, ${metricId}, ${company.id}, false, '${now.toISOString()}', '${now.toISOString()}')
        `);
      }
    }
  }
};

export const down = async (queryInterface) => {
  // Remove the default metrics and evaluation prompts for all companies
  const metricNames = ['correctness', 'coherence', 'format_adherence', 'hallucination'];
  
  // Remove evaluation prompts first (due to foreign key constraints)
  await queryInterface.sequelize.query(`
    DELETE FROM "EvaluationPrompts" 
    WHERE name IN ('Correctness Evaluation', 'Coherence Evaluation', 'Formatting Evaluation', 'Hallucination & Factual Accuracy Evaluation')
    AND is_global = false
  `);

  // Remove metrics
  await queryInterface.sequelize.query(`
    DELETE FROM "EvaluatorMetrics" 
    WHERE name IN (${metricNames.map(name => `'${name}'`).join(', ')})
    AND is_global = false
  `);
}; 