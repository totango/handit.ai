import express from 'express';
import {
  testSend,
} from '../controllers/emailController.js';

const router = express.Router();
router.post('/email', testSend);

export default router;
