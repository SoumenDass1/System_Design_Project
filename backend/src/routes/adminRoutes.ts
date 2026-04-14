import express from 'express';
const router = express.Router();
const {
    getDashboardStats,
    getAllUsers,
    updateUserRole,
    getAllOrders
} = require('../controllers/adminController');
import { protect, admin } from '../middlewares/authMiddleware';

// All routes are protected and require admin role
router.use(protect, admin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.get('/orders', getAllOrders);

export default router;



























