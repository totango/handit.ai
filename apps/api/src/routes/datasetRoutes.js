import express from 'express';
import {
  createDataset,
  getMyDatasets,
  getDatasetsByGroupId,
  getDatasetsByModelId,
  getAllDatasets,
  getDatasetById,
  updateDataset,
  deleteDataset,
} from '../controllers/datasetController.js';

const router = express.Router();
router.post('/', createDataset);
router.get('/me', getMyDatasets);
router.get('/by-group/:id', getDatasetsByGroupId);
router.get('/by-model/:id', getDatasetsByModelId);
router.get('/', getAllDatasets);
router.get('/:id', getDatasetById);
router.put('/:id', updateDataset);
router.delete('/:id', deleteDataset);

export default router;
