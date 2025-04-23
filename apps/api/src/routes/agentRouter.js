import express from 'express';
import multer from 'multer';
import { uploadAgent } from '../controllers/agentController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


// Upload agent configuration
router.post('/upload', upload.single('file'), uploadAgent);

export default router; 