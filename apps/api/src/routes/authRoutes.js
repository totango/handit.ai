import express from 'express';
import { signup, login, signupCompany, registerEmail } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/signup-company', signupCompany);
router.post('/email-register', registerEmail);

export default router;
