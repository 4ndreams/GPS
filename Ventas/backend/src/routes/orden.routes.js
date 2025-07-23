import {Router} from 'express';
import { getOrdenController, getOrdenesController, deleteOrdenController, updateOrdenController, createOrdenController } from '../controllers/orden.controller.js';
import { authenticateJwt } from '../middlewares/authentication.middleware.js';
import { authorizeRoles } from '../middlewares/autorization.middleware.js';

const router = Router();

// 🚧 RUTAS TEMPORALES PARA RF 5 - SIN AUTENTICACIÓN PARA TESTING
router
    .get('/test', getOrdenesController)
    .get('/test/:id_orden', getOrdenController)
    .post('/test', createOrdenController)
    .put('/test/:id_orden', updateOrdenController);

// 🔒 RUTAS CON AUTENTICACIÓN ORIGINAL
router
    .get('/', authenticateJwt, authorizeRoles(['administrador', 'fabrica', 'tienda']), getOrdenesController)
    .get('/:id_orden', authenticateJwt, authorizeRoles(['administrador', 'fabrica', 'tienda']), getOrdenController)
    .post('/', authenticateJwt, authorizeRoles(['fabrica', 'administrador']), createOrdenController)
    .put('/:id_orden', authenticateJwt, authorizeRoles(['fabrica', 'administrador']), updateOrdenController)
    .delete('/:id_orden', authenticateJwt, authorizeRoles(['administrador']), deleteOrdenController);

export default router;