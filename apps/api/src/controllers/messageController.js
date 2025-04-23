import { generateConversationId, createMessage, createSummaryMessage, getConversationContext } from '../services/messageService.js';

export const generateConversation = async (req, res) => {
  try {
    const conversationId = generateConversationId();
    res.status(201).json({ conversationId });
  } catch (error) {
    console.error('Error generating conversation ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createNewMessage = async (req, res) => {
  try {
    const { conversationId, input, output } = req.body;

    if (!conversationId || !input || !output) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const message = await createMessage(conversationId, input, output);
    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createNewSummary = async (req, res) => {
  try {
    const { conversationId, summary } = req.body;

    if (!conversationId || !summary) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const summaryMessage = await createSummaryMessage(conversationId, summary);
    res.status(201).json(summaryMessage);
  } catch (error) {
    console.error('Error creating summary message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getContext = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const context = await getConversationContext(conversationId);
    res.json(context);
  } catch (error) {
    console.error('Error fetching conversation context:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 