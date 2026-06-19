import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const router = Router();

router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);

export default router;
