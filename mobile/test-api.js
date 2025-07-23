// Test script para verificar la comunicación API
console.log('🧪 Iniciando test de comunicación API...');

// Simular la configuración de la app
const API_BASE_URL = 'http://localhost:3000/api';

// Función para hacer petición como lo hace la app
async function testApiCall() {
  try {
    const response = await fetch(`${API_BASE_URL}/orden/test?estado=Pendiente`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    
    const data = await response.json();
    console.log('✅ Respuesta del API:', data);
    console.log('📊 Cantidad de órdenes pendientes:', data.data.length);
    
    // Verificar estructura de la respuesta
    if (data.data && Array.isArray(data.data)) {
      console.log('✅ Estructura de datos correcta');
      data.data.forEach((orden, index) => {
        console.log(`📋 Orden ${index + 1}:`, {
          id: orden.id_orden,
          estado: orden.estado,
          tipo: orden.tipo,
          producto: orden.producto?.nombre_producto
        });
      });
    } else {
      console.error('❌ Estructura de datos incorrecta');
    }
    
  } catch (error) {
    console.error('❌ Error en petición API:', error);
  }
}

// Ejecutar test
testApiCall();
