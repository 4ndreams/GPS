import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/indexStyles'; 
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useRouter } from 'expo-router';

export default function Home() {
  console.log('🚀 Componente Home iniciando...');
  const router = useRouter();

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
      
      console.log('🌐 Iniciando fetch usando servicio API configurado...');
      
      // Usar el servicio API configurado con la URL correcta
      const response = await api.get('/orden');
      
      console.log('✅ Respuesta del API:', response.data);
      
      // El backend devuelve {status, message, data}
      const data = response.data.data || [];
      setOrdenes(data);
      console.log('📋 Datos de órdenes cargados:', data.length);
      console.log('✨ Fetch completado exitosamente');
    } catch (error) {
      console.error('❌ Error detallado:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  // Datos para la tabla de resumen - versión móvil optimizada
  const summaryData = [
    { title: 'Total', value: ordenes.length, icon: 'list', color: '#374151' },
    { title: 'Pendiente', value: ordenes.filter((orden: any) => orden.estado === 'Pendiente').length, icon: 'time', color: '#FFA500' },
    { title: 'En producción', value: ordenes.filter((orden: any) => orden.estado === 'En producción').length, icon: 'construct', color: '#8B5CF6' },
    { title: 'Fabricada', value: ordenes.filter((orden: any) => orden.estado === 'Fabricada').length, icon: 'checkmark-circle', color: '#059669' },
    { title: 'En tránsito', value: ordenes.filter((orden: any) => orden.estado === 'En tránsito').length, icon: 'car', color: '#0066CC' },
    { title: 'Recibido', value: ordenes.filter((orden: any) => orden.estado === 'Recibido').length, icon: 'checkmark-done', color: '#10B981' },
    { title: 'Con problemas', value: ordenes.filter((orden: any) => orden.estado === 'Recibido con problemas').length, icon: 'warning', color: '#DC2626' },
    { title: 'Cancelado', value: ordenes.filter((orden: any) => orden.estado === 'Cancelado').length, icon: 'close-circle', color: '#666666' },
  ];

  console.log('✅ Renderizando componente principal con', ordenes.length, 'órdenes');

  return (
    <View style={styles.homeContainer}>
      {/* Header simplificado */}
      <View style={styles.homeHeader}>
        <View style={styles.homeHeaderContent}>
          <Text style={styles.homeTitle}>Control de Despachos</Text>
          <Text style={styles.homeSubtitle}>
            Estado de despachos realizados durante el día
          </Text>
        </View>
        {/* Botón de información a la derecha */}
        <TouchableOpacity
          style={{ position: 'absolute', right: 16, top: 16 }}
          onPress={() => router.push('/(tabs)/about')}
        >
          <Ionicons name="information-circle-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {/* Contenido principal */}
      <ScrollView 
        style={styles.homeScrollContainer} 
        contentContainerStyle={styles.homeContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Resumen de estadísticas */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Resumen de Estados</Text>
          
          {/* Grid de estadísticas */}
          <View style={styles.statsGrid}>
            {summaryData.map((item, index) => (
              <View key={index} style={styles.statsCard}>
                <View style={[styles.statsIconContainer, { backgroundColor: item.color + '20' }]}>
                  <Ionicons name={item.icon as any} size={24} color={item.color} />
                </View>
                <Text style={styles.statsValue}>{item.value}</Text>
                <Text style={styles.statsLabel}>{item.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Información importante */}
        <View style={styles.infoContainer}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={20} color="#DC2626" />
            <Text style={styles.infoTitle}>Información Importante</Text>
          </View>
          <Text style={styles.infoText}>
            Todas las minutas deben ser confirmadas en tienda para evitar irregularidades en el proceso de despacho.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
