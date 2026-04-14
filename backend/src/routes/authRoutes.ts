import express from 'express';
const router = express.Router();
import { registerUser, loginUser, getUserProfile, updateUserProfile } from '../controllers/authController';
import { googleAuth } from '../controllers/googleAuthController';
import { protect } from '../middlewares/authMiddleware';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

export default router;
