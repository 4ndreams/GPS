import express from 'express';
import cors from 'cors';
import {
    getOrdenesService,
    getUsersService,
    getOrdenesEnviadas,
    getOrdenesByEstadoService,
    updateOrdenService,
    createOrdenService,
    createDespachoService,
    getProductosService,
    getOrdenByIdService
} from './database.js';

const PORT = 3000; // Puerto para el servidor Express

const app = express();

// Configurar CORS para permitir peticiones desde la app móvil
app.use(cors({
    origin: '*', // En desarrollo, permite todos los orígenes
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ===== ENDPOINTS PARA RF 5 =====

// 1. Obtener órdenes con filtros por estado
app.get('/api/orden', async (req, res) => {
  try {
    const { estado, tipo } = req.query;
    
    if (estado) {
      // Manejar múltiples estados separados por coma
      const estados = estado.split(',').map(e => e.trim());
      const ordenes = await getOrdenesByEstadoService(estados, tipo);
      res.json(ordenes);
    } else {
      const ordenes = await getOrdenesService();
      res.json(ordenes);
    }
  } catch (error) {
    console.error('❌ Error en GET /api/orden:', error);
    res.status(500).json({ error: 'Error al obtener las órdenes' });
  }
});

// 2. Obtener orden específica por ID
app.get('/api/orden/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orden = await getOrdenByIdService(parseInt(id));
    
    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    
    res.json(orden);
  } catch (error) {
    console.error('❌ Error en GET /api/orden/:id:', error);
    res.status(500).json({ error: 'Error al obtener la orden' });
  }
});

// 3. Crear nueva orden
app.post('/api/orden', async (req, res) => {
  try {
    const ordenData = req.body;
    const nuevaOrden = await createOrdenService(ordenData);
    res.status(201).json(nuevaOrden);
  } catch (error) {
    console.error('❌ Error en POST /api/orden:', error);
    res.status(500).json({ error: 'Error al crear la orden' });
  }
});

// 4. Actualizar orden existente
app.put('/api/orden/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const ordenActualizada = await updateOrdenService(parseInt(id), updateData);
    
    if (!ordenActualizada) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    
    res.json(ordenActualizada);
  } catch (error) {
    console.error('❌ Error en PUT /api/orden/:id:', error);
    res.status(500).json({ error: 'Error al actualizar la orden' });
  }
});

// 5. Crear despacho
app.post('/api/despachos', async (req, res) => {
  try {
    const despachoData = req.body;
    const nuevoDespacho = await createDespachoService(despachoData);
    res.status(201).json(nuevoDespacho);
  } catch (error) {
    console.error('❌ Error en POST /api/despachos:', error);
    res.status(500).json({ error: 'Error al crear el despacho' });
  }
});

// 6. Obtener productos para pedidos de stock
app.get('/api/productos', async (req, res) => {
  try {
    const productos = await getProductosService();
    res.json(productos);
  } catch (error) {
    console.error('❌ Error en GET /api/productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// ===== ENDPOINTS LEGACY =====

app.get('/api/orden/', async (req, res) => {
  try {
    const ordenes = await getOrdenesService();
    res.json(ordenes);
  } catch (error) {
    console.error('❌ Error en /ordenes:', error);
    res.status(500).json({ error: 'Error al obtener las órdenes' });
  }
});

app.get('/', (req, res) => {
    res.send('Servidor activo ✅ - RF 5 Backend implementado');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor RF 5 escuchando en el puerto ${PORT} en todas las interfaces`);
    console.log(`📱 Accesible en:`);
    console.log(`   - Local: http://localhost:${PORT}`);
    console.log(`   - Red: http://192.168.1.105:${PORT}`);
    console.log(`   - Emulador Android: http://10.0.2.2:${PORT}`);
    console.log(`🎯 Endpoints disponibles:`);
    console.log(`   - GET /api/orden?estado=...&tipo=...`);
    console.log(`   - GET /api/orden/:id`);
    console.log(`   - POST /api/orden`);
    console.log(`   - PUT /api/orden/:id`);
    console.log(`   - POST /api/despachos`);
    console.log(`   - GET /api/productos`);
    
    getOrdenesService()
      .then(data => console.log('✅ Ordenes obtenidas al iniciar:', data.length, 'registros'))
      .catch(err => console.error('❌ Error obteniendo ordenes al iniciar:', err));
});
