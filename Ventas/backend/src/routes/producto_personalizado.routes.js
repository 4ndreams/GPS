import { Router } from 'express';
import { getProductosPersonalizadosByUserController,
         getProductoPersonalizadoController,
         getProductosPersonalizadosController,
         createProductoPersonalizadoController,
         updateProductoPersonalizadoController,
         updateEstadoProductoPersonalizadoController,
         deleteProductoPersonalizadoController } from '../controllers/producto_personalizado.controller.js';
import { authenticateJwt } from '../middlewares/authentication.middleware.js';
import { optionalAuthJwt } from '../middlewares/optionalAuth.middleware.js';

const router = Router();
router
    .get('/', getProductosPersonalizadosController) // Permite acceso a todos los usuarios, autenticados o no
    .get('/my', authenticateJwt, getProductosPersonalizadosByUserController) // Requiere autenticación
    .get('/:id_producto_personalizado', optionalAuthJwt, getProductoPersonalizadoController) // Opcional
    .post('/', optionalAuthJwt, createProductoPersonalizadoController) // Opcional - permite usuarios logueados y anónimos
    .put('/:id_producto_personalizado', authenticateJwt, updateProductoPersonalizadoController) // Requiere autenticación
    .patch('/:id_producto_personalizado/estado', authenticateJwt, updateEstadoProductoPersonalizadoController) // Requiere autenticación - solo para actualizar estado
    .delete('/:id_producto_personalizado', authenticateJwt, deleteProductoPersonalizadoController); // Requiere autenticación
export default router;