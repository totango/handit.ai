import express from 'express';
import {
  me,
  createCompanyMetric,
  getAllCompanyMetrics,
  getCompanyMetricById,
  updateCompanyMetric,
  deleteCompanyMetric,
} from '../controllers/companyMetricController.js';

const router = express.Router();

router.get('/me', me);
router.post('/', createCompanyMetric);
router.get('/', getAllCompanyMetrics);
router.get('/:id', getCompanyMetricById);
router.put('/:id', updateCompanyMetric);
router.delete('/:id', deleteCompanyMetric);

export default router;
