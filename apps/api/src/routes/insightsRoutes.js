import express from 'express';
import { getInsightsOfModel } from '../controllers/insightsController.js';

const router = express.Router();
router.get('/:modelId', getInsightsOfModel);

export default router;
