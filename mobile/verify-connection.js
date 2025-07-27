/**
 * Script para verificar la conectividad con el servidor universitario
 * Ejecuta este script para verificar que todo esté funcionando correctamente
 */

const axios = require('axios');

const API_BASE_URL = 'http://146.83.198.35:1237/api';

async function verificarConexion() {
  console.log('🔍 Verificando conectividad con el servidor universitario...');
  console.log(`📡 URL: ${API_BASE_URL}`);
  console.log('');

  try {
    // Test 1: Verificar que el servidor esté respondiendo
    console.log('1️⃣ Verificando que el servidor esté activo...');
    const response = await axios.get(API_BASE_URL, { timeout: 5000 });
    
    if (response.status === 200 && response.data.message) {
      console.log('✅ Servidor respondiendo correctamente');
      console.log(`📝 Respuesta: ${response.data.message}`);
    } else {
      console.log('⚠️ Servidor responde pero con datos inesperados');
    }
    
    // Test 2: Verificar rutas principales
    console.log('\n2️⃣ Verificando rutas principales...');
    
    const rutas = [
      '/products/all',
      '/users',
      '/materiales',
      '/tipos'
    ];
    
    for (const ruta of rutas) {
      try {
        const rutaResponse = await axios.get(`${API_BASE_URL}${ruta}`, { timeout: 3000 });
        console.log(`✅ ${ruta} - Status: ${rutaResponse.status}`);
      } catch (error) {
        if (error.response) {
          console.log(`⚠️ ${ruta} - Status: ${error.response.status} (puede requerir autenticación)`);
        } else {
          console.log(`❌ ${ruta} - Error de conexión`);
        }
      }
    }
    
    console.log('\n🎉 Verificación completada!');
    console.log('📱 Tu app móvil debería poder conectarse correctamente al servidor.');
    
  } catch (error) {
    console.log('❌ Error de conexión al servidor');
    console.log('');
    console.log('🔍 Posibles causas:');
    console.log('  - No estás conectado a la red universitaria');
    console.log('  - El backend no está ejecutándose en el servidor');
    console.log('  - El puerto 1237 está bloqueado por firewall');
    console.log('  - Problema de configuración del servidor');
    console.log('');
    console.log(`❗ Error técnico: ${error.message}`);
  }
}

// Ejecutar verificación
verificarConexion();
