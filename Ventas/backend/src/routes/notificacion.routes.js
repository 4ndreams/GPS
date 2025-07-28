import { Router } from 'express';
import {
    createNotificacionController,
    getNotificacionesController,
    getAlertasActivasController,
    marcarNotificacionLeidaController,
    marcarTodasNotificacionesLeidasController,
    resolverAlertaController,
    crearAlertaFaltantesController,
    crearAlertaDefectosController,
    crearRecepcionExitosaController
} from '../controllers/notificacion.controller.js';
import { crearNotificacionPrueba } from '../services/notificacion.service.js';

const router = Router();

// Rutas básicas de notificaciones
router.get('/', getNotificacionesController);
router.post('/', createNotificacionController);
router.patch('/:id/leida', marcarNotificacionLeidaController);
router.patch('/todas/leidas', marcarTodasNotificacionesLeidasController);

// Rutas específicas de alertas
router.get('/alertas', getAlertasActivasController);
router.patch('/alertas/:id/resolver', resolverAlertaController);

// Rutas para crear alertas específicas (usadas desde la app móvil)
router.post('/alertas/faltantes', crearAlertaFaltantesController);
router.post('/alertas/defectos', crearAlertaDefectosController);

// Ruta para crear notificación de recepción exitosa
router.post('/recepcion-exitosa', crearRecepcionExitosaController);

// Ruta temporal para crear notificaciones de prueba
router.post('/prueba', (req, res) => {
    try {
        const notificacion = crearNotificacionPrueba();
        res.json({
            status: 'Success',
            message: 'Notificación de prueba creada',
            data: notificacion
        });
    } catch (error) {
        res.status(500).json({
            status: 'Server error',
            message: error.message
        });
    }
});

export default router;
