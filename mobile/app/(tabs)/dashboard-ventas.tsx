import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { BaseDashboard } from '../../components/BaseDashboard';
import { BaseOrderCard } from '../../components/BaseOrderCard';
import { SimpleOrderCard } from '../../components/SimpleOrderCard';
import { getConfigForProfile } from '../../config/dashboardConfig';
import { useDashboardData } from '../../hooks/useDashboardData';
import { OrdenVentas, PedidoStock } from '../../types/dashboard';

export default function DashboardVentas() {
  const config = getConfigForProfile('tienda');
  const { data, loading, refreshing, onRefresh } = useDashboardData(config);
  const { tab } = useLocalSearchParams<{ tab?: string }>();

  // Refrescar datos cuando la pantalla recibe foco (ej: al volver de revisar-pedido)
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 Dashboard de ventas recibió foco, refrescando datos...');
      onRefresh();
    }, [onRefresh])
  );

  const crearNuevoPedidoStock = () => {
    router.push('/nuevo-pedido-stock');
  };

  const renderVentasContent = (activeTab: string, data: any) => {
    const getDataForTab = () => {
      switch (activeTab) {
        case 'despachos':
          return data['despachos'] || [];
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
            ordenes.map((orden: OrdenVentas | PedidoStock) => {
              // Usar SimpleOrderCard para pedidos de stock, BaseOrderCard para despachos
              const CardComponent = activeTab === 'pedidos-stock' ? SimpleOrderCard : BaseOrderCard;
              
              return (
                <CardComponent
                  key={orden.id_orden}
                  orden={orden}
                  tipo={activeTab === 'pedidos-stock' ? 'stock' : 'ventas'}
                >
                  {/* Contenido específico para despachos en tránsito */}
                  {activeTab === 'despachos' && (
                    <View>
                      {/* Botón de revisar pedido */}
                      <TouchableOpacity
                        style={styles.revisarButton}
                        onPress={() => {
                          router.push({
                            pathname: '/revisar-pedido',
                            params: { id: orden.id_orden }
                          });
                        }}
                      >
                        <Ionicons 
                          name="eye" 
                          size={16} 
                          color="#FFFFFF" 
                        />
                        <Text style={styles.revisarButtonText}>
                          Revisar Pedido
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                </CardComponent>
              );
            })
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
      initialTab={tab || undefined}
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
    paddingBottom: 100, // Espacio extra al final para evitar que la última orden quede pegada al fondo
  },
  revisarButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  revisarButtonText: {
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
  // Estilos copiados de dashboard-fabrica para botones de acción
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
});
