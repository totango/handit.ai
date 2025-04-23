import express from 'express';
const router = express.Router();
import {
  createEvaluationPrompt,
  updateEvaluationPrompt,
  getEvaluationPrompts,
  associatePromptToModel,
  getPromptsForModel,
  updateAssociation,
  deleteAssociation,
  getEvaluationPromptStats,
} from '../controllers/reviewersTemplateController.js';

// Create a new evaluation prompt (template)
router.post('/evaluation-prompts', createEvaluationPrompt);
// Update an evaluation prompt
router.put('/evaluation-prompts/:id', updateEvaluationPrompt);
// Get all evaluation prompts (company + global)
router.get('/evaluation-prompts', getEvaluationPrompts);
// Associate a prompt to a model
router.post('/models/:modelId/evaluation-prompts', associatePromptToModel);
// Get all prompts associated to a model
router.get('/models/:modelId/evaluation-prompts', getPromptsForModel);
// Update an existing association
router.put('/evaluation-prompts/associations/:id', updateAssociation);
// Delete an association
router.delete('/evaluation-prompts/associations/:id', deleteAssociation);
// Evaluator statistics endpoint
router.get('/evaluation-prompts/stats', getEvaluationPromptStats);

export default router; 