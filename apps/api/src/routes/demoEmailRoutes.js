import express from 'express';
import { enhancePromptFunc, evaluateEmail, generateEmail, generateInsight } from '../controllers/demoEmailController.js';

const router = express.Router();

router.post('/generate', generateEmail);
router.post('/evaluate', evaluateEmail);
router.post('/insight', generateInsight);
router.post('/enhance-prompt', enhancePromptFunc);
export default router; 