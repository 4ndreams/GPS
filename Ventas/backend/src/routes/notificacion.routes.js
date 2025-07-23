import { Router } from 'express';
import {
    createNotificacionController,
    getNotificacionesController,
    getAlertasActivasController,
    marcarNotificacionLeidaController,
    resolverAlertaController,
    crearAlertaFaltantesController,
    crearAlertaDefectosController,
    crearRecepcionExitosaController
} from '../controllers/notificacion.controller.js';

const router = Router();

// Rutas básicas de notificaciones
router.get('/', getNotificacionesController);
router.post('/', createNotificacionController);
router.patch('/:id/leida', marcarNotificacionLeidaController);

// Rutas específicas de alertas
router.get('/alertas', getAlertasActivasController);
router.patch('/alertas/:id/resolver', resolverAlertaController);

// Rutas para crear alertas específicas (usadas desde la app móvil)
router.post('/alertas/faltantes', crearAlertaFaltantesController);
router.post('/alertas/defectos', crearAlertaDefectosController);

// Ruta para crear notificación de recepción exitosa
router.post('/recepcion-exitosa', crearRecepcionExitosaController);

export default router;
