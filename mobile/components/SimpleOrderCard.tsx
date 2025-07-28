import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseOrden } from '../types/dashboard';
import { getPrioridadColor, getEstadoColor } from '../config/dashboardConfig';

interface SimpleOrderCardProps {
  orden: BaseOrden;
  tipo: 'fabrica' | 'ventas' | 'stock';
  children?: React.ReactNode;
  onPress?: () => void;
  isSelected?: boolean;
  showCheckbox?: boolean;
  onToggleSelect?: () => void;
}

export const SimpleOrderCard: React.FC<SimpleOrderCardProps> = ({
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
        {/* Información específica del cliente/vendedor */}
        {(orden.cliente || orden.vendedor) && (
          <Text style={styles.clienteText}>
            {orden.cliente || orden.vendedor}
          </Text>
        )}
        
        {/* Información de origen/destino para ventas */}
        {tipo === 'ventas' && orden.origen && orden.destino && (
          <Text style={styles.origenDestinoText}>
            {orden.origen} → {orden.destino}
          </Text>
        )}
        
        {/* Tipo de pedido para stock */}
        {tipo === 'stock' && (
          <Text style={styles.tipoText}>Pedido de stock interno</Text>
        )}
        
        {/* Producto SIN vista previa de foto */}
        <View style={styles.productoContainer}>
          <Text style={styles.productoText}>
            • {orden.producto.nombre_producto}
          </Text>
          {/* Cantidad */}
          <Text style={styles.cantidadText}>
            Cantidad: {orden.cantidad} unidades
          </Text>
        </View>
        
        {/* Fechas */}
        {orden.fecha_solicitud && (
          <Text style={styles.fechaText}>
            Solicitado: {new Date(orden.fecha_solicitud).toLocaleDateString()}
          </Text>
        )}
        {orden.fecha_envio && (
          <Text style={styles.fechaText}>
            Enviado: {new Date(orden.fecha_envio).toLocaleDateString()}
          </Text>
        )}
        {orden.fecha_entrega && (
          <Text style={styles.fechaText}>
            Entregado: {new Date(orden.fecha_entrega).toLocaleDateString()}
          </Text>
        )}
        
        {/* Transportista para ventas */}
        {tipo === 'ventas' && orden.transportista && (
          <Text style={styles.transportistaText}>
            Transportista: {orden.transportista}
          </Text>
        )}
        
        {/* Observaciones */}
        {orden.observaciones && (
          <Text style={styles.observacionesText}>
            {orden.observaciones}
          </Text>
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
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 12,
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
    marginBottom: 12,
  },
  ordenTituloContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  ordenTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginRight: 8,
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ordenBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  prioridadBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  ordenInfo: {
    marginBottom: 12,
  },
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
  productoContainer: {
    marginBottom: 8,
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
});
