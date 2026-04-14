import express from 'express';
const router = express.Router();
const {
    forgotPassword,
    resetPassword,
    changePassword
} = require('../controllers/passwordController');
import { protect } from '../middlewares/authMiddleware';

// Public routes
router.post('/forgot', forgotPassword);
router.post('/reset', resetPassword);

// Protected route - requires login
router.put('/change', protect, changePassword);

export default router;
