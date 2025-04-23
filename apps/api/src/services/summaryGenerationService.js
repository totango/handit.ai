import { generateAIResponse } from './aiService.js';


export const generateSummary = async (conversationId, Message, SummaryMessage) => {
  try {
    // Get the last 5 messages for the conversation
    const messages = await Message.findAll({
      where: { conversationId },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Get the last summary if it exists
    const lastSummary = await SummaryMessage.findOne({
      where: { conversationId },
      order: [['createdAt', 'DESC']]
    });

    // Prepare the context for the AI
    const context = {
      messages: messages.map(msg => ({
        input: msg.input,
        output: msg.output,
        timestamp: msg.createdAt
      })).reverse(), // Reverse to get chronological order
      lastSummary: lastSummary ? lastSummary.summary : null
    };

    // Generate the summary using Llama v4
    const prompt = `Generate a concise summary of the following conversation, taking into account the previous summary if available.

Previous Summary: ${lastSummary ? lastSummary.summary : 'No previous summary'}

Recent Messages:
${context.messages.map(msg => `
Input: ${msg.input}
Output: ${msg.output}
`).join('\n')}

Please provide a clear, concise summary that captures the main points and context of this conversation.`;

    const completion = await generateAIResponse({
      messages: [
        {
          role: "system",
          content: "You are an expert at summarizing conversations. Provide clear, concise summaries that capture the main points and context."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    // Create a new summary message
    const newSummary = await SummaryMessage.create({
      conversationId,
      summary: completion.text
    });

    return newSummary;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
}; 