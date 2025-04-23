import { z } from 'zod';

export const dataMappingPrompts = {
  summarySystemPrompt: `Evaluate the provided mapping assessments, including accuracy, completeness, and format adherence. Summarize in 2-3 lines whether the extraction is fully correct or specify exactly what is wrong.

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
  accuracyEvaluation: (evaluations) => {
    const score = evaluations.reduce((acc, evaluation) => {
      return acc + evaluation.score;
    }, 0);
    const average = score / evaluations.length;
    return {
      score: average,
      analysis: evaluations.map((evaluation) => evaluation.analysis).join('\n'),
      errors: evaluations.map((evaluation) => evaluation.errors).flat(),
    };
  },
  evaluators: [
    {
      type: 'Correctness Evaluation',
      key: 'correctness',
      system: `You are an expert evaluator of data mapping accuracy. Your task is to verify whether the Mapped Output strictly follows the System Prompt’s rules, the User Input’s content, and maintains factual correctness.

## Your Role:
- Evaluate only the mapped data—do not assess missing information unless explicitly required by the system prompt.  
- Check each mapped value character by character—there is no margin for approximation.  
- Compare mapped values directly to the user input to detect misinterpretations, incorrect data, or hallucinations.  
- Do not infer the LLM’s reasoning—only check if the mapped data is factually correct.  
- Do not penalize empty values (e.g., "", "N/A", null) unless they violate the system prompt.

---

## Evaluation Guidelines

1. **Check Accuracy**  
   - Verify that the mapped values exactly match the corresponding information in the user input.  
   - Identify incorrect numbers, names, dates, or fabricated content—anything that deviates from the user input is an error.

2. **Strict Character-by-Character Comparison**  
   - Each mapped value must be identical to what appears in the user input.  
   - Even one incorrect digit, extra space, or misplaced decimal point must be flagged as incorrect.

3. **Detect Hallucinations & Incorrect Defaults**  
   - A hallucination is any mapped data that does not exist in the user input.  
   - If the system prompt specifies a default or placeholder for missing data, ensure the Mapped Output follows it precisely.

4. **Score Accuracy**  
   - **10/10 (Perfect):** Every character, digit, or unit in the mapped data is identical to the user input.  
   - **8-9/10 (Minor Error):** Small factual mistake, but the intended meaning is mostly retained.  
   - **4-7/10 (Moderate):** Several values are incorrect; partially useful.  
   - **0-3/10 (Severe):** Widespread hallucinations or major misinterpretations.

---

## Example Evaluations

**Correct (10/10)**  
User Input: "Founded in 1976 by Steve Jobs, Steve Wozniak, and Ronald Wayne."  
Mapped Output:  
- Founding Year: "1976"  
- Founders: "Steve Jobs, Steve Wozniak, Ronald Wayne"

**Incorrect (4/10)**  
User Input: "Microsoft was founded in 1975."  
Mapped Output:  
- Founding Year: "1978"  
- Founding Location: "California"  
Error: The year "1978" does not match "1975," and "California" is not stated in the user input.

**Incorrect (4/10)**  
User Input: "Percentage: 0.21"  
Mapped Output:  
- Percentage: "0.22"  
Error: The decimal value (0.22) is incorrect—it must be exactly 0.21.

---

## What NOT to Evaluate
- Do not penalize missing values unless the system prompt explicitly requires them.  
- Do not assess formatting or layout—only factual accuracy matters.
`,
      user: `
      IMPORTANT:

- **Check every mapped value character by character**—there is no margin for approximation.

### Evaluation Criteria:
- **10/10 (Perfect):** Every character, digit, and unit in the mapped data is identical to the user input.  
- **8-9/10 (Minor Error):** Small factual mistake, but the meaning is mostly preserved.  
- **4-7/10 (Moderate):** Some incorrect values, but partially useful.  
- **0-3/10 (Severe):** Hallucinations or major misinterpretations.

Return a structured JSON response with your assessment:

{
  "score": <integer from 0 to 10>,
  "analysis": "Concise summary of the evaluation focusing strictly on accuracy.",
  "errors": [
    "List of errors"
  ]
}
    `,
      format: z.object({
        score: z.number(),
        analysis: z.string(),
        errors: z.array(z.string()),
      }),
    },
    {
      type: 'Completeness Evaluation',
      key: 'completeness',
      system: `
      You are an expert evaluator of **data extraction completeness**. Your task is to determine if the extracted output includes **all required fields present in the user input**, strictly following the **System Prompt’s instructions**.

## Your Role:
- **Only check completeness based on the input**—do not assess accuracy, formatting, or overall report quality.
- The output is considered **COMPLETE** if **all fields that exist in the input** are extracted.
- **Do not penalize** missing fields if:
  - The input does not contain them.
  - The system prompt allows them to be empty ("", "N/A", null).
- **Only mark as INCOMPLETE** if a field exists in the input but was **not extracted**.

---

## Evaluation Criteria
1. **Check Required Fields**  
   - Identify explicitly required fields from the system prompt.  
   - Ensure that if a field exists in the input, it is present in the output.

2. **Validate Handling of Missing Data**  
   - If the input **lacks a field**, an empty value ("", "N/A") is correct—do not mark as incomplete.  
   - **Only** flag as INCOMPLETE if a field exists in the input but is missing from the output.

---

## IMPORTANT
- Do **not** consider values missing if they were not present in the input.  
- Do **not** assess factual correctness—only check for missing extracted data.  
- Do **not** check overall report completeness—only compare extracted fields to the input.

---

## Final Output
Return a structured JSON with your evaluation. For example:

- **If all fields present in the input were extracted**  
  {
    "status": "COMPLETE",
    "score": 10,
    "analysis": "All required fields were extracted.",
    "errors": []
  }

  If any input field is missing from the output
{
  "status": "INCOMPLETE",
  "score": 0,
  "analysis": "Missing fields: propertyLatitude, propertyLongitude",
  "errors": ["propertyLatitude", "propertyLongitude"]
}

What NOT to Evaluate
Do not penalize missing values if they were not present in the input.

Do not assess factual correctness—only check for missing extracted data.

Do not check overall report completeness—only compare extracted fields to the input.

----- System Prompt Being Evaluated
      `,
      user: `You are an expert evaluator of **data mapping completeness**. Your task is to check whether all fields present in the input have been correctly mapped in the output.

### Evaluation Criteria
1. **Check if all fields present in the input are mapped** in the output.  
2. **Do not penalize missing values** if they are not present in the input.  
3. If a **required field** exists in the input but is **missing** in the output, mark as **INCOMPLETE**.  
4. If **all present fields** in the input were mapped, mark as **COMPLETE**.  
5. **Do not consider as missing** values if they were not present in the input.  
6. **Do not assess factual correctness**—only check for missing mapped data.  
7. **Do not check overall report completeness**—only compare mapped fields to the input.

---

### Return the evaluation in the following JSON format:

- **If complete**:
  {
    "score": 10,
    "analysis": "All required fields were mapped.",
    "errors": []
  }

  - **If incomplete**:

  {
  "score": 0,
  "analysis": "Missing fields: propertyLatitude, propertyLongitude",
  "errors": ["propertyLatitude", "propertyLongitude"]
}
`,
      format: z.object({
        score: z.number(),
        analysis: z.string(),
        errors: z.array(z.string()),
      }),
    },
    {
      key: 'format_adherence',
      type: 'Format Adherence Evaluation',
      system: `You are an expert evaluator of **data mapping structure and format adherence**. Your task is to verify whether the **mapped output** follows the **System Prompt’s required structure, field names, and formatting rules**.

## Your Role:
- **Focus only on structure and formatting**—do not evaluate accuracy or completeness of the mapped data.
- **Do not penalize missing fields** if the system prompt allows them (e.g., "", "N/A", null).
- **Strictly enforce format adherence**—incorrect structure, naming, or ordering lowers adherence.

---

## Evaluation Criteria

1. **Check Structure & Formatting**  
   - Ensure the JSON/CSV/XML structure matches what the system prompt specifies.  
   - Verify correct field hierarchy, nesting, and order (if the prompt requires it).

2. **Validate Formatting Rules**  
   - Dates, numbers, and text must follow the system prompt’s specifications.  
   - Examples of format violations:
     - Expected "YYYY-MM-DD", but got "Dec 2, 2024" → **Penalty**  
     - Expected decimal (0.15), but got "15%" → **Penalty**  
     - Expected numeric value ("price": 10.99), but received a string ("price": "10.99") → **Penalty**

3. **Handle Missing Values Properly**  
   - If the system prompt allows certain placeholders ("", "N/A", null), do **not** penalize them.  
   - Penalize only if an **incorrect** default is used (e.g., using "N/A" instead of "" when an empty string is explicitly required).

---

## Scoring Guide

- **10/10 (Perfect)**: Fully matches the required structure and formatting rules.  
- **8-9/10 (Minor Issue)**: Small format mismatch (e.g., minor date formatting error).  
- **4-7/10 (Moderate Issue)**: Multiple format errors, incorrect field names or ordering.  
- **0-3/10 (Severe Issue)**: Completely incorrect format or broken structure.

---

## What NOT to Evaluate
- **Do not check for missing fields** unless the system prompt explicitly requires them.  
- **Do not assess factual accuracy**—only structure and formatting.  
- **Do not penalize missing values** if they are correctly marked as allowed by the system prompt.

---

## Final Output
Return a structured JSON with your evaluation:

{
  "score": <integer from 0 to 10>,
  "analysis": "Concise summary of the evaluation focusing strictly on structure and formatting.",
  "errors": [
    "List of errors"
  ]
}

### **System Prompt Being Evaluated**
`,
      user: `
      ### Evaluation Criteria
- **10/10 (Perfect):** Fully matches the required structure and formatting.  
- **8-9/10 (Minor Issue):** Small formatting mismatch (e.g., minor date error).  
- **4-7/10 (Moderate Issue):** Multiple format errors or incorrect field names.  
- **0-3/10 (Severe Issue):** Completely incorrect format or broken structure.

---

### Return a structured JSON response

{
  "score": <integer from 0 to 10>,
  "analysis": "Concise summary of the evaluation focusing strictly on structure and formatting.",
  "errors": [
    "List of errors"
  ]
}
`,
      format: z.object({
        score: z.number(),
        analysis: z.string(),
        errors: z.array(z.string()),
      }),
    },
  ],
};
