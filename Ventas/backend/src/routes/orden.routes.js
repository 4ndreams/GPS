import {Router} from 'express';
import { getOrdenController, getOrdenesController, deleteOrdenController, updateOrdenController, createOrdenController } from '../controllers/orden.controller.js';
import { authenticateJwt } from '../middlewares/authentication.middleware.js';
import { authorizeRoles } from '../middlewares/autorization.middleware.js';

const router = Router();

// 🔒 RUTAS CON AUTENTICACIÓN
router
    .get('/', authenticateJwt, authorizeRoles(['administrador', 'fabrica', 'tienda']), getOrdenesController)
    .get('/:id_orden', authenticateJwt, authorizeRoles(['administrador', 'fabrica', 'tienda']), getOrdenController)
    .post('/', authenticateJwt, authorizeRoles(['fabrica', 'administrador', 'tienda']), createOrdenController)
    .put('/:id_orden', authenticateJwt, authorizeRoles(['fabrica', 'administrador']), updateOrdenController)
    .delete('/:id_orden', authenticateJwt, authorizeRoles(['administrador']), deleteOrdenController);

export default router;