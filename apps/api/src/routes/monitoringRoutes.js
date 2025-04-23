import express from 'express';
import {
  me,
  detailByModelId,
  listMyEntries,
  detailEntry,
  updateEntry,
} from '../controllers/monitoringController.js';

const router = express.Router();

router.get('/me', me);
router.get('/models/:id', detailByModelId);
router.get('/list/me/:id', listMyEntries)
router.get('/entry/:id', detailEntry)
router.put('/entry/:id', updateEntry)

export default router;