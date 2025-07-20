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
import { router } from 'expo-router';
import { BaseDashboard } from '../../components/BaseDashboard';
import { BaseOrderCard } from '../../components/BaseOrderCard';
import { getConfigForProfile } from '../../config/dashboardConfig';
import { useOrderActions } from '../../hooks/useOrderActions';
import { useDashboardData } from '../../hooks/useDashboardData';
import { OrdenVentas, PedidoStock } from '../../types/dashboard';

export default function DashboardVentas() {
  const config = getConfigForProfile('tienda');
  const { data, loading, refreshing, onRefresh } = useDashboardData(config);
  const { procesando, confirmarRecepcion } = useOrderActions(onRefresh);
  
  const [observacionesRecepcion, setObservacionesRecepcion] = useState<{[key: number]: string}>({});
  const [reportarProblema, setReportarProblema] = useState<{[key: number]: boolean}>({});

  const crearNuevoPedidoStock = () => {
    router.push('/nuevo-pedido-stock');
  };

  const handleConfirmarRecepcion = async (id_orden: number) => {
    const conProblema = reportarProblema[id_orden] || false;
    const observaciones = observacionesRecepcion[id_orden] || '';
    
    await confirmarRecepcion(id_orden, conProblema, observaciones);
    
    // Limpiar formulario después del éxito
    setObservacionesRecepcion(prev => {
      const nuevo = { ...prev };
      delete nuevo[id_orden];
      return nuevo;
    });
    setReportarProblema(prev => {
      const nuevo = { ...prev };
      delete nuevo[id_orden];
      return nuevo;
    });
  };

  const renderVentasContent = (activeTab: string, data: any) => {
    const getDataForTab = () => {
      switch (activeTab) {
        case 'despachos':
          return data['en-transito'] || [];
        case 'pedidos-stock':
          return data['pedidos-stock'] || [];
        case 'recibidos':
          return data['recibidos'] || [];
        default:
          return [];
      }
    };

    const ordenes = getDataForTab();

    return (
      <View>
        {/* Header de sección con botón para pedidos stock */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeTab === 'despachos' && 'Despachos en Tránsito'}
            {activeTab === 'pedidos-stock' && 'Pedidos de Stock'}
            {activeTab === 'recibidos' && 'Despachos Recibidos'}
          </Text>
          {activeTab === 'pedidos-stock' && (
            <TouchableOpacity
              style={styles.nuevoPedidoButton}
              onPress={crearNuevoPedidoStock}
            >
              <Ionicons name="add" size={16} color="#FFFFFF" />
              <Text style={styles.nuevoPedidoButtonText}>Nuevo Pedido</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Lista de órdenes */}
        <View style={styles.ordenesContainer}>
          {ordenes.length > 0 ? (
            ordenes.map((orden: OrdenVentas | PedidoStock) => (
              <BaseOrderCard
                key={orden.id_orden}
                orden={orden}
                tipo={activeTab === 'pedidos-stock' ? 'stock' : 'ventas'}
              >
                {/* Contenido específico para despachos en tránsito */}
                {activeTab === 'despachos' && (
                  <View>
                    {/* Toggle de problema */}
                    <TouchableOpacity
                      style={[
                        styles.problemaToggle,
                        reportarProblema[orden.id_orden] && styles.problemaToggleActive
                      ]}
                      onPress={() => setReportarProblema(prev => ({
                        ...prev,
                        [orden.id_orden]: !prev[orden.id_orden]
                      }))}
                    >
                      <Ionicons 
                        name={reportarProblema[orden.id_orden] ? "warning" : "warning-outline"} 
                        size={16} 
                        color={reportarProblema[orden.id_orden] ? "#FFFFFF" : "#F59E0B"} 
                      />
                      <Text style={[
                        styles.problemaToggleText,
                        reportarProblema[orden.id_orden] && styles.problemaToggleTextActive
                      ]}>
                        {reportarProblema[orden.id_orden] ? 'Reportar problema' : 'Sin problemas'}
                      </Text>
                    </TouchableOpacity>

                    {/* Campo de observaciones */}
                    <TextInput
                      style={styles.observacionesInput}
                      placeholder={
                        reportarProblema[orden.id_orden] 
                          ? "Describe el problema encontrado..." 
                          : "Observaciones adicionales..."
                      }
                      placeholderTextColor="#666"
                      value={observacionesRecepcion[orden.id_orden] || ''}
                      onChangeText={(text) => setObservacionesRecepcion(prev => ({
                        ...prev,
                        [orden.id_orden]: text
                      }))}
                      maxLength={300}
                      multiline
                      numberOfLines={2}
                    />

                    {/* Botón de confirmar recepción */}
                    <TouchableOpacity
                      style={[
                        styles.confirmarButton,
                        reportarProblema[orden.id_orden] && styles.confirmarButtonProblema
                      ]}
                      onPress={() => handleConfirmarRecepcion(orden.id_orden)}
                      disabled={procesando[orden.id_orden]}
                    >
                      {procesando[orden.id_orden] ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                      ) : (
                        <>
                          <Ionicons 
                            name={reportarProblema[orden.id_orden] ? "warning" : "checkmark-circle"} 
                            size={16} 
                            color="#FFFFFF" 
                          />
                          <Text style={styles.confirmarButtonText}>
                            {reportarProblema[orden.id_orden] ? 'Confirmar con Problemas' : 'Confirmar Recepción'}
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </BaseOrderCard>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons 
                name={
                  activeTab === 'despachos' ? "cube-outline" :
                  activeTab === 'pedidos-stock' ? "clipboard-outline" :
                  "checkmark-circle-outline"
                } 
                size={48} 
                color="#666" 
              />
              <Text style={styles.emptyStateText}>
                {activeTab === 'despachos' && 'No hay despachos en tránsito'}
                {activeTab === 'pedidos-stock' && 'No hay pedidos de stock pendientes'}
                {activeTab === 'recibidos' && 'No hay despachos recibidos'}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <BaseDashboard
      perfil="tienda"
      config={config}
      data={data}
      loading={loading}
      refreshing={refreshing}
      onRefresh={onRefresh}
      renderContent={renderVentasContent}
    />
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  nuevoPedidoButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  nuevoPedidoButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  ordenesContainer: {
    gap: 12,
  },
  problemaToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
    marginBottom: 12,
  },
  problemaToggleActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  problemaToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
    marginLeft: 8,
  },
  problemaToggleTextActive: {
    color: '#FFFFFF',
  },
  observacionesInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    textAlignVertical: 'top',
    minHeight: 60,
  },
  confirmarButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  confirmarButtonProblema: {
    backgroundColor: '#F59E0B',
  },
  confirmarButtonText: {
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
});
