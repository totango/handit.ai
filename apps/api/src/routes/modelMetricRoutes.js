import express from 'express';
import {
  me,
  createModelMetric,
  getAllModelMetrics,
  getModelMetricById,
  updateModelMetric,
  deleteModelMetric,
  getModelMetricsOfModel,
  getCorrectEntriesByDay,
  getNumberOfAlertsByType,
  getLastModelMetrics,
  getEntriesCountByClass,
  getDifferenceLastWeekByClass,
  getComparisonMetricsLastMonth,
} from '../controllers/modelMetricController.js';

const router = express.Router();

router.get('/me', me);
router.get('/model/:id/correct-entries', getCorrectEntriesByDay);
router.get('/model/:id/number-of-alerts-by-type', getNumberOfAlertsByType);
router.get('/model/:id', getModelMetricsOfModel);
router.get('/model/:id/last-model-metrics', getLastModelMetrics);
router.get('/model/:id/count-entries-by-class', getEntriesCountByClass);
router.get('/model/:id/difference-last-week-by-class', getDifferenceLastWeekByClass);
router.get('/model/:id/comparison-metrics-last-month', getComparisonMetricsLastMonth);
router.post('/', createModelMetric);
router.get('/', getAllModelMetrics);
router.get('/:id', getModelMetricById);
router.put('/:id', updateModelMetric);
router.delete('/:id', deleteModelMetric);

export default router;
