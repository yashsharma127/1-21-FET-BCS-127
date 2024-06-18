import express from 'express';
import { getProducts, getProductById } from './controllers.js';

const router = express.Router();

router.get('/:category/products', getProducts);
router.get('/:category/products/:productId', getProductById);

export default router;
