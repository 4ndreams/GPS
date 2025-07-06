import {Router} from 'express';
import {
    getComprasController,
    getCompraController,
    createCompraController,
    updateCompraController,
    deleteCompraController
} from '../controllers/compras.controller.js';
import { crearCompXBod } from '../function/Com_bod.function.js';
import { authenticateJwt } from '../middlewares/authentication.middleware.js';
import { isFabricaOrAdmin, authorizeRoles } from '../middlewares/autorization.middleware.js';

const router = Router();

router.use(authenticateJwt);

router
    .get('/', isFabricaOrAdmin, getComprasController)
    .get('/:id_compra', isFabricaOrAdmin, getCompraController)
    .post('/', isFabricaOrAdmin, createCompraController)
    .put('/:id_compra', isFabricaOrAdmin, updateCompraController)
    .delete('/:id_compra', authorizeRoles('administrador'), deleteCompraController);
    

export default router;