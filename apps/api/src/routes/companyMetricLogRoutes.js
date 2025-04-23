import express from 'express';
import {
  createCompanyMetricLog,
  getAllCompanyMetricLogs,
  getCompanyMetricLogById,
  updateCompanyMetricLog,
  deleteCompanyMetricLog,
} from '../controllers/companyMetricLogController.js';

const router = express.Router();

router.post('/', createCompanyMetricLog);
router.get('/', getAllCompanyMetricLogs);
router.get('/:id', getCompanyMetricLogById);
router.put('/:id', updateCompanyMetricLog);
router.delete('/:id', deleteCompanyMetricLog);

export default router;
