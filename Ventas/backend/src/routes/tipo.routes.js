import {Router} from 'express';
import { getTipoController,
            getTiposController, 
            createTipoController, 
            updateTipoController,
            deleteTipoController } from '../controllers/tipo.controller.js';

const router = Router();
router
    .get('/', getTiposController)
    .get('/:id_tipo', getTipoController)
    .post('/', createTipoController)
    .put('/:id_tipo', updateTipoController)
    .delete('/:id_tipo', deleteTipoController);
export default router;