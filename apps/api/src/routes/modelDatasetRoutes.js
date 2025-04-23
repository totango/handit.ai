import express from 'express';
import {
  createModelDataset,
  getAllModelDatasets,
  getModelDatasetById,
  updateModelDataset,
  deleteModelDataset,
} from '../controllers/modelDatasetController.js';

const router = express.Router();

router.post('/', createModelDataset);
router.get('/', getAllModelDatasets);
router.get('/:id', getModelDatasetById);
router.put('/:id', updateModelDataset);
router.delete('/:id', deleteModelDataset);

export default router;
