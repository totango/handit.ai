import express from 'express';
import { createIntegrationToken, updateIntegrationToken, getIntegrationTokens, setOptimizationToken, testIntegrationToken } from '../controllers/integrationTokenController.js';
// import your authentication middleware if needed, e.g. import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// router.use(requireAuth); // Uncomment if you have an auth middleware

router.post('/', createIntegrationToken);
router.put('/:id', updateIntegrationToken);
router.get('/', getIntegrationTokens);
router.post('/set-optimization-token', setOptimizationToken);
router.post('/:id/test', testIntegrationToken);

export default router; 