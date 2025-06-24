import {Router} from 'express';
import { getOrdenController, getOrdenesController, deleteOrdenController, updateOrdenController, createOrdenController } from '../controllers/orden.controller.js';

const router = Router();
router
    .get('/', getOrdenesController)
    .get('/:id_orden', getOrdenController)
    .post('/', createOrdenController)
    .put('/:id_orden', updateOrdenController)
    .delete('/:id_orden', deleteOrdenController);

export default router;