import express from 'express';
import {
  getABCorrectEntriesByDay,
  getABMetricsById,
  getABPrompts,
  runModelABBatch,
  getMetricsFullDate,
  getOptimizedModel,
  getReferenceLines,
} from '../controllers/abTestController.js';

const router = express.Router();

router.get('/model/:id', getABMetricsById);
router.post('/run-model-ab-batch/:id', runModelABBatch);
router.get('/model/:id/correct-entries-by-day', getABCorrectEntriesByDay);
router.get('/model/:id/prompts', getABPrompts);
router.get('/model/:id/metrics-full-date', getMetricsFullDate);
router.get('/model/:id/optimized', getOptimizedModel);
router.get('/model/:id/reference-lines', getReferenceLines);
export default router;
