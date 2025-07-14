import {Router} from 'express';
import { getProductoController, 
             getProductosController, 
             createProductoController, 
             updateProductoController, 
             deleteProductoController } from '../controllers/producto.controller.js';
import { authenticateJwt } from '../middlewares/authentication.middleware.js';
import { authorizeRoles } from '../middlewares/autorization.middleware.js';

const router = Router();
router
    .get('/', getProductosController) // Público - cualquiera puede ver productos
    .get('/:id_producto', getProductoController) // Público - ver producto específico
    .post('/', authenticateJwt, authorizeRoles(['fabrica', 'administrador']), createProductoController)
    .put('/:id_producto', authenticateJwt, authorizeRoles(['fabrica', 'administrador']), updateProductoController)
    .delete('/:id_producto', authenticateJwt, authorizeRoles(['administrador']), deleteProductoController);
export default router;