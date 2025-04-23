import { generateAIResponse } from './aiService.js';

const MAX_TOKENS = 10000; // Safe limit for gpt-4 input

export const generateSummary = async (
  output,
  name,
  description,
  firstNodeName
) => {
  try {
    // Convert input object to string and limit its size
    // check if output is an object
    let truncatedInput;
    if (typeof output === 'object') {
      const outputStr = JSON.stringify(output);
      truncatedInput =
        outputStr.length > MAX_TOKENS
          ? outputStr.slice(0, MAX_TOKENS) + '...[truncated]'
          : outputStr;
    } else {
      truncatedInput =
        output.length > MAX_TOKENS
          ? output.slice(0, MAX_TOKENS) + '...[truncated]'
          : output;
    }

    const completion = await generateAIResponse({
      messages: [
        {
          role: 'system',
          content: `You are an AI monitoring assistant specialized in summarizing agent tracing logs.

Your task is to generate a concise, informative, and **unique** one- to two-line summary for each trace, making it easy for users to scan and differentiate entries. Each summary should:

- **Start with the first node's key output** (what was detected, extracted, or classified).
- **Briefly describe the process flow if relevant** (avoid unnecessary detail).
- **End with the final outcome** (highlighting success, failure, structured output, or extracted values).
- **Use strong, clear keywords** to enhance distinctiveness and searchability.
- **Avoid redundant phrasing** like "Started with" or "Processed input from." Instead, go straight to what happened.
- **Follow this structured format:**  
  - _"[First node's key output], [key processing steps if relevant], and [final result]."_
- **Ensure each summary is unique** by emphasizing specific document types, extracted values, workflow steps, or errors.

### **Examples:**
✅ **Conversational AI & Support Agents**
- "Detected a customer complaint, analyzed sentiment, and flagged it as 'high priority' with 92% confidence."
- "Identified an appointment request, checked agent availability, and scheduled a call for March 5."
- "Extracted customer feedback, detected negative tone, and escalated to human review."

✅ **Code Analysis & AI Evaluation Agents**
- "Scanned Python code, detected a security vulnerability in line 45, and suggested a fix."
- "Evaluated chatbot responses, detected inconsistencies, and recommended prompt tuning."
- "Benchmarked an LLM's accuracy, tested against 500 queries, and identified 15 failure cases."

✅ **Financial & Insurance Document Processing**
- "Classified an insurance claim, extracted policy details, and flagged missing signatures."
- "Processed a car accident report, identified damage severity, and calculated estimated repair cost."
- "Parsed a financial statement, detected discrepancies, and flagged potential fraud."

✅ **Medical & Healthcare Processing**
- "Extracted patient details from an EHR document, validated medication history, and flagged contraindications."
- "Identified abnormal vitals in a health report, cross-referenced past data, and recommended further testing."
- "Processed a medical invoice, extracted billing codes, and categorized expenses."

✅ **Legal & Compliance Processing**
- "Recognized a legal contract, extracted key clauses, and generated a compliance summary."
- "Analyzed an NDA, detected missing signatures, and flagged for review."
- "Parsed court documents, identified case precedents, and structured key rulings."

✅ **Image & Vision AI Processing**
- "Detected a roof damage pattern in an inspection image, estimated repair cost, and flagged it for claims processing."
- "Identified a car make and model from an accident photo, matched it with VIN data, and confirmed vehicle identity."
- "Scanned a handwritten note, extracted key text, and converted it into structured digital format."

✅ **Supply Chain & Logistics Optimization**
- "Analyzed warehouse inventory, detected overstock of Item A, and recommended a 25% order reduction."
- "Identified delayed shipments, optimized delivery routes, and reduced estimated arrival time by 3 days."
- "Processed supplier invoices, matched them with purchase orders, and flagged inconsistencies."

✅ **Failure/Error Cases**
- "Received an unrecognized document type, failed during entity extraction, and returned a parsing error."
- "Processed an AI model update, detected missing configuration, and aborted deployment."
- "Failed to extract text from a blurry scanned receipt, flagged for manual review."
`,
        },
        {
          role: 'user',
          content: `Given the following agent tracing log, generate a **concise one- to two-line summary** that highlights:

1. **The first node's key output** (e.g., classification, detection, or extraction result).
2. **The main process the agent performed** (only if relevant).
3. **The final outcome** (key output, structured result, success, failure, or extracted values).

**Follow this format:**  
"[First node's key output], [key processing steps if relevant], and [final result]."

Ensure clarity and uniqueness by including specific document types, extracted values, key entities, model results, or relevant processing details.

**First node name:** ${firstNodeName}

**Agent name:** ${name}

**Agent description:** ${description}

**Output:** ${truncatedInput}
`,
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating summary:', error);
    return null;
  }
};
