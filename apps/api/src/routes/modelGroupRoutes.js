import express from 'express';
import {
  createModelGroup,
  getAllModelGroups,
  getModelGroupById,
  updateModelGroup,
  deleteModelGroup,
} from '../controllers/modelGroupController.js';

const router = express.Router();

router.post('/', createModelGroup);
router.get('/', getAllModelGroups);
router.get('/:id', getModelGroupById);
router.put('/:id', updateModelGroup);
router.delete('/:id', deleteModelGroup);

export default router;
