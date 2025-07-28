import { executeTrack } from '../../services/trackService.js';
import db from '../../../models/index.js';
import { generateAIResponse } from '../../services/aiService.js';

const { ModelLog } = db;

export const generateEmail = async (model, data, agentLogId, prompt = null) => {
  const startTime = new Date();
  const { recipient, subject, purpose, tone, importantData, description } = data.processedInput;
    
    const messages = [
      {
        role: 'system',
        content: prompt ? prompt + "DO NOT ADD ANY DATA THAT IS NOT PASSED IN THE USER INPUT AND NEVER ADD PLACEHOLDERS." : `Generate an email in Spanish with the following details. The tone should feel casual, spontaneous, like something quickly written on a phone between tasks. Don't worry about perfect grammar or structure — just focus on getting the message out in a way that feels real. You can use expressions like "bueno", "eh", or personal asides if it fits.

Here’s an example of the vibe:

Ejemplo:
Hola, mira que estaba pensando en eso que me dijiste pero no sé, como que no estoy muy claro todavía. Igual cualquier cosa dime y vemos qué onda. ¡Saludos!

Now, write the email with the following information:`
      },
      {
        role: 'user',
        content: `Generate an email with the following details:
        Recipient: ${recipient}
        Subject: ${subject}
        Purpose: ${purpose}
        Tone: ${tone}
        Important Data: ${importantData.join(', ')}
        Description: ${description}
        ` +
        (prompt ?'DO NOT ADD ANY DATA THAT IS NOT PASSED IN THE USER INPUT AND NEVER ADD PLACEHOLDERS. if no data exists do not add placeholders or random data, structure the email in a way it avoids placeholders and random data.' :  '')
      }
    ];
  try {
    

    const completion = await generateAIResponse({
      messages,
    });

    const generatedEmail = completion.choices[0].message.content;
    const duration = new Date() - startTime;

    const output = {
      ...data,
      output: {
        subject: `RE: ${subject}`,
        body: generatedEmail,
        metadata: {
          generatedAt: new Date().toISOString(),
          tone,
          purpose
        }
      },
      duration
    };

    // Track the email generation step
    const track = await executeTrack(model, {
      input: messages,
      output,
      agentLogId
    }, ModelLog);

    return { ...output, modelLogId: track.modelLogId, agentLogId: track.agentLogId };
  } catch (error) {
    const duration = new Date() - startTime;
    const errorOutput = {
      ...data,
      error: error.message,
      duration
    };
    
    // Track the error
    await executeTrack(model, errorOutput);
    
    return errorOutput;
  }
}; 