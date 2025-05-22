import Together from "together-ai";
import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

function zodSchemaToJson(schema) {
  if (schema instanceof z.ZodString) {
    return '...';
  }
  if (schema instanceof z.ZodNumber) {
    return 0;
  }
  if (schema instanceof z.ZodBoolean) {
    return true;
  }
  if (schema instanceof z.ZodEnum) {
    return schema._def.values[0];
  }
  if (schema instanceof z.ZodArray) {
    return [zodSchemaToJson(schema._def.type)];
  }
  if (schema instanceof z.ZodObject) {
    const shape = schema._def.shape();
    const result = {};
    for (const key in shape) {
      result[key] = zodSchemaToJson(shape[key]);
    }
    return result;
  }
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return zodSchemaToJson(schema._def.innerType);
  }
  return null;
}

const DEFAULT_MODEL = "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8";

/**
 * Generates text using the Together AI API
 * @param {Object} params - The parameters for text generation
 * @param {Array} params.messages - Array of message objects with role and content
 * @param {string} params.model - Optional model override
 * @param {Object} params.config - Optional configuration parameters
 * @returns {Promise<Object>} The generated text and metadata
 */
export const generateAIResponse = async ({
  messages,
  responseFormat = null,
  token = process.env.TOGETHER_API_KEY,
  model = DEFAULT_MODEL,
  provider = 'TogetherAI',
}) => {
  try {
    let completion;
    if (provider === 'OpenAI') {
      const openai = new OpenAI({
        apiKey: token,
      });
      completion = await openai.chat.completions.create({
        model,
        messages,
        response_format: responseFormat ? zodResponseFormat(responseFormat, 'responseFormat') : null
      });
    } else if (provider === 'TogetherAI') {
      const together = new Together({
        apiKey: token,
      });
      const responseFormatJson = zodSchemaToJson(responseFormat);
      if (responseFormatJson) {
        messages.push({
          role: 'user',
          content: `You must response in the following format: ${JSON.stringify(responseFormatJson, null, 2)} and you should not include any other text or comments`
        });
        const system = messages.find(message => message.role === 'system');
        system.content = system.content + `\n\nYou must response in the following format: ${JSON.stringify(responseFormatJson, null, 2)} and you should not include any other text or comments`;
        messages[0] = system;
      }
      completion = await together.chat.completions.create({
        model,
        messages,
      });
    }

    return {
      ...completion,
      text: completion.choices[0].message.content,
      usage: completion.usage,
      finishReason: completion.choices[0].finish_reason
    };
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
};

/**
 * Streams text using the Together AI API
 * @param {Object} params - The parameters for text streaming
 * @param {Array} params.messages - Array of message objects with role and content
 * @param {string} params.model - Optional model override
 * @param {Object} params.config - Optional configuration parameters
 * @returns {AsyncGenerator} A stream of text chunks
 */
export const streamAIResponse = async function* ({
  messages,
  model = DEFAULT_MODEL,
  config = {}
}) {
  try {
    const stream = await together.chat.completions.create({
      model,
      messages,
      temperature: config.temperature || 0.7,
      top_p: config.topP || 0.95,
      max_tokens: config.maxTokens || 1000,
      presence_penalty: config.presencePenalty || 0,
      frequency_penalty: config.frequencyPenalty || 0,
      stream: true
    });

    let usage;
    for await (const chunk of stream) {
      if (chunk.choices[0].finish_reason) {
        usage = chunk.usage;
      } else {
        yield chunk.choices[0].delta.content;
      }
    }

    return {
      usage,
      finishReason: 'stop'
    };
  } catch (error) {
    console.error("Error streaming AI response:", error);
    throw error;
  }
};

/**
 * Example tool definitions for structured output
 */
export const structuredOutputTools = {
  extractEntities: {
    type: "function",
    function: {
      name: "extractEntities",
      description: "Extract named entities from text",
      parameters: {
        type: "object",
        properties: {
          entities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                text: { type: "string" },
                type: { type: "string", enum: ["PERSON", "ORG", "LOC", "DATE"] },
                confidence: { type: "number" }
              }
            }
          }
        }
      }
    }
  },
  classifyContent: {
    type: "function",
    function: {
      name: "classifyContent",
      description: "Classify content into predefined categories",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            enum: ["BUSINESS", "TECH", "HEALTH", "OTHER"]
          },
          confidence: { type: "number" },
          subCategories: {
            type: "array",
            items: { type: "string" }
          }
        }
      }
    }
  },
  analyzeImage: {
    type: "function",
    function: {
      name: "analyzeImage",
      description: "Analyze image content and provide structured description",
      parameters: {
        type: "object",
        properties: {
          objects: {
            type: "array",
            items: { type: "string" }
          },
          scene: { type: "string" },
          actions: {
            type: "array",
            items: { type: "string" }
          },
          emotions: {
            type: "array",
            items: { type: "string" }
          }
        }
      }
    }
  }
};
