import {Router} from 'express';
import { getOrdenController, getOrdenesController, deleteOrdenController, updateOrdenController, createOrdenController, recalcularTotalesController, marcarOrdenCompletadaController, cancelarOrdenController } from '../controllers/orden.controller.js';
import { authenticateJwt } from '../middlewares/authentication.middleware.js';
import { authorizeRoles } from '../middlewares/autorization.middleware.js';

const router = Router();


router
    .get('/', authenticateJwt, authorizeRoles(['administrador', 'fabrica', 'tienda']), getOrdenesController)
    .get('/:id_orden', authenticateJwt, authorizeRoles(['administrador', 'fabrica', 'tienda']), getOrdenController)
    .post('/', authenticateJwt, authorizeRoles(['tienda', 'administrador', 'fabrica']), createOrdenController)
    .put('/:id_orden', authenticateJwt, authorizeRoles(['fabrica', 'administrador', 'tienda']), updateOrdenController)
    .delete('/:id_orden', authenticateJwt, authorizeRoles(['administrador']), deleteOrdenController)
    .post('/recalcular-totales', authenticateJwt, authorizeRoles(['administrador']), recalcularTotalesController)
    .patch('/:id_orden/completada', authenticateJwt, authorizeRoles(['fabrica', 'administrador']), marcarOrdenCompletadaController)
    .patch('/:id_orden/cancelada', authenticateJwt, authorizeRoles(['administrador', 'fabrica']), cancelarOrdenController);

export default router;
