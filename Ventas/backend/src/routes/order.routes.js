import { Router } from 'express';
import { 
    createPaymentOrder, 
    verifyPaymentStatus, 
    handleWebhook, 
    getUserOrders 
} from '../controllers/order.controller.js';
import { authenticateJwt } from '../middlewares/authentication.middleware.js';

const router = Router();

// Crear orden de pago (puede ser usado por usuarios logueados o no)
router.post('/create-payment', createPaymentOrder);

// Verificar estado del pago
router.get('/verify-payment/:paymentId/:orderId', verifyPaymentStatus);

// Webhook de Mercado Pago
router.post('/webhook', handleWebhook);

// Obtener órdenes del usuario (requiere autenticación)
router.get('/user-orders', authenticateJwt, getUserOrders);

export default router;
