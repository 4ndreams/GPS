import {Router} from 'express';
import { getTipoController,
            getTiposController, 
            createTipoController, 
            updateTipoController,
            deleteTipoController } from '../controllers/tipo.controller.js';
import { authenticateJwt } from '../middlewares/authentication.middleware.js';
import { authorizeRoles } from '../middlewares/autorization.middleware.js';

const router = Router();
router
    .get('/', getTiposController) // Público - ver tipos para cotizaciones
    .get('/:id_tipo', getTipoController) // Público - ver tipo específico
    .post('/', authenticateJwt, authorizeRoles(['fabrica', 'administrador']), createTipoController)
    .put('/:id_tipo', authenticateJwt, authorizeRoles(['fabrica', 'administrador']), updateTipoController)
    .delete('/:id_tipo', authenticateJwt, authorizeRoles(['administrador']), deleteTipoController);
export default router;