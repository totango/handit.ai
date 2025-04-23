import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { executeToolTrack, executeTrack } from '../../services/trackService.js';
import db from '../../../models/index.js';
import { endTrack } from '../../controllers/trackController.js';
import { generateAIResponse } from '../../services/aiService.js';


const { ModelLog } = db;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const EmailInfoSchema = z.object({
  recipient: z.string(),
  subject: z.string(),
  purpose: z.string(),
  tone: z.enum(['formal', 'casual']),
  importantData: z.array(z.string()),
  description: z.string()
});

export const preprocessEmailInfo = async (agentNode, data) => {
  const startTime = new Date();
  const messages = [
    {
      role: 'system',
      content: `You are an expert at analyzing email requests and extracting key information. 
      Your task is to extract the following information from the input text:
      - recipient: The email recipient (if not specified, use "recipient@example.com")
      - subject: A clear subject line for the email
      - purpose: The main purpose or goal of the email
      - tone: The appropriate tone (formal or casual)
      - importantData: Key points or data that should be included
      - description: A brief description of what the email should convey

      Make reasonable assumptions when information is not explicitly provided.
      The output should be a structured object with these fields.`
    },
    {
      role: 'user',
      content: data.input
    }
  ];
  try {
    

    const completion = await generateAIResponse({
      messages,
      responseFormat: EmailInfoSchema,
    })


    const processedData = {
      ...data,
      processedInput: JSON.parse(completion.choices[0].message.content)
    };

    const duration = new Date() - startTime;
    const output = {
      ...processedData,
      output: processedData.processedInput,
      duration
    };

    // Track the preprocessing step
    const trackResult = await executeTrack(agentNode, {
      input: messages,
      output
    }, ModelLog);
    const agentLogId = trackResult.agentLogId;
    return {
      ...output,
      agentLogId
    };
  } catch (error) {
    const duration = new Date() - startTime;
    const errorOutput = {
      ...data,
      error: error.message,
      duration
    };
    
    // Track the error
    await executeToolTrack(agentNode, {
      input: messages,
      output: errorOutput
    }, ModelLog);
    
    return errorOutput;
  }
};

export const sendEmail = async (agentNode, data, agentLogId) => {
  const startTime = new Date();
  try {
    // Mock email sending
    const mockResponse = {
      status: 'success',
      messageId: `mock-${Date.now()}`,
      sentAt: new Date().toISOString(),
      recipient: data.processedInput.recipient,
      subject: data.output.subject,
      message: data.output.body
    };

    const output = {
      ...data,
      output: mockResponse,
      duration: new Date() - startTime
    };
    
    // Track the email sending step
    const result = await executeToolTrack(agentNode, {
      ...output,
      agentLogId
    });
    

    await endTrack({
      body: {
        agentLogId,
      }
    }, {status: (code) => {
      return {
        json: (data) => {
          return {
            status: code,
            message: 'Email sent successfully'
          }
        }
      }
    }})
    console.log(result);
    return output;
  } catch (error) {
    const duration = new Date() - startTime;
    const errorOutput = {
      ...data,
      error: error.message,
      duration
    };
    
    // Track the error
    await executeToolTrack(agentNode, errorOutput);
    
    return errorOutput;
  }
}; 