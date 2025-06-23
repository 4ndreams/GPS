import {Router} from 'express';
import { getImagenController, getImagenesController, deleteImagenController, updateImagenController, createImagenController } from '../controllers/imagen.controller.js';
const router = Router();
router
    .get('/', getImagenesController)
    .get('/:id_img', getImagenController)
    .post('/', createImagenController)
    .put('/:id_img', updateImagenController)
    .delete('/:id_img', deleteImagenController);
export default router;