import express from 'express';
import {
  me,
  createModel,
  getAllModels,
  getModelById,
  updateModel,
  deleteModel,
} from '../controllers/modelController.js';

const router = express.Router();

router.get('/me', me);
router.post('/', createModel);
router.get('/', getAllModels);
router.get('/:id', getModelById);
router.put('/:id', updateModel);
router.delete('/:id', deleteModel);

export default router;
