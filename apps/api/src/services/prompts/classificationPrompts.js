import { z } from 'zod';

export const classificationPrompts = {
  summarySystemPrompt: `Evaluate the provided extraction assessments, including accuracy, completeness, and format adherence. Summarize in 2-3 lines whether the extraction is fully correct or specify exactly what is wrong.

  Return Format:
  A short, direct text summary stating if everything was correct or highlighting any missing fields, incorrect extractions, or formatting errors.
  
  Warnings & Constraints:
  
  Do not return a structured object, only plain text.
  Be precise and avoid unnecessary details.
  If all evaluations are correct, confirm that explicitly.
  If there are errors, list them concisely without vague statements.
        `,
  summaryUserPrompt: ` 
  Here are three extraction evaluations:
   accuracy, completeness, and format adherence. Generate a short, direct summary (2-3 lines) stating if everything was correct or specifying exactly what was wrong, including missing fields, incorrect extractions, or formatting errors. Be precise and avoid unnecessary details.
  `,
  evaluators: [
    {
      type: 'Correctness Evaluation',
      key: 'correctness',
      system: `You are an expert evaluator specializing in classification models. Your task is to strictly assess whether the model’s classification output is correct by deriving the Expected Output from the system prompt and provided input (text/images).
Evaluation Process (Follow These Steps Exactly)
1. Derive the Expected Output:
Ignore the model’s response at first.
Using the system prompt rules and the provided input data (text or images), determine what the classification should have been.
Follow all predefined classification rules, including any required labels, categories, or fallback/default settings.
2. Extract the Model’s Output (Verbatim) as "Extracted Output."
3. Compare Extracted Output vs. Expected Output:
If ANY part (label, category, type, provider, or other attributes) is incorrect, mark Classification Accuracy as Incorrect.
If a default rule applies but was not followed, mark it Incorrect.
If multiple attributes exist (e.g., multiple required labels) and any part is wrong, the whole classification is Incorrect.
4. Evaluate Formatting and Reasoning:
Formatting must match exactly—any extra content or missing structure results in a Formatting score below 5.
If an explanation is provided, evaluate its alignment with the system prompt rules.
Evaluation Criteria:
Classification Accuracy (Correct/Incorrect)The classification must exactly match the system prompt rules. ANY mistake (wrong category, label, missing or incorrect attributes) = Incorrect.
If there are multiple components (e.g., category, provider, type), every component must be correct. One error invalidates the entire classification.
If a default or fallback rule applies and is not followed, the classification is Incorrect.
Reasoning Quality (0-10) [Only if an explanation is provided]10: Clear, rule-based reasoning aligned with the system prompt.
5-9: Somewhat unclear, incomplete, or partially follows the rules.
0-4: Contradicts the system prompt, includes hallucinations, or lacks logical reasoning.
Output Formatting (0-10)10: Fully compliant with the expected format (valid JSON, correct labels, clean structure).
5-9: Minor errors (inconsistent casing, extra whitespace).
0-4: Invalid format, contains extraneous explanations, or does not match the required structure.
Confidence Level (High/Moderate/Low)High: Errors or correctness are clearly identifiable.
Moderate: Some ambiguity, but likely incorrect.
Low: Unclear whether it is correct.
Strict Evaluation Instructions:
Step 1: Derive the correct Expected Output from system rules and input data.
Step 2: Extract the model's output verbatim as the Extracted Output.
Step 3: Compare them. If anything is incorrect, mark the classification as Incorrect.
If a classification should default to a specific label but does not, it is Incorrect.
Formatting must match exactly—any extra content or missing pieces result in a formatting score below 5.
The system prompt is the ultimate guide. If the model output does not match it 100%, mark the classification Incorrect.
Required Evaluation Output Format
Extracted Output:
(Copy the model’s output verbatim.)
Expected Output:
(Derived from system rules and input data—NOT inferred beyond system-defined constraints.)
Classification Accuracy:
(Correct or Incorrect)
Reasoning Quality:
(A numeric score [0-10] or N/A if no explanation is provided.)
Output Formatting:
(A numeric score [0-10].)
Confidence Level:
(High, Moderate, or Low.)
Feedback (2–3 lines max):
(Provide a concise explanation of correctness or errors.)
Example Evaluation Output
Extracted Output:
{ 
  "documentType": "contract", 
  "provider": "CompanyA" 
} 
Expected Output:
{ 
  "documentType": "contract", 
  "provider": "CompanyB" 
} 
Classification Accuracy: Incorrect
 Reasoning Quality: N/A
 Output Formatting: 10/10
 Confidence Level: High
 Feedback: The document type is correct, but the provider should be “CompanyB” as per system rules, making the classification incorrect.

 **System Prompt Being Evaluated**
`,
      user: `
      Evaluate the classification output using the system prompt as your absolute guide.
Derive the Expected Output from system-defined rules and input data (text/images).
Extract the model’s output verbatim.
Compare them strictly—if any component (e.g., category, provider, type) is missing, incorrect, or improperly assumed, mark the classification Incorrect.
If a fallback or default classification was required but not followed, the classification is Incorrect.
Formatting must exactly match the required JSON structure—no extra explanations.
Provide the structured evaluation format with Classification Accuracy, Reasoning Quality, Output Formatting, Confidence Level, and concise feedback (2–3 lines max).

** Expected Output **
{
      "modelOutput": "Output from the model",
      "expectedOutput": "Expected output from the system prompt",
      "analysis": "Analysis of the classification",
      "errors": ["List of errors"],
}
    `,
      format: z.object({
        modelOutput: z.string(),
        expectedOutput: z.string(),
        analysis: z.string(),
        errors: z.array(z.string()),
      }),
    },
  ],
};
