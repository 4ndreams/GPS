import {Router} from 'express';
import { getImagenController, getImagenesController, deleteImagenController, updateImagenController, createImagenController } from '../controllers/imagen.controller.js';
import { authenticateJwt } from '../middlewares/authentication.middleware.js';
import { isFabricaOrAdmin, authorizeRoles } from '../middlewares/autorization.middleware.js';

const router = Router();
router
    .get('/', getImagenesController) // Público - consulta de imágenes
    .get('/:id_img', getImagenController) // Público - consulta de una imagen específica
    .post('/', authenticateJwt, isFabricaOrAdmin, createImagenController) // Solo fábrica/admin pueden crear
    .put('/:id_img', authenticateJwt, isFabricaOrAdmin, updateImagenController) // Solo fábrica/admin pueden editar
    .delete('/:id_img', authenticateJwt, authorizeRoles('administrador'), deleteImagenController); // Solo admin puede eliminar
export default router;