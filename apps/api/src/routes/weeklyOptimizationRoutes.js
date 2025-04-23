import express from 'express';
import { runWeeklyOptimization } from '../controllers/weeklyOptimizationController.js';

const router = express.Router();

router.post('/run', runWeeklyOptimization);

export default router; 