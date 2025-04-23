import express from 'express';
import {
  startEvaluatorTraining,
  getTrainingStatus,
  completeEvaluatorSetup
} from '../controllers/evaluatorController.js';

const router = express.Router();

router.post('/model/:modelId/evaluator/train', startEvaluatorTraining);
router.get('/model/:modelId/evaluator/status', getTrainingStatus);
router.post('/model/:modelId/evaluator/complete', completeEvaluatorSetup);

export default router; 