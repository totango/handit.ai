import express from 'express';
import { createEvaluatorMetric, getEvaluatorMetrics } from '../controllers/evaluatorMetricController.js';
// import your authentication middleware if needed, e.g. import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// router.use(requireAuth); // Uncomment if you have an auth middleware

router.post('/', createEvaluatorMetric);
router.get('/', getEvaluatorMetrics);

export default router; 