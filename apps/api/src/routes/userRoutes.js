import express from 'express';
import {
  me,
  createUser,
  getAllUsers,
  getUserById,
  updateMe,
  updateUser,
  deleteUser,
  updatePassword,
  updateOnboardingProgress,
} from '../controllers/userController.js';

const router = express.Router();
router.put('/password', updatePassword);
router.get('/me', me);
router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/me', updateMe);
router.put('/me/onboarding', updateOnboardingProgress);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;