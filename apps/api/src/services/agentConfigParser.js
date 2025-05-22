import { z } from 'zod';
import { generateAIResponse } from './aiService.js';


// Define the Zod schema for the configuration
const NodeSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  type: z.enum(['model', 'tool']),
  position: z.object({
    x: z.number(),
    y: z.number()
  }),
  next_nodes: z.array(z.object({
    slug: z.string(),
    input_name: z.string(),
    output_name: z.string()
  })),
  model: z.object({
    provider: z.string(),
    problem_type: z.string(),
    parameters: z.object({
      type: z.string(),
    })
  }).optional(),
  tool_type: z.string().optional()
});

const AgentConfigSchema = z.object({
  agent: z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string()
  }),
  nodes: z.array(NodeSchema)
});

export const parseAgentConfig = async (rawConfig) => {
  try {
    const prompt = `Parse and structure the following agent configuration into a standardized format. 
    The configuration should follow this structure:
    {
      "agent": {
        "name": string,
        "slug": string (camelCase),
        "description": string
      },
      "nodes": [
        {
          "name": string,
          "slug": string (camelCase),
          "description": string,
          "type": "model" | "tool",
          "position": { "x": number, "y": number },
          "next_nodes": [
            {
              "slug": string,
              "input_name": string,
              "output_name": string
            }
          ]
        }
      ]
    }

    For model nodes, include:
    - model configuration (provider, parameters, etc.)
    - problem type
    - description

    For tool nodes, include:
    - tool type
    - description
    - configuration

    Arrange nodes in a top-to-bottom layout with proper spacing, and make sure the nodes are not overlapping, so use 300 units of spacing between nodes on Y axis and 300 units of spacing between nodes on X axis.
    Original configuration:
    ${JSON.stringify(rawConfig, null, 2)}`;

    const completion = await generateAIResponse({
      messages: [
        {
          role: "system",
          content: "You are an expert at parsing and structuring agent configurations. Always ensure proper node positioning and connection mapping."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      responseFormat: AgentConfigSchema,
      token: process.env.TOGETHER_API_KEY
    });

    const parsedConfig = JSON.parse(completion.choices[0].message.content);
    return parsedConfig;
  } catch (error) {
    console.error('Error parsing agent config:', error);
    throw error;
  }
}; 