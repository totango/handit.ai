import express from 'express';
import { getNodeMetricsController, getOptimizedNodeMetricsController, getNodeInsightsController } from '../controllers/nodeMetricsController.js';

const router = express.Router();

router.post('/', getNodeMetricsController);
router.post('/optimized', getOptimizedNodeMetricsController);
router.post('/insights', getNodeInsightsController);

export default router; 