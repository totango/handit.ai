import express from 'express';
import { getAgentStructureController } from '../controllers/agentStructureController.js';

const router = express.Router();

router.get('/:agentId', getAgentStructureController);

export default router; 