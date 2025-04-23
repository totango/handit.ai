import express from 'express';
import { sendWeeklyEmails } from '../controllers/weeklyEmailController.js';

const router = express.Router();

// Protected route that requires admin authentication
router.post('/send', sendWeeklyEmails);

export default router;