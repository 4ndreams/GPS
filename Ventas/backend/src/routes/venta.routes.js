import {Router} from 'express';
import {
    getVentaController,
    getVentasController,
    deleteVentaController,
    updateVentaController,
    createVentaController
} from '../controllers/venta.controller.js';
import { authenticateJwt } from '../middlewares/authentication.middleware.js';
import { authorizeRoles } from '../middlewares/autorization.middleware.js';

const router = Router();
router
    .get('/', authenticateJwt, authorizeRoles(['administrador', 'tienda']), getVentasController)
    .get('/:id_venta', authenticateJwt, authorizeRoles(['administrador', 'tienda', 'cliente']), getVentaController)
    .post('/', authenticateJwt, authorizeRoles(['cliente', 'tienda', 'administrador']), createVentaController)
    .put('/:id_venta', authenticateJwt, authorizeRoles(['tienda', 'administrador']), updateVentaController)
    .delete('/:id_venta', authenticateJwt, authorizeRoles(['administrador']), deleteVentaController);

export default router;