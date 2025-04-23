import express from 'express';
import { generateConversation, createNewMessage, createNewSummary, getContext } from '../controllers/messageController.js';

const router = express.Router();

// Generate a new conversation ID
router.post('/conversation', generateConversation);

// Create a new message
router.post('/message', createNewMessage);

// Create a summary message
router.post('/summary', createNewSummary);

// Get conversation context (last 2 messages and summary)
router.get('/context/:conversationId', getContext);

export default router; 