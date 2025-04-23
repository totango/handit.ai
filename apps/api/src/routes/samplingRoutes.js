import express from 'express';
import { sampleNodes, sampleOptimizedModel, sampleAgentEntriesExecute } from '../controllers/samplingController.js';

const router = express.Router();

router.post('/sample', sampleNodes);
router.post('/sample-optimized-model', sampleOptimizedModel);
router.post('/sample-agent-entries', sampleAgentEntriesExecute);
export default router; 