import express from 'express';
import {
  createModelMetricLog,
  getAllModelMetricLogs,
  getModelMetricLogById,
  updateModelMetricLog,
  deleteModelMetricLog,
  calculateMetricsForModel,
  fixCorrectnessForModel,
  autoEvaluateModel,
  generateInsightsForModel,
  fixSuccessForModel,
  fixNodeStatusForModel,
  fixAgentLogStatus,
  fixModelLogsStatus,
  summaryEvaluations,
  autoEvaluateSingleInstance,
  detectProblemTypeFunc,
  autoEvaluateBatch,
  checkBatchStatusController,
} from '../controllers/modelMetricLogController.js';

const router = express.Router();

router.post('/', createModelMetricLog);
router.get('/', getAllModelMetricLogs);
router.get('/:id', getModelMetricLogById);
router.put('/:id', updateModelMetricLog);
router.delete('/:id', deleteModelMetricLog);
router.post('/calculate/:id', calculateMetricsForModel);
router.post('/auto-evaluate/:id', autoEvaluateModel);
router.post('/generate-insights/:id', generateInsightsForModel);
router.post('/fix-correct/:id', fixCorrectnessForModel);
router.post('/fix-success/:id', fixSuccessForModel);
router.post('/fix-node-status/:id', fixNodeStatusForModel);
router.post('/fix-agent-log-status/:id', fixAgentLogStatus);
router.post('/fix-model-logs-status/:id', fixModelLogsStatus);
router.post('/summary/:id', summaryEvaluations);
router.post('/single-auto-evaluate/:id', autoEvaluateSingleInstance)
router.post('/detect-problem-type/:id', detectProblemTypeFunc);
router.post('/auto-evaluate-batch/:id', autoEvaluateBatch);
router.get('/batch-status/:batchId', checkBatchStatusController);
export default router;