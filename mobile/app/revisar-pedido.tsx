import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useOrderActions } from '../hooks/useOrderActions';

// Componente para mostrar los detalles de una orden
export default function RevisarPedido() {
  const { id } = useLocalSearchParams();
  const { procesando, confirmarRecepcion } = useOrderActions(async () => {
    router.back();
  });

  const [orden, setOrden] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [observaciones, setObservaciones] = useState('');
  const [reportarProblema, setReportarProblema] = useState(false);
  const [cantidadCorrecta, setCantidadCorrecta] = useState(false);

  // Simular carga de datos de la orden
  useEffect(() => {
    const cargarOrden = async () => {
      try {
        // Aquí harías la llamada real a la API
        // const response = await api.obtenerOrden(id);
        
        // Por ahora simulamos datos
        setTimeout(() => {
          setOrden({
            id_orden: id,
            cantidad: 10,
            origen: 'Fabrica Central',
            destino: 'Tienda Norte',
            fecha_envio: '2025-07-21T14:30:00.000Z',
            estado: 'En tránsito',
            prioridad: 'Media',
            transportista: null,
            tipo: 'normal',
            observaciones: null,
            fecha_entrega: null,
            imagen_url: null // Una sola imagen por pedido
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error cargando orden:', error);
        setLoading(false);
      }
    };

    cargarOrden();
  }, [id]);

  const handleConfirmarRecepcion = async () => {
    try {
      // Validar que se haya confirmado la cantidad
      if (!cantidadCorrecta) {
        Alert.alert(
          'Verificación requerida',
          'Por favor confirma que la cantidad recibida es correcta antes de proceder.',
          [{ text: 'OK' }]
        );
        return;
      }

      const id_orden = parseInt(id as string);
      // Asegurar que observaciones sea una cadena vacía si no hay contenido
      const observacionesFinales = observaciones?.trim() || '';
      
      console.log('🔄 Confirmando recepción:', { id_orden, reportarProblema, observacionesFinales });
      await confirmarRecepcion(id_orden, reportarProblema, observacionesFinales);
      console.log('✅ Recepción confirmada exitosamente');
      
      Alert.alert(
        'Éxito',
        reportarProblema ? 'Problema reportado correctamente' : 'Recepción confirmada correctamente',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('❌ Error confirmando recepción:', error);
      Alert.alert('Error', 'No se pudo procesar la solicitud');
    }
  };

  const handleReportarProblema = async () => {
    try {
      const id_orden = parseInt(id as string);
      const observacionesFinales = observaciones?.trim() || '';
      
      // Validar que haya observaciones cuando se reporta un problema
      if (!observacionesFinales) {
        Alert.alert(
          'Observaciones requeridas',
          'Por favor describe el problema encontrado antes de reportarlo.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      console.log('🔄 Reportando problema:', { id_orden, observacionesFinales });
      await confirmarRecepcion(id_orden, true, observacionesFinales);
      console.log('✅ Problema reportado exitosamente');
      
      Alert.alert(
        'Problema Reportado',
        'El problema ha sido reportado correctamente',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('❌ Error reportando problema:', error);
      Alert.alert('Error', 'No se pudo reportar el problema');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text style={styles.loadingText}>Cargando detalles del pedido...</Text>
      </View>
    );
  }

  if (!orden) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text style={styles.errorText}>No se pudo cargar el pedido</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Revisar Pedido #{orden.id_orden}</Text>
      </View>

      {/* Información de la orden */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información del Pedido</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Origen:</Text>
          <Text style={styles.infoValue}>{orden.origen}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Destino:</Text>
          <Text style={styles.infoValue}>{orden.destino}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Fecha de envío:</Text>
          <Text style={styles.infoValue}>{new Date(orden.fecha_envio).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Estado:</Text>
          <Text style={[styles.infoValue, styles.estadoValue]}>{orden.estado}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Prioridad:</Text>
          <Text style={[styles.infoValue, 
            orden.prioridad === 'Alta' ? styles.prioridadAlta :
            orden.prioridad === 'Media' ? styles.prioridadMedia : 
            styles.prioridadBaja
          ]}>{orden.prioridad}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tipo:</Text>
          <Text style={styles.infoValue}>{orden.tipo}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Transportista:</Text>
          <Text style={styles.infoValue}>{orden.transportista || 'No asignado'}</Text>
        </View>
        {orden.fecha_entrega && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha entrega:</Text>
            <Text style={styles.infoValue}>{new Date(orden.fecha_entrega).toLocaleDateString('es-ES')}</Text>
          </View>
        )}
        {orden.observaciones && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Observaciones:</Text>
            <Text style={styles.infoValue}>{orden.observaciones}</Text>
          </View>
        )}
      </View>

      {/* Detalles del pedido */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Detalles del Pedido</Text>
        
        {/* Imagen del pedido */}
        <View style={styles.imagenContainer}>
          <View style={styles.imagenPlaceholder}>
            <Ionicons name="image-outline" size={48} color="#9CA3AF" />
            <Text style={styles.imagenPlaceholderText}>Imagen del pedido</Text>
            <Text style={styles.imagenPlaceholderSubtext}>
              {orden.imagen_url ? 'Cargando imagen...' : 'Sin imagen disponible'}
            </Text>
          </View>
        </View>
        
        {/* Cantidad */}
        <View style={styles.cantidadContainer}>
          <Text style={styles.cantidadLabel}>Cantidad de productos:</Text>
          <Text style={styles.cantidadValue}>{orden.cantidad} unidades</Text>
        </View>
        
        {/* Radio button para confirmar cantidad */}
        <TouchableOpacity
          style={[
            styles.cantidadCheckContainer,
            cantidadCorrecta && styles.cantidadCheckContainerActive
          ]}
          onPress={() => setCantidadCorrecta(!cantidadCorrecta)}
        >
          <View style={[
            styles.radioButton,
            cantidadCorrecta && styles.radioButtonActive
          ]}>
            {cantidadCorrecta && (
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            )}
          </View>
          <Text style={[
            styles.cantidadCheckText,
            cantidadCorrecta && styles.cantidadCheckTextActive
          ]}>
            Cantidad correcta
          </Text>
        </TouchableOpacity>
      </View>

      {/* Toggle de problema */}
      <View style={styles.card}>
        <TouchableOpacity
          style={[
            styles.problemaToggle,
            reportarProblema && styles.problemaToggleActive
          ]}
          onPress={() => setReportarProblema(!reportarProblema)}
        >
          <Ionicons 
            name={reportarProblema ? "warning" : "warning-outline"} 
            size={20} 
            color={reportarProblema ? "#FFFFFF" : "#F59E0B"} 
          />
          <Text style={[
            styles.problemaToggleText,
            reportarProblema && styles.problemaToggleTextActive
          ]}>
            {reportarProblema ? 'Con problemas' : 'Reportar problema'}
          </Text>
        </TouchableOpacity>

        {/* Campo de observaciones */}
        <TextInput
          style={styles.observacionesInput}
          placeholder={
            reportarProblema 
              ? "Describe el problema encontrado (obligatorio)..." 
              : "Observaciones adicionales (opcional)..."
          }
          placeholderTextColor="#6B7280"
          value={observaciones}
          onChangeText={setObservaciones}
          maxLength={300}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Botones de acción */}
      <View style={styles.buttonContainer}>
        {reportarProblema ? (
          <TouchableOpacity
            style={styles.problemaButton}
            onPress={handleReportarProblema}
            disabled={procesando[parseInt(id as string)]}
          >
            {procesando[parseInt(id as string)] ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="warning" size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>Reportar Problema</Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.confirmarButton,
              !cantidadCorrecta && styles.confirmarButtonDisabled
            ]}
            onPress={handleConfirmarRecepcion}
            disabled={procesando[parseInt(id as string)] || !cantidadCorrecta}
          >
            {procesando[parseInt(id as string)] ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>Confirmar Recepción</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#6B7280',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    width: 120,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  estadoValue: {
    fontWeight: '600',
    color: '#059669',
  },
  prioridadAlta: {
    color: '#DC2626',
    fontWeight: '600',
  },
  prioridadMedia: {
    color: '#F59E0B',
    fontWeight: '600',
  },
  prioridadBaja: {
    color: '#6B7280',
    fontWeight: '600',
  },
  imagenContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  imagenPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  imagenPlaceholderText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
  imagenPlaceholderSubtext: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  cantidadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cantidadLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  cantidadValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  cantidadCheckContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  cantidadCheckContainerActive: {
    backgroundColor: '#DCFDF7',
    borderColor: '#10B981',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioButtonActive: {
    borderColor: '#10B981',
    backgroundColor: '#10B981',
  },
  cantidadCheckText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  cantidadCheckTextActive: {
    color: '#10B981',
  },
  problemaToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
    marginBottom: 16,
  },
  problemaToggleActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  problemaToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
    marginLeft: 12,
  },
  problemaToggleTextActive: {
    color: '#FFFFFF',
  },
  observacionesInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    fontSize: 14,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  buttonContainer: {
    margin: 16,
    marginBottom: 32,
  },
  confirmarButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  confirmarButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  problemaButton: {
    backgroundColor: '#F59E0B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
});
