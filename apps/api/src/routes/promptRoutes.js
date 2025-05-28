import express from 'express';
import {
  getActivePrompt,
} from '../controllers/performanceController.js';

const router = express.Router();

router.get('/:agentSlug/active', getActivePrompt);
export default router;