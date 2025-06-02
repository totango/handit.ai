import { randomBytes } from 'crypto';
import db from '../../models/index.js';

const { Message, SummaryMessage } = db;

export const generateConversationId = () => {
  return randomBytes(16).toString('hex');
};

export const createMessage = async (conversationId, input, output) => {
  try {
    const message = await Message.create({
      conversationId,
      input,
      output
    });
    return message;
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
};

export const createSummaryMessage = async (conversationId, summary) => {
  try {
    const summaryMessage = await SummaryMessage.create({
      conversationId,
      summary
    });
    return summaryMessage;
  } catch (error) {
    console.error('Error creating summary message:', error);
    throw error;
  }
};

export const getConversationContext = async (conversationId) => {
  try {
    // Get the last two messages
    const messages = await Message.findAll({
      where: { conversationId },
      order: [['createdAt', 'DESC']],
      limit: 2
    });

    // Get the latest summary
    const summary = await SummaryMessage.findOne({
      where: { conversationId },
      order: [['createdAt', 'DESC']]
    });

    return {
      messages: messages.reverse(), // Return in chronological order
      summary: summary?.summary || null
    };
  } catch (error) {
    console.error('Error fetching conversation context:', error);
    throw error;
  }
}; 