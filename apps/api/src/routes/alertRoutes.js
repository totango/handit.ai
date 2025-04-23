import express from 'express';
import { getAlertById } from '../controllers/alertController.js';

const router = express.Router();

router.get('/:id', getAlertById);

export default router;
