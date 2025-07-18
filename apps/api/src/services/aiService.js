import Together from "together-ai";
import OpenAI from 'openai';
import { GoogleGenAI, Type } from '@google/genai';
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

function zodSchemaToGoogleAI(schema) {
  if (schema instanceof z.ZodString) {
    return { type: Type.STRING };
  }
  if (schema instanceof z.ZodNumber) {
    return { type: Type.NUMBER };
  }
  if (schema instanceof z.ZodBoolean) {
    return { type: Type.BOOLEAN };
  }
  if (schema instanceof z.ZodEnum) {
    return { 
      type: Type.STRING,
      enum: schema._def.values
    };
  }
  if (schema instanceof z.ZodArray) {
    return {
      type: Type.ARRAY,
      items: zodSchemaToGoogleAI(schema._def.type)
    };
  }
  if (schema instanceof z.ZodObject) {
    const shape = schema._def.shape();
    const properties = {};
    const propertyOrdering = [];
    
    for (const key in shape) {
      properties[key] = zodSchemaToGoogleAI(shape[key]);
      propertyOrdering.push(key);
    }
    
    return {
      type: Type.OBJECT,
      properties,
      propertyOrdering
    };
  }
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return zodSchemaToGoogleAI(schema._def.innerType);
  }
  return { type: Type.STRING };
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
  isN8N = false,
}) => {
  try {
    let completion;

    if (isN8N) {
      provider = 'TogetherAI';
      model = DEFAULT_MODEL;
      token = process.env.TOGETHER_API_KEY;
    }
    
    if (provider === 'OpenAI') {
      const openai = new OpenAI({
        apiKey: token,
      });
      completion = await openai.chat.completions.create({
        model,
        messages,
        response_format: responseFormat ? zodResponseFormat(responseFormat, 'responseFormat') : null
      });
    } else if (provider === 'GoogleAI') {
      const genAI = new GoogleGenAI({apiKey: token || process.env.GOOGLE_AI_API_KEY});
      
      // Convert OpenAI messages format to Google AI format
      let prompt = '';
      const systemMessage = messages.find(msg => msg.role === 'system');
      
      if (systemMessage) {
        prompt += systemMessage.content + '\n\n';
      }
      
      // Combine user and assistant messages into a conversation format
      const conversationHistory = [];
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        if (message.role === 'user') {
          const content = message.content;
          if (typeof content === 'object') {
            conversationHistory.push(`User: ${JSON.stringify(content)}`);
          } else {
            conversationHistory.push(`User: ${content}`);
          }
        } else if (message.role === 'assistant') {
          const content = message.content;
          if (typeof content === 'object') {
            conversationHistory.push(`Assistant: ${JSON.stringify(content)}`);
          } else {
            conversationHistory.push(`Assistant: ${content}`);
          }
        }
      }
      
      prompt += conversationHistory.join('\n');
      
      // Build config for structured output
      const config = {};
      if (responseFormat) {
        const googleAISchema = zodSchemaToGoogleAI(responseFormat);
        config.responseMimeType = "application/json";
        config.responseSchema = googleAISchema;
      }
      
      const result = await genAI.models.generateContent({
        model: model || 'gemini-1.5-flash',
        contents: prompt,
        config: Object.keys(config).length > 0 ? config : undefined,
      });
      
      // Format response to match OpenAI structure
      completion = {
        choices: [{
          message: {
            content: result.text,
            role: 'assistant'
          },
          finish_reason: 'stop'
        }],
        usage: {
          prompt_tokens: 0, // Google AI doesn't provide token counts in the same way
          completion_tokens: 0,
          total_tokens: 0
        }
      };
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
    const together = new Together({
      apiKey: process.env.TOGETHER_API_KEY,
    });
    
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
