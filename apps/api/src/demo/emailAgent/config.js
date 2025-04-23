import { z } from 'zod';

// Define the input schema for validation
export const inputSchema = z.object({
  text: z.string().min(1, 'Text input is required')
});

// Define the output schema for validation
export const outputSchema = z.object({
  email: z.object({
    subject: z.string(),
    body: z.string(),
    metadata: z.object({
      recipient: z.string(),
      purpose: z.string(),
      tone: z.string(),
      importantData: z.array(z.string()),
      description: z.string()
    })
  })
});

// Define the agent configuration
export const emailAgentConfig = {
  name: 'Faulty Email Assistant',
  description: 'An agent that generates deliberately unprofessional emails with various issues',
  nodes: [
    {
      id: 'preprocess',
      name: 'Preprocess Email Info',
      type: 'tool',
      slug: 'preprocessEmailInfo',
      description: 'Extracts and structures information from the input text',
      initialNode: true,
      config: {
        operationType: 'preprocessing',
        inputSchema,
        outputSchema: z.object({
          recipient: z.string(),
          subject: z.string(),
          purpose: z.string(),
          tone: z.string(),
          importantData: z.array(z.string()),
          description: z.string()
        })
      }
    },
    {
      id: 'generate',
      name: 'Generate Email',
      type: 'llm',
      slug: 'generateEmail',
      description: 'Generates a deliberately bad email based on the structured information',
      config: {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 1000,
        systemPrompt: `You are an AI that generates deliberately unprofessional emails with various issues. 
        Your task is to create emails that have:
        1. Inappropriate tone and language
        2. Excessive urgency markers
        3. Irrelevant personal details
        4. Poor formatting and structure
        5. Unnecessary repetition
        6. Random sender information
        7. Inconsistent formatting
        8. Excessive use of filler words
        9. Unprofessional subject lines
        10. Inappropriate postscripts
        
        The email should be based on the provided information but should deliberately violate professional email writing standards.`
      }
    },
    {
      id: 'send',
      name: 'Send Email',
      type: 'tool',
      slug: 'sendEmail',
      description: 'Simulates sending the generated email',
      endNode: true,
      config: {
        operationType: 'sending',
        inputSchema: z.object({
          email: z.object({
            subject: z.string(),
            body: z.string(),
            metadata: z.object({
              recipient: z.string(),
              purpose: z.string(),
              tone: z.string(),
              importantData: z.array(z.string()),
              description: z.string()
            })
          })
        })
      }
    }
  ],
  edges: [
    {
      from: 'preprocess',
      to: 'generate',
      inputName: 'input',
      outputName: 'processedInput'
    },
    {
      from: 'generate',
      to: 'send',
      inputName: 'generatedEmail',
      outputName: 'email'
    }
  ]
}; 