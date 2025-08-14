import express from 'express';
import {
  create,
  get,
  update,
  createNode,
  createConnection,
  updateConnection,
  updateNode,
  getAllAgents,
  getAgentMetrics,
  deleteNode,
  deleteConnection,
  getAgentComparisonMetricsLastMonthAgent,
  getAgentToolComparisonMetricsLastMonthAgent,
  getAgentEntries,
  getAgentEntry,
  getAgentEntryFlow,
  cloneAgent,
  uploadAgent,
  getAgentCorrectEntriesByDay,
} from '../controllers/agentController.js';
import {
  getAgentEntriesOptimized,
  getAgentEntriesJobStatus,
} from '../controllers/optimizedAgentController.js';
import {
  getAgentMetricsOptimized,
} from '../controllers/optimizedMetricsController.js';
import multer from 'multer';


const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post('/', create);
router.get('/', getAllAgents);
router.get('/:id', get);
router.put('/:id', update);
router.post('/nodes', createNode);
router.put('/nodes/:id', updateNode);
router.delete('/nodes/:id', deleteNode);
router.post('/connections', createConnection);
router.put('/connections/:id', updateConnection);
router.delete('/connections/:id', deleteConnection);
router.get('/:id/metrics', getAgentMetricsOptimized); // Use optimized version
router.get('/:id/metrics/legacy', getAgentMetrics); // Keep legacy as fallback
router.get('/:id/comparison-metrics-last-month', getAgentComparisonMetricsLastMonthAgent);
router.get('/:id/tool-comparison-metrics-last-month', getAgentToolComparisonMetricsLastMonthAgent);
router.get('/:id/entries', getAgentEntriesOptimized); // Use optimized version
router.get('/:id/entries/legacy', getAgentEntries); // Keep legacy as fallback
router.get('/:id/entries/status', getAgentEntriesJobStatus); // Job status endpoint
router.get('/:agentId/entries/:entryId', getAgentEntry);
router.get('/:agentId/entries/:entryId/flow', getAgentEntryFlow);
router.post('/:id/clone', cloneAgent);
router.post('/upload', upload.single('file'), uploadAgent);
router.get('/:id/correct-entries', getAgentCorrectEntriesByDay);
 

export default router;
