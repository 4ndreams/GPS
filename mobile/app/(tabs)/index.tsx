import { Text, View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/indexStyles'; 
import { useEffect, useState } from 'react';

export default function Index() {
  console.log('🚀 Componente Index iniciando...');

  // fetch de datos de ordenes (minutas)
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  console.log('📊 Estado inicial - loading:', loading, 'error:', error, 'ordenes:', ordenes.length);
  
  useEffect(() => {
    console.log('🔄 useEffect ejecutándose...');
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Iniciando fetch...');
      
      // URLs para probar según el tipo de dispositivo
      const urls = [
        'http://192.168.1.105:3000/api/orden/',  // Para dispositivo físico
        'http://10.0.2.2:3000/api/orden/',      // Para emulador Android
        'http://localhost:3000/api/orden/'      // Para simulador iOS
      ];
      
      let response;
      let lastError;
      
      for (const url of urls) {
        try {
          console.log(`Probando URL: ${url}`);
          
          // Crear un timeout para evitar que la petición se cuelgue
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos
          
          response = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);
          
          console.log(`URL ${url} - Status: ${response.status}, OK: ${response.ok}`);
          
          if (response.ok) {
            break; 
          }
        } catch (err) {
          console.log(`Error con URL ${url}:`, err);
          lastError = err;
          continue; 
        }
      }
      
      if (!response || !response.ok) {
        throw lastError || new Error('No se pudo conectar con ninguna URL');
      }
      
      const result = await response.json();
      console.log('Respuesta completa:', result);
      
      // Si el backend devuelve un objeto con estructura {status, message, data}
      const data = result.data || result;
      setOrdenes(data);
      console.log('Datos de órdenes:', data);
      console.log('Fetch completado exitosamente');
    } catch (error) {
      console.error('Error detallado:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }


  // Datos para la tabla de resumen
  const summaryData = [
    { title: 'Total', value: ordenes.length },
    { title: 'Entregados', value: ordenes.filter((orden: any) => orden.estado === 'Entregado').length },
    { title: 'Enviados', value: ordenes.filter((orden: any) => orden.estado === 'Enviado').length },
    { title: 'Pendientes', value: ordenes.filter((orden: any) => orden.estado === 'Pendiente').length },
    { title: 'Cancelados', value: ordenes.filter((orden: any) => orden.estado === 'Cancelado').length },
  ];



  console.log('✅ Renderizando componente principal con', ordenes.length, 'órdenes');

  return (
    <View style={styles.container}>
      {/* Barra superior con logo */}
      <View style={styles.headerBar}>
        <Image
          source={require('../../assets/logo.png')}
          style={[styles.logo, {marginTop: 15}]}
          resizeMode="contain"
          onError={(error) => console.log('❌ Error cargando logo:', error)}
        />
      </View>
      
      {/* Contenido principal */}
      <View style={styles.innerContainer}>
        <Text style={[styles.title, {marginTop: -100}]}>Control de despachos</Text>
        <Text style={[styles.headerSubtitle, {marginTop: -40}]}>
          (Estado de despachos realizados durante el día)
        </Text>

        {/* Tabla estilizada */}
        <View style={[styles.table, {marginTop: -20}]}>
          {/* Encabezados de tabla */}
          <View style={[styles.row, styles.headerRow]}>
            <Text style={styles.headerCell}>Estado</Text>
            <Text style={styles.headerCell}>Cantidad</Text>
          </View>
          
          {/* Filas de datos */}
          {summaryData.map((item, index) => (
            <View 
              key={index} 
              style={[
                styles.row,
                index % 2 === 0 ? styles.evenRow : styles.oddRow
              ]}
            >
              <Text style={styles.cell}>{item.title}</Text>
              <Text style={[styles.cell, styles.valueCell]}>{item.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.reminderContainer}>
          <Ionicons name="warning-outline" size={20} color="#DC2626" />
          <Text style={styles.reminderText}>
            Todas las minutas deben ser confirmadas en tienda para evitar irregularidades
          </Text>
        </View>

        {/* Ver listas de despachos */}
        <TouchableOpacity
          style={styles.despachosButton}
          onPress={() => console.log("Navegar a listas de despachos")}
        >
          <Text style={styles.despachosButtonText}>Ver listas de despachos</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
