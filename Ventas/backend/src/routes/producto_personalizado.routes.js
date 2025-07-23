import { Router } from 'express';
import { getMyProductosPersonalizadosController,
         getProductoPersonalizadoController,
         getProductosPersonalizadosController,
         createProductoPersonalizadoController,
         updateProductoPersonalizadoController,
         updateEstadoProductoPersonalizadoController,
         deleteProductoPersonalizadoController } from '../controllers/producto_personalizado.controller.js';
import { authenticateJwt } from '../middlewares/authentication.middleware.js';
import { optionalAuthJwt } from '../middlewares/optionalAuth.middleware.js';
import { isFabricaOrAdmin, authorizeRoles } from '../middlewares/autorization.middleware.js';

const router = Router();
router
    .get('/', getProductosPersonalizadosController) // Público - permite acceso a todos
    .get('/my', authenticateJwt, getMyProductosPersonalizadosController) // Requiere autenticación - mis cotizaciones
    .get('/:id_producto_personalizado', optionalAuthJwt, getProductoPersonalizadoController) // Público/opcional
    .post('/', optionalAuthJwt, createProductoPersonalizadoController) // Público - permite usuarios logueados y anónimos
    .put('/:id_producto_personalizado', authenticateJwt, isFabricaOrAdmin, updateProductoPersonalizadoController) // Solo fábrica/admin pueden editar
    .patch('/:id_producto_personalizado/estado', authenticateJwt, isFabricaOrAdmin, updateEstadoProductoPersonalizadoController) // Solo fábrica/admin pueden cambiar estado
    .delete('/:id_producto_personalizado', authenticateJwt, authorizeRoles('administrador'), deleteProductoPersonalizadoController); // Solo admin puede eliminar
export default router;