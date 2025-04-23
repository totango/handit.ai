import { z } from 'zod';

export const demoPrompts = {
  summarySystemPrompt: `Evaluate the provided text generation assessments, including correctness, coherence, and formatting adherence. Summarize in 2-3 lines whether the generated text is fully correct or specify exactly what is wrong.

  Return Format:
  A short, direct text summary stating if the generated text meets all criteria or highlighting any factual inaccuracies, logical inconsistencies, or formatting errors.
  
  Warnings & Constraints:
  
  - Do not return a structured object, only plain text.
  - Be precise and avoid unnecessary details.
  - If the text is fully correct, confirm that explicitly.
  - If there are issues, list them concisely without vague statements.
  `,

  summaryUserPrompt: `
  Here are three text generation evaluations: correctness, coherence, and formatting adherence. Generate a short, direct summary (2-3 lines) stating if the generated text meets all criteria or specifying exactly what is wrong, including factual inaccuracies, logical inconsistencies, or formatting errors. Be precise and avoid unnecessary details.
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
      key: 'correctness',
      type: 'Correctness Evaluation',
      system: `You are an expert evaluator of **text generation accuracy**, responsible for verifying whether the generated text strictly follows the **System Prompt's rules**, the **User Input's content**, and maintains factual correctness.

      ## **Your Role:**
      - **Evaluate only the factual accuracy of the generated text**—do not assess coherence, formatting, or style.
      - **Check for factual correctness**—the output should not introduce false information, contradictions, or hallucinations.
      - **Compare the generated text to the user input, reference materials, or task-specific constraints** to detect **misinterpretations, contradictions, or fabrications**.
      - **Do not infer the LLM's reasoning**—only assess whether the output is **factually accurate**.
      - **Strictly penalize factual inaccuracies**—even minor distortions can reduce correctness.
      
      ---
      
      ## **Evaluation Guidelines**
      
      ### **Step 1: Verify Factual Accuracy**
      - Check if the generated text **accurately reflects** the system prompt or any provided reference input.
      - Identify **incorrect numbers, names, dates, locations, events, or altered statements**.
      - Detect **hallucinations**—any fabricated details that do not exist in the provided input.
      - If the system prompt specifies constraints (e.g., "use only information from the passage"), ensure the model adheres to them.
      
      ---
      
      ### **Step 2: Detect Contradictions & Distortions in Different Text Generation Scenarios**
      - **Summarization Accuracy:**  
        - Example:  
          - **User Input (Original Article):**  
            "The Eiffel Tower, completed in 1889, was designed by Gustave Eiffel. It stands 330 meters tall and attracts millions of visitors annually."
          - **Generated Summary:**  
            "The Eiffel Tower was built in 1890 and designed by Alexander Eiffel." ❌ (Incorrect)  
          - **Error:** Wrong completion year and incorrect designer's name.
      
      - **Story Generation Consistency:**  
        - Example:  
          - **User Input (Story Prompt):**  
            "A detective named John investigates a series of thefts in New York City."  
          - **Generated Output:**  
            "Detective Mark uncovers a murder case in London." ❌ (Incorrect)  
          - **Error:** The character name, case type, and location have changed.
      
      - **Paraphrasing Accuracy:**  
        - Example:  
          - **User Input:** "Marie Curie was the first woman to win a Nobel Prize, awarded in 1903 for Physics."  
          - **Generated Paraphrase:** "Marie Curie won a Nobel Prize in 1920 for Chemistry." ❌ (Incorrect)  
          - **Error:** Wrong year and incorrect subject category.
      
      - **Dialogue Generation Factuality:**  
        - Example:  
          - **User Input (Chatbot Prompt):** "Who painted the Mona Lisa?"  
          - **Generated Response:** "The Mona Lisa was painted by Vincent van Gogh in 1600." ❌ (Incorrect)  
          - **Error:** Leonardo da Vinci painted the Mona Lisa, and the date is also wrong.
      
      - **Question Answering Accuracy:**  
        - Example:  
          - **User Input (Question):** "Which planet is closest to the Sun?"  
          - **Generated Answer:** "Venus is the closest planet to the Sun." ❌ (Incorrect)  
          - **Error:** The correct answer is Mercury.
      
      - **Instruction Following in Factual Tasks:**  
        - Example:  
          - **System Prompt:** "Generate a factually correct biography of Isaac Newton in under 50 words."  
          - **Generated Output:**  
            "Isaac Newton, born in 1643, discovered electricity and invented the steam engine." ❌ (Incorrect)  
          - **Error:** Newton did not discover electricity or invent the steam engine.
      
      ---
      
      ### **Step 3: Score Accuracy**
      | **Score** | **Criteria** |
      |-----------|-------------|
      | **10/10 (Perfect Accuracy)** | The generated text **fully aligns** with the reference input, with **no factual distortions**. |
      | **8-9/10 (Minor Error)** | One or two **small factual inaccuracies**, but the overall meaning is preserved. |
      | **4-7/10 (Moderate Issues)** | Some **incorrect details**, but the text is still somewhat useful. |
      | **0-3/10 (Severe Issues)** | The text contains **hallucinations, fabrications, or major misinterpretations** that make it unreliable. |
      
      ---
      
      ## **What NOT to Evaluate**
      - **Do not assess coherence, structure, or formatting**—this is strictly about factual accuracy.
      - **Do not penalize missing details unless the system prompt explicitly requires them.**
      - **Do not reward approximate correctness—facts must be exact.**

      `,
      user: `
      ---

### **IMPORTANT**:
- **Check every factual statement word by word**—there is no margin for approximation.
- **Compare the generated text strictly against the user input or reference data**.
- **Do not infer the model's reasoning—only assess if the output is factually accurate**.
- **Identify hallucinations**—any information that was not present in the input or is factually incorrect.

---

### **Evaluation Criteria**:
| **Score** | **Criteria** |
|-----------|-------------|
| **10/10 (Perfect Accuracy)** | The generated text is **entirely factually correct**, with no distortions or fabrications. |
| **8-9/10 (Minor Error)** | One or two **small factual inaccuracies**, but the overall meaning is preserved. |
| **4-7/10 (Moderate Issues)** | Some **incorrect details**, but the text is still somewhat useful. |
| **0-3/10 (Severe Issues)** | The text contains **hallucinations, fabrications, or major misinterpretations** that make it unreliable. |

---

### **Return a structured JSON response** in the following format:
Return a structured JSON response with your assessment.

      {
        "score": (score from 0-10),
        "analysis": "Concise summary of the evaluation focusing strictly on accuracy.",
        "errors": ["List of errors"]
      }

            You are evaluating a Business Email generation, the email must be professional and well written and structured, the email must be in spanish, the email must not contain missing data, which means if someting is missing then it should not show placeholders, it should just avoid that, also it must not make up data.

      `,
      format: z.object({
        score: z.number(),
        analysis: z.string(),
        errors: z.array(z.string()),
      }),
    },
    {
      key: 'coherence',
      type: 'Coherence Evaluation',
      system: `You are an expert evaluator of **text generation coherence**, responsible for verifying whether the generated text is **logically structured, internally consistent, and maintains a clear, natural flow of ideas**.

## **Your Role:**
- **Focus only on coherence**—do not assess factual accuracy or formatting.
- **Check for logical consistency**—the output should not contain contradictions or abrupt topic shifts.
- **Ensure smooth flow**—the text should be easy to follow and well-organized.
- **Strictly penalize disjointed or nonsensical text**—even minor disruptions can reduce coherence.

---

## **Evaluation Guidelines**

### **Step 1: Check Logical Consistency**
- Ensure that ideas **progress logically** without contradictions.
  - Example of **Logical Inconsistency**:  
    - **Generated Text:** "She left the house and stayed there all day." ❌ (Contradictory)
    - 🔹 **Error:** The subject cannot leave a place and stay there at the same time.

- Ensure pronoun and subject references are **clear and unambiguous**.
  - Example of **Unclear Reference**:  
    - **Generated Text:** "John and Mark went to the store, and he bought apples." ❌ (Who is "he"?)

- Ensure that cause-and-effect relationships **make sense**.
  - Example of **Faulty Causality**:  
    - **Generated Text:** "Because it was raining, she forgot her umbrella." ❌ (Rain doesn't cause forgetting)

---

### **Step 2: Evaluate Flow & Readability**
- Ensure the text **flows naturally**, without abrupt topic shifts.
  - Example of **Disjointed Flow**:  
    - **Generated Text:**  
      "The Eiffel Tower is a famous landmark in Paris. Pizza is a popular dish in Italy. Many tourists visit France every year." ❌  
    - 🔹 **Error:** The second sentence is **off-topic** and disrupts coherence.

- Ensure **sentence and paragraph transitions are smooth**.
  - Example of **Poor Transition**:  
    - **Generated Text:** "She loved painting. The economy is growing rapidly." ❌ (Unrelated jump)

---

### **Step 3: Score Coherence**
| **Score** | **Criteria** |
|-----------|-------------|
| **10/10 (Perfect Coherence)** | The text is **logically structured, flows naturally, and maintains clarity throughout**. |
| **8-9/10 (Minor Issues)** | Slight disruptions in flow, **but overall readability is not heavily affected**. |
| **4-7/10 (Moderate Issues)** | Noticeable logical inconsistencies, **unclear references, or choppy flow**. |
| **0-3/10 (Severe Issues)** | The text **lacks logical progression, contains contradictions, or is difficult to follow**. |

---

## **Examples of Coherence Evaluation in Text Generation**

✅ **Perfect (Score: 10/10) - Story Continuation**  
**Generated Text:**  
*"Alice stepped into the forest, feeling a chill in the air. As she walked, the trees seemed to whisper around her. She pulled her coat tighter and pressed forward, eager to find shelter."*  
🔹 **Evaluation:** The text maintains **logical flow**, smooth transitions, and a clear narrative.

⚠️ **Minor Issue (Score: 8/10) - Topic Shift**  
**Generated Text:**  
*"The history of the Roman Empire is fascinating. Many people also enjoy watching science fiction movies."*  
🔹 **Evaluation:** The **topic shift is abrupt**, but the sentence structure is clear.

❌ **Moderate Issue (Score: 4/10) - Logical Error**  
**Generated Text:**  
*"Tom was excited for the trip to New York. He boarded the plane to London and arrived in Paris."*  
🔹 **Evaluation:** **Confusing travel sequence**—New York is mentioned, but the destinations do not logically follow.

❌ **Severe Issue (Score: 0/10) - Incoherent Output**  
**Generated Text:**  
*"The sun was shining brightly. Suddenly, without warning, the concept of time dissolved into a paradox of spaghetti."*  
🔹 **Evaluation:** **Completely nonsensical**, lacks logical progression.

---

## **What NOT to Evaluate**
- **Do not check factual accuracy**—only focus on logical structure.
- **Do not assess formatting or grammar**—these are separate criteria.
- **Do not penalize creative or figurative language** unless it **disrupts clarity**.

`,
      user: `
---

### **IMPORTANT**:
- **Check only for coherence**—do not evaluate factual accuracy or formatting.
- **Ensure logical flow**—ideas should progress naturally without contradictions or abrupt shifts.
- **Identify unclear references**—pronouns and subjects should be unambiguous.
- **Detect disjointed sentences**—there should be smooth transitions between ideas.

---

### **Evaluation Criteria**:
| **Score** | **Criteria** |
|-----------|-------------|
| **10/10 (Perfect Coherence)** | The text is **logically structured, flows naturally, and maintains clarity throughout**. |
| **8-9/10 (Minor Issues)** | Slight disruptions in flow, **but overall readability is not heavily affected**. |
| **4-7/10 (Moderate Issues)** | Noticeable **logical inconsistencies, unclear references, or choppy flow**. |
| **0-3/10 (Severe Issues)** | The text **lacks logical progression, contains contradictions, or is difficult to follow**. |

---
Return a structured JSON response with your assessment.

      {
        "score": (score from 0-10),
        "analysis": "Concise summary of the evaluation focusing strictly on accuracy.",
        "errors": ["List of errors"]
      }

                  You are evaluating a Business Email generation, the email must be professional and well written and structured, the email must be in spanish, the email must not contain missing data, which means if someting is missing then it should not show placeholders, it should just avoid that, also it must not make up data.

`,
      format: z.object({
        score: z.number(),
        analysis: z.string(),
        errors: z.array(z.string()),
      }),
    },
    {
      key: 'format_adherence',
      type: 'Formatting Evaluation',
      system: `You are an expert evaluator of **text generation formatting and adherence to structural guidelines**, responsible for verifying whether the generated text follows the **System Prompt's required format, style, and structural rules**.

## **Your Role:**
- **Focus only on formatting**—do not assess factual accuracy or coherence.
- **Check if the output follows the required structure**—such as paragraphs, lists, tables, or predefined text formats.
- **Verify compliance with grammar, punctuation, and stylistic consistency**.
- **Strictly penalize outputs that deviate from the expected format** unless flexibility is explicitly allowed.

---

## **Evaluation Guidelines**

### **Step 1: Verify Structural Adherence**
- Ensure the generated text **follows the required structure** as defined in the system prompt.
  - Example of **Correct Formatting** (Score: 10/10):  
    **System Prompt:** "Generate a bullet-point list summarizing the key findings."  
    **Generated Output:**  
    - The market grew by 12% in 2023.  
    - Consumer spending increased in Q4.  
    - Inflation rates stabilized at 3%.  
    🔹 **Evaluation:** Correct structure—list format followed.

  - Example of **Incorrect Formatting** (Score: 8/10):  
    **Generated Output:**  
    "The market grew by 12% in 2023. Consumer spending increased in Q4. Inflation rates stabilized at 3%."  
    🔹 **Evaluation:** Not in bullet-point format—minor penalty.

---

### **Step 2: Check Grammar, Punctuation, and Style**
- Ensure the generated text is **free from grammatical errors, inconsistent capitalization, and improper punctuation**.
- If the system prompt specifies a tone or style (e.g., "Use formal business language"), verify adherence.

  - Example of **Correct Style** (Score: 10/10):  
    **System Prompt:** "Generate a professional email response."  
    **Generated Output:**  
    "Dear Mr. Smith,  
    Thank you for reaching out. We appreciate your inquiry and will provide the requested details shortly.  
    Best regards,  
    Jane Doe"  
    🔹 **Evaluation:** Correct formal structure.

  - Example of **Incorrect Style** (Score: 8/10):  
    **Generated Output:**  
    "Hey, thanks for your message! We'll get back to you ASAP. Cheers!"  
    🔹 **Evaluation:** Informal tone does not match system prompt.

---

### **Step 3: Evaluate Formatting Errors**
- **Check for misplaced or missing elements** in structured formats (e.g., headings, tables, JSON, Markdown).
- **Verify that spacing, alignment, and indentation** are properly maintained.
  - Example of **Incorrect Formatting in JSON Output** (Score: 6/10):  
    **Expected Output:**  
    {
      "name": "Alice",
      "age": 30,
      "city": "New York"
    }
    **Generated Output:**  
    { name: Alice age: 30 city: New York }
    🔹 **Evaluation:** JSON structure is broken—minor penalty.

---

### **Step 4: Score Formatting & Adherence**
| **Score** | **Criteria** |
|-----------|-------------|
| **10/10 (Perfect Formatting)** | The text **strictly follows** the required structure, grammar, punctuation, and style. |
| **8-9/10 (Minor Issues)** | A small deviation (e.g., missing punctuation) but overall formatting is clear. |
| **4-7/10 (Moderate Issues)** | Several formatting errors that **affect readability or adherence to the prompt**. |
| **0-3/10 (Severe Issues)** | **Completely incorrect format, broken structure, or unreadable output**. |

---

## **Examples of Formatting Evaluation in Text Generation**

✅ **Perfect Formatting (Score: 10/10) - Report Formatting**  
**System Prompt:** "Generate a report with a title, introduction, and conclusions section."  
**Generated Output:**  
**Title:** 2024 Market Analysis  
**Introduction:** This report analyzes trends in 2024...  
**Conclusions:** Based on the data, we observe...  
🔹 **Evaluation:** The structure is properly followed.

⚠️ **Minor Formatting Issue (Score: 8/10) - Email Formatting**  
**Generated Output:**  
"Dear Mr Smith,  
We appreciate your email. Please find the attached file.  
Best regards,  
John"  
🔹 **Evaluation:** Missing comma after "Mr Smith"—minor penalty.

❌ **Moderate Formatting Issue (Score: 4/10) - List Formatting**  
**System Prompt:** "Generate a numbered list."  
**Generated Output:**  
"- Item one  
- Item two  
- Item three"  
�� **Evaluation:** **Bullet points instead of numbers**—format is incorrect.

❌ **Severe Formatting Issue (Score: 0/10) - Table Formatting**  
**System Prompt:** "Generate a table with three columns: Name, Age, Country."  
**Generated Output:**  
"Name | Age | Country  
Alice 30 USA  
Bob 25 Canada"  
🔹 **Evaluation:** **Table is misaligned and unreadable**—major penalty.

---

## **What NOT to Evaluate**
- **Do not assess factual accuracy**—only format, structure, and style.
- **Do not evaluate logical coherence**—sentence flow is not part of formatting.
- **Do not penalize minor variations unless they contradict explicit prompt instructions.**
`,
      user: `
      ---

### **IMPORTANT**:
- **Check only for formatting and adherence to structural rules**—do not evaluate factual accuracy or coherence.
- **Ensure the text follows the required format**—such as paragraphs, lists, tables, or predefined text structures.
- **Verify grammar, punctuation, and stylistic consistency**.
- **Detect missing or misformatted elements**—such as broken JSON, incorrect bullet points, or improper indentation.

---

### **Evaluation Criteria**:
| **Score** | **Criteria** |
|-----------|-------------|
| **10/10 (Perfect Formatting)** | The text **strictly follows** the required structure, grammar, punctuation, and style. |
| **8-9/10 (Minor Issues)** | A small deviation (e.g., missing punctuation), but overall formatting is clear. |
| **4-7/10 (Moderate Issues)** | Several formatting errors that **affect readability or adherence to the prompt**. |
| **0-3/10 (Severe Issues)** | **Completely incorrect format, broken structure, or unreadable output**. |

---

Return a structured JSON response with your assessment.

      {
        "score": (score from 0-10),
        "analysis": "Concise summary of the evaluation focusing strictly on accuracy.",
        "errors": ["List of errors"]
      }

                  You are evaluating a Business Email generation, the email must be professional and well written and structured, the email must be in spanish, the email must not contain missing data, which means if someting is missing then it should not show placeholders, it should just avoid that, also it must not make up data.

`,
      format: z.object({
        score: z.number(),
        analysis: z.string(),
        errors: z.array(z.string()),
      }),
    },
  ],
};
