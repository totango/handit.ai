import express from 'express';
import {
  urlsToTrack,
  track,
  endTrack,
  bulkTrack,
} from '../controllers/trackController.js';

const router = express.Router();
router.get('/urls-to-track', urlsToTrack);
router.post('/', track);
router.post('/end', endTrack);
router.post('/bulk', bulkTrack);


export default router;