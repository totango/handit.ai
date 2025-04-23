import express from 'express';
import { checkBatchStatusController } from '../controllers/checkController.js';

const router = express.Router();

router.get('/batch-status', checkBatchStatusController);

export default router;
