import express from 'express';
import { applySuggestionsToModel, useOptimizedPrompt } from '../controllers/automaticOptimizationController.js';

const router = express.Router();

router.post('/:modelId/apply-suggestions', applySuggestionsToModel);
router.post('/:modelId/use-optimized-prompt', useOptimizedPrompt);

export default router;
