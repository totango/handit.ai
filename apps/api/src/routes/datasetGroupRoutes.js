import express from 'express';
import {
  me,
  createDatasetGroup,
  getAllDatasetGroups,
  getDatasetGroupById,
  updateDatasetGroup,
  deleteDatasetGroup,
} from '../controllers/datasetGroupController.js';

const router = express.Router();

router.get('/me', me);
router.post('/', createDatasetGroup);
router.get('/', getAllDatasetGroups);
router.get('/:id', getDatasetGroupById);
router.put('/:id', updateDatasetGroup);
router.delete('/:id', deleteDatasetGroup);

export default router;
