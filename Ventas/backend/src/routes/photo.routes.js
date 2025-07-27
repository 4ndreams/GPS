import {Router} from 'express';
import multer from "multer"; // ⭐ para manejar archivos
import { getPhotoController, getPhotosController, deletePhotoController, updatePhotoController, createPhotoController } from '../controllers/photo.controller.js';
import { authenticateJwt } from '../middlewares/authentication.middleware.js';
import { isFabricaOrAdmin, authorizeRoles } from '../middlewares/autorization.middleware.js';

// ⭐ Configuración de multer (subida en memoria)
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();
router
    .get('/', getPhotosController) // Público - consulta de photos
    .get('/:id_pht', getPhotoController) // Público - consulta de una photo específica
    .post('/', upload.single('file'), authenticateJwt, isFabricaOrAdmin, createPhotoController) // Solo fábrica/admin pueden crear
    .put('/:id_pht', upload.single('file'), authenticateJwt, isFabricaOrAdmin, updatePhotoController) // Solo fábrica/admin pueden editar
    .delete('/:id_pht', authenticateJwt, authorizeRoles('administrador'), deletePhotoController); // Solo admin puede eliminar
export default router;