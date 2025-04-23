import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { parseInput } from './parseInput.js';
import { executeTrack } from './trackService.js';
import { expected, predicted } from './entries/correctnessEvaluatorService.js';
import { parseAttachments, parseContext, parseInputContent } from './parser.js';
import { generateAIResponse } from './aiService.js';

const openAi = new OpenAI(process.env.OPENAI_API_KEY);

const Review = z.object({
  problem: z.string(),
  solution: z.string(),
  description: z.string(),
});

const ListOfReviews = z.object({
  reviews: z.array(Review),
});

export const runReview = async (
  entry,
  reviewer,
  ModelLog,
  Insights,
  problemType = 'text_generation',
  version = null,
  modelId = null
) => {
  /*const oldInsights = await Insights.findAll({
    where: {
      modelId: entry.dataValues.modelId,
    },
  });*/
  const review = await reviewEntry(
    entry,
    reviewer,
    ModelLog,
    [],
    problemType
  );

  const newInsights = review.reviews.map((review) => ({
    modelId: entry.dataValues.modelId,
    problem: review.problem,
    solution: review.solution,
    data: { description: review.description, entry: entry.dataValues },
    version: modelId ? `${modelId}-${version}` : version,
  }));

  await Insights.bulkCreate(newInsights);
};

export const reviewEntry = async (
  entry,
  reviewer,
  ModelLog,
  oldInsights,
  problemType = 'text_generation'
) => {
  const slug = reviewer.slug;
  const systemPrompt = await reviewer.prompt();
  const systemMessage = parseContext(entry.input);
  const userPromptOutput = parseInput(entry.output);
  const expectedOutput = expected(entry.dataValues);
  const predictedOutput = predicted(entry.dataValues);
  let attachments = await parseAttachments(entry.input);
  attachments = attachments
    .filter(
      (att) =>
        att.includes('https://') ||
        att.includes('http://') ||
        att.includes('www.') ||
        att.includes('base64')
    )
    .slice(0, 5);
  const imageAttachments = attachments.map((att) => ({
    type: 'image_url',
    image_url: {
      url: att,
    },
  }));

  const userContent =
    imageAttachments.length > 0
      ? [
          {
            type: 'text',
            text: parseInputContent(entry.input),
          },
          ...imageAttachments.sort(() => Math.random() - 0.5).slice(0, 3),
        ]
      : parseInputContent(entry.input);
  
  const input = [
    {
      role: 'system',
      content: systemPrompt,
    },

    {
      role: 'user',
      content: [
        ...(Array.isArray(userContent)
          ? userContent
          : [
              {
                type: 'text',
                text: userContent,
              },
            ]),
        {
          type: 'text',
          text: `
### Context (System Prompt)
${systemMessage}

${
  problemType === 'demo' ? `
  The Expected Problem to solve is:
  to have a Business Email generation, the email must be professional and well written and structured, the email must be in spanish, the email must not contain missing data, which means if someting is missing then it should not show placeholders, it should just avoid that, it must not make up data.
  Also it is important that the email never adds random data, it should only add data that is asked for in the user input. The email must have allways a formal tone and do not add random data.
  ` : ''
}

### Generated Output
${userPromptOutput}


### Review Output
${
  problemType === 'text_generation'
    ? `
** Reason of error: ${entry.actual.summary}\n
** Correctness: ${entry.actual.evaluations[0]} \n
** Completeness: ${entry.actual.evaluations[1]} \n
** Format Adherence: ${entry.actual.evaluations[2]}`
    : `- **Expected Output:** ${expectedOutput}
- **Predicted Output:** ${predictedOutput}`
}

### Task
Analyze why the generated output deviates from the expected output based on the **Context (System Prompt)**. Identify any new or unaddressed reasons for the mismatch, such as:
1. **Ambiguity** – Could unclear or conflicting instructions cause misinterpretation?
2. **Missing Guidance** – Are crucial details or policy directives absent?
3. **Misalignment** – Does the system prompt fail to direct the model toward the desired response?

Avoid duplicating or restating issues listed in **Previous Insights**. Focus on general improvements that apply to a range of scenarios.

### Expected Response Format
- **Root Cause(s) of the Issue**: Point out specific reasons for the incorrect or suboptimal output.
- **Recommended Improvements**: Suggest clear, actionable solutions to refine the **Context (System Prompt)**.
- **Final Suggested System Prompt**: Provide an updated prompt that integrates these improvements.

### Example Response
**Root Cause(s) of the Issue:**
- The system prompt is too broad and does not clarify the desired response format.
- No examples are given for correct or incorrect responses.

**Recommended Improvements:**
- Clearly specify the expected structure (e.g., bullet points, summary, or JSON).
- Include a short example illustrating acceptable answers.

Provide your final answer in **English** and follow the structured format above, ensuring that you do not repeat already-documented insights.
`,
        },
      ],
    },
  ];
  console.log('input', input)
  const completion = await generateAIResponse({
    messages: input,
    responseFormat: ListOfReviews,
    numberOfAttachments: imageAttachments.length,
  });

  await executeTrack(
    reviewer,
    {
      modelId: slug,
      input,
      output: completion,
    },
    ModelLog
  );

  return JSON.parse(completion.choices[0].message.content);
};
