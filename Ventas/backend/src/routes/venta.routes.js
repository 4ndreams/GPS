import {Router} from 'express';
import {
    getVentaController,
    getVentasController,
    deleteVentaController,
    updateVentaController,
    createVentaController
} from '../controllers/venta.controller.js';

const router = Router();
router
    .get('/', getVentasController)
    .get('/:id_venta', getVentaController)
    .post('/', createVentaController)
    .put('/:id_venta', updateVentaController)
    .delete('/:id_venta', deleteVentaController);

export default router;