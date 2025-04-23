import express from 'express';
import {
  createModelLog,
  getAllModelLogs,
  getModelLogById,
  updateModelLog,
  deleteModelLog,
  getMineModelLogs,
  countMineModelLogs,
  getRandomModelLogAssociatedToModel
} from '../controllers/modelLogController.js';

const router = express.Router();

router.get('/random/log/:id', getRandomModelLogAssociatedToModel)
router.post('/', createModelLog);
router.get('/', getAllModelLogs);
router.get('/me', getMineModelLogs);
router.get('/count/me', countMineModelLogs);
router.get('/:id', getModelLogById);
router.put('/:id', updateModelLog);
router.delete('/:id', deleteModelLog);

export default router;
