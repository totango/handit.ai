import express from 'express';
import {
  createCompanyMetricModel,
  getAllCompanyMetricModels,
  getCompanyMetricModelById,
  updateCompanyMetricModel,
  deleteCompanyMetricModel,
} from '../controllers/companyMetricModelController.js';

const router = express.Router();

router.post('/', createCompanyMetricModel);
router.get('/', getAllCompanyMetricModels);
router.get('/:id', getCompanyMetricModelById);
router.put('/:id', updateCompanyMetricModel);
router.delete('/:id', deleteCompanyMetricModel);

export default router;
