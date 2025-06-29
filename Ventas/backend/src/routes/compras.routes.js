import {Router} from 'express';
import {
    getComprasController,
    getCompraController,
    createCompraController,
    updateCompraController,
    deleteCompraController
} from '../controllers/compras.controller.js';

const router = Router();
router
    .get('/', getComprasController)
    .get('/:id_compra', getCompraController)
    .post('/', createCompraController)
    .put('/:id_compra', updateCompraController)
    .delete('/:id_compra', deleteCompraController);

export default router;