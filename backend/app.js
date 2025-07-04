import express from 'express';
import cors from 'cors';
import {
    getOrdenesService,
    getUsersService,
    getOrdenesEnviadas
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
    res.send('Servidor activo ✅');
});


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor escuchando en el puerto ${PORT} en todas las interfaces`);
    console.log(`Accesible en:`);
    console.log(`- Local: http://localhost:${PORT}`);
    console.log(`- Red: http://192.168.1.105:${PORT}`);
    console.log(`- Emulador Android: http://10.0.2.2:${PORT}`);
    getOrdenesService()
  .then(data => console.log('Ordenes obtenidas al iniciar:', data))
  .catch(err => console.error('Error obteniendo ordenes al iniciar:', err));
});
