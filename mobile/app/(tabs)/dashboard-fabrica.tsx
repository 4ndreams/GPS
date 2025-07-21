import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseDashboard } from '../../components/BaseDashboard';
import { BaseOrderCard } from '../../components/BaseOrderCard';
import { getConfigForProfile } from '../../config/dashboardConfig';
import { useOrderActions } from '../../hooks/useOrderActions';
import { useDashboardData } from '../../hooks/useDashboardData';
import { OrdenFabrica } from '../../types/dashboard';

export default function DashboardFabrica() {
  const config = getConfigForProfile('fabrica');
  const { data, loading, refreshing, onRefresh } = useDashboardData(config);
  const { procesando, cambiarEstado, crearDespacho } = useOrderActions(onRefresh);
  
  const [ordenesSeleccionadas, setOrdenesSeleccionadas] = useState<number[]>([]);
  const [transportista, setTransportista] = useState('');
  const [observacionesDespacho, setObservacionesDespacho] = useState('');

  const toggleOrdenSeleccionada = (id_orden: number) => {
    if (ordenesSeleccionadas.includes(id_orden)) {
      setOrdenesSeleccionadas(prev => prev.filter(id => id !== id_orden));
    } else {
      setOrdenesSeleccionadas(prev => [...prev, id_orden]);
    }
  };

  const handleCrearDespacho = async () => {
    // Validar que se haya ingresado la información requerida
    if (!transportista.trim()) {
      alert('Por favor, ingresa el nombre del transportista');
      return;
    }

    if (ordenesSeleccionadas.length === 0) {
      alert('Por favor, selecciona al menos una orden para el despacho');
      return;
    }

    try {
      // Crear el despacho con la información completa
      await crearDespacho(ordenesSeleccionadas, transportista, observacionesDespacho);
      
      // Cambiar estado de todas las órdenes seleccionadas a "En tránsito" y agregar transportista
      for (const ordenId of ordenesSeleccionadas) {
        await cambiarEstado(ordenId, 'En tránsito', { 
          transportista: transportista.trim() 
        });
      }
      
      // Limpiar formulario después del éxito
      setOrdenesSeleccionadas([]);
      setTransportista('');
      setObservacionesDespacho('');
    } catch (error) {
      console.error('Error al crear despacho y cambiar estados:', error);
    }
  };

  const renderFabricaContent = (activeTab: string, data: any) => {
    const ordenes: OrdenFabrica[] = data[activeTab] || [];

    return (
      <View>
        {/* Formulario de despacho para fabricados */}
        {activeTab === 'fabricados' && (
          <View style={styles.despachoForm}>
            <View style={styles.despachoHeader}>
              <Ionicons name="cube-outline" size={20} color="#374151" />
              <Text style={styles.despachoTitle}>Información del Despacho</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Transportista</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Nombre del transportista"
                placeholderTextColor="#666"
                value={transportista}
                onChangeText={setTransportista}
                maxLength={100}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Observaciones</Text>
              <TextInput
                style={[styles.formInput, styles.formInputMultiline]}
                placeholder="Observaciones adicionales..."
                placeholderTextColor="#666"
                value={observacionesDespacho}
                onChangeText={setObservacionesDespacho}
                maxLength={300}
                multiline
                numberOfLines={3}
              />
            </View>

            <Text style={styles.sectionTitle}>Pedidos Fabricados Disponibles</Text>
          </View>
        )}

        {/* Lista de órdenes */}
        <View style={styles.ordenesContainer}>
          {ordenes.length > 0 ? (
            ordenes.map(orden => (
              <BaseOrderCard
                key={orden.id_orden}
                orden={orden}
                tipo="fabrica"
                showCheckbox={activeTab === 'fabricados'}
                isSelected={ordenesSeleccionadas.includes(orden.id_orden)}
                onToggleSelect={() => toggleOrdenSeleccionada(orden.id_orden)}
              >
                {/* Botón de acción para pendientes y fabricando */}
                {activeTab !== 'fabricados' && (
                  <TouchableOpacity
                    style={[
                      styles.accionButton,
                      activeTab === 'pendientes' ? styles.iniciarButton : styles.fabricarButton
                    ]}
                    onPress={() => {
                      const nuevoEstado = activeTab === 'pendientes' ? 'En producción' : 'Fabricada';
                      cambiarEstado(orden.id_orden, nuevoEstado);
                    }}
                    disabled={procesando[orden.id_orden]}
                  >
                    {procesando[orden.id_orden] ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <>
                        <Ionicons 
                          name={activeTab === 'pendientes' ? "play" : "checkmark-circle"} 
                          size={16} 
                          color="#FFFFFF" 
                        />
                        <Text style={styles.accionButtonText}>
                          {activeTab === 'pendientes' ? 'Iniciar Fabricación' : 'Marcar como Fabricado'}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </BaseOrderCard>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="checkmark-circle-outline" size={48} color="#666" />
              <Text style={styles.emptyStateText}>
                No hay órdenes {activeTab === 'pendientes' ? 'pendientes' : activeTab === 'fabricando' ? 'en fabricación' : 'fabricadas'}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderFloatingButton = () => {
    if (ordenesSeleccionadas.length === 0) return null;

    return (
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handleCrearDespacho}
        >
          <Ionicons name="send" size={20} color="#FFFFFF" />
          <Text style={styles.floatingButtonText}>
            Crear Despacho ({ordenesSeleccionadas.length} pedidos)
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <BaseDashboard
      perfil="fabrica"
      config={config}
      data={data}
      loading={loading}
      refreshing={refreshing}
      onRefresh={onRefresh}
      renderContent={renderFabricaContent}
      floatingButton={renderFloatingButton()}
    />
  );
}

const styles = StyleSheet.create({
  despachoForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  despachoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  despachoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginLeft: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  formInputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 8,
    marginBottom: 16,
  },
  ordenesContainer: {
    gap: 12,
  },
  accionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  iniciarButton: {
    backgroundColor: '#0066CC',
  },
  fabricarButton: {
    backgroundColor: '#059669',
  },
  accionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emptyStateContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 16,
  },
  emptyStateText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  floatingButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
