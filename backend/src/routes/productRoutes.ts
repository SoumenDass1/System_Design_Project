import express from 'express';
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
import { protect, admin } from '../middlewares/authMiddleware';

router.route('/').get(getProducts).post(protect, admin, createProduct);
router
    .route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

export default router;
