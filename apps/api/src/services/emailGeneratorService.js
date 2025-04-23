import { generateAIResponse } from './aiService.js';


export const generateHeader = async (companyName, agentsSummary) => {
  const systemPrompt = `
You are a messaging assistant for Handit.ai. Based on a summary of agent performance across the platform, generate a short, natural-sounding opening paragraph to start a weekly update email.

Your goal is to briefly summarize what happened across all agents, using clear, professional language. Focus on:

- Improvements in accuracy
- Any issues detected and addressed
- General impact (e.g., stability, monitoring, fixes)
- Highlighting value delivered this week

Be concise (1–2 short sentences) and contextual — avoid generic phrases. Do not mention specific agent or model names (those are covered later in the email).

Use a warm, proactive tone, like:

“This week, we boosted performance across several models and resolved critical issues in a few agents.”

“Thanks to continuous monitoring, we identified and fixed high-impact issues and improved accuracy where possible.”

⚠️ Important: Output only the final paragraph as Text. Do not explain what it is, and do not include any extra commentary.
`
const userPrompt = `
Instructions:
Based on the following agent performance summaries, write a short, natural-sounding opening paragraph (1–2 sentences max) to introduce a weekly report email. Focus on what actually happened — improvements, fixes, insights, and overall model stability. Avoid generalizations or repetition of agent names.

Output only the final result. Do not include any explanation.


Agent Summaries:
${agentsSummary}

Remember this message is to be sent to a client, so it should be written in a way that is easy to understand and engaging. and before this there is oging to be a hi ${companyName} message. so this should be a short message and should sound natural with that previous oppening.
`


  const response = await generateAIResponse({
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  });

  return response.text;
}


/**
 * Generates a weekly summary text for a specific agent based on its model performance and insights.
 *
 * @param {string} agentName - The name of the agent.
 * @param {Array<Object>} modelsData - An array of objects, each containing data for a model associated with the agent.
 *   Each object should include:
 *     - name: string (model name)
 *     - originalMetricRange: Object (metrics for the original model)
 *     - optimizedMetricRange: Object | null (metrics for the optimized model, if exists)
 *     - insights: Array<Object> (insights generated for the model during the week)
 * @returns {Promise<string>} - A string containing the generated summary (potentially HTML formatted).
 */
export const generateAgentWeeklySummary = async (agentName, modelsData, baseAgentAccuracyValue, optimizedAgentAccuracyValue) => {
  // **TODO: Define the actual prompt logic here**
  // This prompt needs to be carefully crafted to guide the AI.
  // It should instruct the AI to:
  // - Analyze the provided modelsData for the given agentName.
  // - Compare original vs. optimized model metrics (if available).
  // - Incorporate relevant insights from the week.
  // - Generate a concise, informative, and engaging summary.
  // - Mention key improvements, areas to watch, or significant findings.
  // - Output format can be plain text or simple HTML (like paragraphs <p> and bold <b> tags).

  const promptContent = `
  You are an expert summarizer for Handit, our AI-powered platform for monitoring and improving AI agents. Your task is to generate a natural, concise, HTML-formatted summary using the weekly data provided.

Agent Summary (<p>):
If there were accuracy improvements:

Calculate the average base accuracy, average improved accuracy, and additive gain, using bold

Example:
“This week, we detected several insights and used them to build improved models, raising accuracy from <b>76%</b> to <b>83%</b> (<b>7% increase</b>).”

If no improvements:

Show average accuracy:
“The agent remained stable with an average accuracy of <b>82%</b>, supported by continuous monitoring.”

End with:
“Here are the models that made the biggest impact this week.”

Model Summaries (<ul><li>), up to 3:
Each summary should feel conversational, but informative. Include:

Model name in <b>

If an insight or issue was detected:
“We detected an issue: [brief description].”

If agentLogId is present, add:
“<a href='https://dashboard.handit.ai/ag-tracing?agentId={agentId}&entryLog={agentLogId}'>View the related entry</a>.”

If the model was improved: “Based on this, we created a new version that improves accuracy from <b>64%</b> to <b>72%</b> (<b>8% increase</b>).”

If no improvement, but model is stable:
“Current accuracy is <b>85%</b>. We’re continuing to monitor it.”

If modelId is present, add:
“You can find your optimized prompt <a href='https://dashboard.handit.ai/automated-insights?modelId=modelId'>here</a>.”

Use only:

<p> for the agent summary

<ul><li> for model updates

<b> for metrics and model names

<a> for entry and prompt links

Return only the formatted HTML — no email wrapper.


  `;

  try {
    const response = await generateAIResponse({
      messages: [
        {
          role: 'system',
          content: promptContent,
        },
        {
          role: 'user',
          content: `
          Agent Name: ${agentName}  

Model Performance Data (Past Week):  
${JSON.stringify(modelsData, null, 2)}

Base Agent Accuracy: ${baseAgentAccuracyValue}
Optimized Agent Accuracy: ${optimizedAgentAccuracyValue}

Instructions:

Write a clear, friendly, and natural HTML summary for the agent’s performance this week.

1. Agent Summary (<p>)
If models improved:

Calculate average base accuracy, improved accuracy, and gain

Example:
“This week, we detected several insights and used them to build improved models, raising accuracy from <b>X%</b> to <b>Y%</b> (<b>Z% increase</b>).”

If no improvements:
“The agent remained stable with an average accuracy of <b>X%</b>, supported by continuous monitoring.”

End with:
“Here are the models that made the biggest impact this week.”

2. Model Summaries (<ul><li>), up to 3:
For each model:

Start with the model name in <b>

If an insight was found:

“We detected an issue: [short description].”

If agentLogId is available, add:
“<a href='https://dashboard.handit.ai/ag-tracing?agentId={agentId}&entryLog={agentLogId}'>View the related entry</a>.”

If an improved model was generated from that insight:

“Based on this, we created a new version that improves accuracy from <b>X%</b> to <b>Y%</b> (<b>Z% increase</b>).”

If model remained stable:
“Current accuracy is <b>X%</b>. We’re continuing to monitor it.”

If modelId is available, include:
“You can find your optimized prompt <a href='https://dashboard.handit.ai/automated-insights?modelId=modelId'>here</a>.”

3. Keep the entire summary under 4 sentences.
4. Output only the formatted HTML summary, not a full email.
          `,
        },
      ],
      // Potentially add responseFormat if you need a structured JSON output first
      // responseFormat: z.object({ summary: z.string() })
    });

    // Assuming the AI returns the summary directly in the text field
    // If using responseFormat, you would parse response.text first
    return response.text;
  } catch (error) {
    console.error(
      `Error generating summary for agent ${agentName} via AI:`,
      error
    );
    // Return a fallback message in case of AI generation failure
    return `<p><i>Error generating performance summary for ${agentName}. Please check logs.</i></p>`;
  }
};
