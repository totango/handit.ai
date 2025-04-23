import express from 'express';
import {
  getOptimizedPrompt,
} from '../controllers/performanceController.js';

const router = express.Router();

router.get('/model/:id/optimized-prompt', getOptimizedPrompt);
export default router;