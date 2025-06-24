import {Router} from 'express';
import { getProductoController, 
             getProductosController, 
             createProductoController, 
             updateProductoController, 
             deleteProductoController } from '../controllers/producto.controller.js';

const router = Router();
router
    .get('/', getProductosController)
    .get('/:id_producto', getProductoController)
    .post('/', createProductoController)
    .put('/:id_producto', updateProductoController)
    .delete('/:id_producto', deleteProductoController);
export default router;