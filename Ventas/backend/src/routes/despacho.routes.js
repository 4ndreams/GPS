import {Router} from 'express';
import { createDespachoController } from '../controllers/despacho.controller.js';
import { authenticateJwt } from '../middlewares/authentication.middleware.js';
import { authorizeRoles } from '../middlewares/autorization.middleware.js';

const router = Router();

// 🔒 RUTAS CON AUTENTICACIÓN
router
    .post('/', authenticateJwt, authorizeRoles(['fabrica', 'administrador']), createDespachoController);

// 🔒 RUTAS CON AUTENTICACIÓN ORIGINAL
router
    .post('/', authenticateJwt, authorizeRoles(['fabrica', 'administrador']), createDespachoController);

export default router;
