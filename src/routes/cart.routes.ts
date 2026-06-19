import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/', CartController.getCart);
router.post('/', CartController.addToCart);
router.put('/:productId', CartController.updateCart);
router.delete('/:productId', CartController.removeFromCart);
router.post('/clear', CartController.clearCart);

export default router;
