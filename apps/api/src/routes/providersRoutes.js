import express from 'express';

const router = express.Router();
import {
  getProviders
} from '../controllers/providersController.js';

/**
 * @route   GET /
 * @desc    Get all providers
 */
router.get('/', getProviders);
export default router; 
