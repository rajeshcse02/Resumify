import express from 'express';
import { register, login, changePassword } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/change-password', verifyToken, changePassword);

export default router;
