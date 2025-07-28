import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseOrden } from '../types/dashboard';
import { getPrioridadColor, getEstadoColor } from '../config/dashboardConfig';
import { OrderPhotoPreview } from './OrderPhotoPreview';

interface BaseOrderCardProps {
  orden: BaseOrden;
  tipo: 'fabrica' | 'ventas' | 'stock';
  children?: React.ReactNode;
  onPress?: () => void;
  isSelected?: boolean;
  showCheckbox?: boolean;
  onToggleSelect?: () => void;
}

export const BaseOrderCard: React.FC<BaseOrderCardProps> = ({
  orden,
  tipo,
  children,
  onPress,
  isSelected = false,
  showCheckbox = false,
  onToggleSelect,
}) => {
  const renderHeader = () => {
    const prefix = tipo === 'stock' ? 'STOCK' : tipo === 'ventas' ? 'DESP' : 'PED';
    const title = `${prefix}-${orden.id_orden.toString().padStart(3, '0')}`;
    
    return (
      <View style={styles.ordenHeader}>
        <View style={styles.ordenTituloContainer}>
          {showCheckbox && (
            <TouchableOpacity
              style={[styles.checkbox, isSelected && styles.checkboxSelected]}
              onPress={onToggleSelect}
            >
              {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
            </TouchableOpacity>
          )}
          <Text style={styles.ordenTitulo}>{title}</Text>
          {orden.estado && (
            <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(orden.estado) }]}>
              <Text style={styles.badgeText}>{orden.estado.toUpperCase()}</Text>
            </View>
          )}
        </View>
        <View style={styles.ordenBadges}>
          {orden.prioridad && (
            <View style={[styles.prioridadBadge, { backgroundColor: getPrioridadColor(orden.prioridad) }]}>
              <Text style={styles.badgeText}>{orden.prioridad}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderInfo = () => {
    return (
      <View style={styles.ordenInfo}>
        {/* Información compacta para móviles */}
        <View style={styles.mobileInfoRow}>
          {/* Cliente/Vendedor */}
          {(orden.cliente || orden.vendedor) && (
            <View style={styles.mobileInfoItem}>
              <Ionicons name="person" size={14} color="#6B7280" />
              <Text style={styles.mobileInfoText}>
                {orden.cliente || orden.vendedor}
              </Text>
            </View>
          )}
          
          {/* Origen/Destino para ventas */}
          {tipo === 'ventas' && orden.origen && orden.destino && (
            <View style={styles.mobileInfoItem}>
              <Ionicons name="location" size={14} color="#6B7280" />
              <Text style={styles.mobileInfoText}>
                {orden.origen} → {orden.destino}
              </Text>
            </View>
          )}
        </View>
        
        {/* Producto con vista previa compacta */}
        <View style={styles.mobileProductoContainer}>
          <View style={styles.mobileProductoInfo}>
            <Text style={styles.mobileProductoText}>
              {orden.producto.nombre_producto}
            </Text>
            <Text style={styles.mobileCantidadText}>
              {orden.cantidad} unidades
            </Text>
          </View>
          <OrderPhotoPreview id_orden={orden.id_orden} size="small" />
        </View>
        
        {/* Fechas compactas */}
        <View style={styles.mobileFechasContainer}>
          {orden.fecha_solicitud && (
            <View style={styles.mobileFechaItem}>
              <Ionicons name="calendar" size={12} color="#9CA3AF" />
              <Text style={styles.mobileFechaText}>
                {new Date(orden.fecha_solicitud).toLocaleDateString()}
              </Text>
            </View>
          )}
          {orden.fecha_envio && (
            <View style={styles.mobileFechaItem}>
              <Ionicons name="send" size={12} color="#9CA3AF" />
              <Text style={styles.mobileFechaText}>
                {new Date(orden.fecha_envio).toLocaleDateString()}
              </Text>
            </View>
          )}
          {orden.fecha_entrega && (
            <View style={styles.mobileFechaItem}>
              <Ionicons name="checkmark-done" size={12} color="#9CA3AF" />
              <Text style={styles.mobileFechaText}>
                {new Date(orden.fecha_entrega).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
        
        {/* Transportista para ventas */}
        {tipo === 'ventas' && orden.transportista && (
          <View style={styles.mobileInfoItem}>
            <Ionicons name="car" size={14} color="#6B7280" />
            <Text style={styles.mobileInfoText}>
              {orden.transportista}
            </Text>
          </View>
        )}
        
        {/* Observaciones */}
        {orden.observaciones && (
          <View style={styles.mobileObservacionesContainer}>
            <Ionicons name="chatbubble" size={14} color="#6B7280" />
            <Text style={styles.mobileObservacionesText}>
              {orden.observaciones}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.ordenCard,
        isSelected && styles.ordenSeleccionada,
        orden.estado === 'Recibido con problemas' && styles.ordenConProblemas
      ]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {renderHeader()}
      {renderInfo()}
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  ordenCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12, // Reducido para móviles
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 8, // Reducido para móviles
  },
  ordenSeleccionada: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  ordenConProblemas: {
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  ordenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8, // Reducido para móviles
  },
  ordenTituloContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 20, // Reducido para móviles
    height: 20, // Reducido para móviles
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 8, // Reducido para móviles
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  ordenTitulo: {
    fontSize: 14, // Reducido para móviles
    fontWeight: 'bold',
    color: '#374151',
    marginRight: 6, // Reducido para móviles
  },
  estadoBadge: {
    paddingHorizontal: 6, // Reducido para móviles
    paddingVertical: 2, // Reducido para móviles
    borderRadius: 8,
  },
  ordenBadges: {
    flexDirection: 'row',
    gap: 4, // Reducido para móviles
  },
  prioridadBadge: {
    paddingHorizontal: 6, // Reducido para móviles
    paddingVertical: 2, // Reducido para móviles
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10, // Reducido para móviles
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  ordenInfo: {
    marginBottom: 8, // Reducido para móviles
  },
  // Estilos móviles optimizados
  mobileInfoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
    gap: 8,
  },
  mobileInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  mobileInfoText: {
    fontSize: 12, // Reducido para móviles
    color: '#6B7280',
    marginLeft: 4,
    flex: 1,
  },
  mobileProductoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 6, // Reducido para móviles
  },
  mobileProductoInfo: {
    flex: 1,
    marginRight: 8, // Reducido para móviles
  },
  mobileProductoText: {
    fontSize: 13, // Reducido para móviles
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  mobileCantidadText: {
    fontSize: 11, // Reducido para móviles
    color: '#6B7280',
  },
  mobileFechasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6, // Reducido para móviles
    gap: 8,
  },
  mobileFechaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mobileFechaText: {
    fontSize: 10, // Reducido para móviles
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginLeft: 2,
  },
  mobileObservacionesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  mobileObservacionesText: {
    fontSize: 11, // Reducido para móviles
    color: '#374151',
    fontStyle: 'italic',
    marginLeft: 4,
    flex: 1,
  },
  // Estilos originales mantenidos para compatibilidad
  clienteText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  origenDestinoText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  tipoText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  productoText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  cantidadText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  fechaText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  transportistaText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  observacionesText: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
    marginTop: 4,
  },
  productoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  productoInfo: {
    flex: 1,
    marginRight: 12,
  },
});
