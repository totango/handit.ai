import { z } from 'zod';
import {
  parseContext,
  parseOutputContent,
  parseInputContent,
} from './parser.js';
import { generateAIResponse } from './aiService.js';



const ProblemTypeSchema = z.object({
  problemType: z.enum([
    'data_extraction',
    'generation',
    'mapping',
    'classification',
  ]),
  confidence: z.number(),
  reasoning: z.string(),
});

const MAX_LOGS_TO_ANALYZE = 5;
const MAX_TOKENS_PER_LOG = 500;

const truncateText = (text, maxTokens) => {
  // Rough estimation: 1 token ≈ 4 characters
  const maxChars = maxTokens * 4;
  return text && text.length > maxChars ? text.substring(0, maxChars) + '...' : text;
};

const prepareLogsForAnalysis = (logs) => {
  return logs.map((log) => ({
    context: truncateText(parseContext(log.input), MAX_TOKENS_PER_LOG),
    input: truncateText(parseInputContent(log.input), MAX_TOKENS_PER_LOG),
    output: truncateText(parseOutputContent(log.output), MAX_TOKENS_PER_LOG),
  }));
};

export const detectProblemType = async (model, logs) => {
  if (!logs || logs.length < 5) {
    return {
      problemType: null,
      confidence: 0,
      reasoning: 'Insufficient logs for analysis (minimum 5 required)',
    };
  }

  // Take a random sample of logs
  const sampleLogs = logs
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(MAX_LOGS_TO_ANALYZE, logs.length));

  const preparedLogs = prepareLogsForAnalysis(sampleLogs);

  const messages = [
    {
      role: 'system',
      content: `You are an expert in analyzing the behavior of AI models and accurately identifying the type of task they are performing based on input-output patterns.

Given a set of input-output examples from an AI model, determine which of the following categories best describes the model's primary task:

data_extraction – Identifying and extracting specific pieces of information from the input text, such as named entities, dates, or amounts.

generation – Creating new textual content based on the input, including summaries, responses, or creative writing.

mapping – Converting input data into a different format or structure, such as translating JSON to a table, reformatting text, or aligning schema fields.

classification – Assigning the input to one of several predefined categories or labels based on its content.

Carefully analyze the nature of the transformation from input to output. Focus on whether the output is newly generated, structurally transformed, directly extracted, or labeled.
After choosing the most appropriate category, explain your reasoning and provide a confidence level (e.g., high, medium, low).`,
    },
    {
      role: 'user',
      content: `Here are ${
        preparedLogs.length
      } input-output pairs from the model:
      ${JSON.stringify(preparedLogs, null, 2)}`,
    },
  ];

  try {
    const completion = await generateAIResponse({
      messages,
      responseFormat: ProblemTypeSchema,
    });

    const result = JSON.parse(completion.choices[0].message.content);

    // Update the model's problem type if confidence is high enough
    if (result.confidence >= 0.8) {
      await model.update({
        problemType: result.problemType,
      });
    }

    return result;
  } catch (error) {
    console.error('Error detecting problem type:', error);
    return {
      problemType: null,
      confidence: 0,
      reasoning: `Error during analysis: ${error.message}`,
    };
  }
};
