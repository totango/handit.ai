import express from 'express';
import {
  sendAutonomEmail,
  sendWelcomeEmail
} from '../controllers/emailAutonomController.js';

const router = express.Router();
router.post('/email', sendAutonomEmail);
router.post('/welcome', sendWelcomeEmail);

export default router;
