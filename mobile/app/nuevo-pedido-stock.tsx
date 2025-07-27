import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, ActivityIndicator} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Producto {
  id_producto: number;
  nombre_producto: string;
  precio: number;
  descripcion: string;
}

interface ProductoSolicitado {
  id_producto: number;
  producto: Producto;
  cantidad: number;
}

export default function NuevoPedidoStock() {
  const { user } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosSolicitados, setProductosSolicitados] = useState<ProductoSolicitado[]>([]);
  const [selectedProducto, setSelectedProducto] = useState<number | null>(null);
  const [cantidad, setCantidad] = useState('1');
  const [prioridad, setPrioridad] = useState<'Baja' | 'Media' | 'Alta' | 'Urgente'>('Media');
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Constantes para el pedido de stock
  const BODEGA_DEFECTO = 1;

  useEffect(() => {
    cargarProductos();
  }, []);



  const cargarProductos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProductos(response.data.data || []);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const agregarProducto = () => {
    if (!selectedProducto || parseInt(cantidad) <= 0) {
      Alert.alert('Error', 'Selecciona un producto y una cantidad válida (mayor a 0)');
      return;
    }

    // Verificar si el producto ya está en la lista
    if (productosSolicitados.some(p => p.id_producto === selectedProducto)) {
      Alert.alert('Error', 'Este producto ya está en la lista');
      return;
    }

    const producto = productos.find(p => p.id_producto === selectedProducto || p.id_producto.toString() === selectedProducto.toString());
    
    if (!producto) {
      Alert.alert('Error', 'No se encontró el producto seleccionado');
      return;
    }

    const nuevoProducto: ProductoSolicitado = {
      id_producto: selectedProducto,
      producto,
      cantidad: parseInt(cantidad),
    };

    setProductosSolicitados(prev => [...prev, nuevoProducto]);
    setSelectedProducto(null);
    setCantidad('1');
    Alert.alert('Éxito', `${producto.nombre_producto} agregado al pedido`);
  };

  const eliminarProducto = (id_producto: number) => {
    setProductosSolicitados(prev => prev.filter(p => p.id_producto !== id_producto));
  };

  const modificarCantidad = (id_producto: number, nuevaCantidad: string) => {
    const cantidadNum = parseInt(nuevaCantidad) || 0;
    if (cantidadNum <= 0) return;

    setProductosSolicitados(prev =>
      prev.map(p =>
        p.id_producto === id_producto
          ? { ...p, cantidad: cantidadNum }
          : p
      )
    );
  };

  const crearPedido = async () => {
    if (productosSolicitados.length === 0) {
      Alert.alert('Error', 'Agrega al menos un producto al pedido');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'Debes estar autenticado para crear un pedido');
      return;
    }

    try {
      setSaving(true);

      // Crear una orden por cada producto
      for (const producto of productosSolicitados) {
        const ordenData = {
          cantidad: producto.cantidad,
          origen: 'Tienda',
          destino: 'Fabrica',
          fecha_envio: new Date().toISOString(),
          estado: 'Pendiente',
          prioridad,
          observaciones: observaciones.trim() || null,
          tipo: 'stock',
          id_producto: producto.id_producto,
          id_usuario: parseInt(user.id),
          id_bodega: BODEGA_DEFECTO
        };

        await api.post('/orden', ordenData);
      }

      // Navegar al dashboard de ventas con parámetros para ir a pedidos stock
      router.replace({
        pathname: '/(tabs)/dashboard-ventas',
        params: { tab: 'pedidos-stock' }
      });
      
      Alert.alert(
        'Éxito',
        `Pedido de stock creado exitosamente.\n${productosSolicitados.length} orden(es) generada(s).`
      );
    } catch (error: any) {
      let errorMessage = 'No se pudo crear el pedido de stock';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const getTotalUnidades = () => {
    return productosSolicitados.reduce((total, producto) => total + producto.cantidad, 0);
  };

  const getPrioridadColor = (prioridadValue: string) => {
    switch (prioridadValue) {
      case 'Urgente': return '#DC2626';
      case 'Alta': return '#FF6B35';
      case 'Media': return '#FFA500';
      case 'Baja': return '#00AA00';
      default: return '#666666';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Nuevo Pedido de Stock</Text>
            <Text style={styles.headerSubtitle}>Solicitar productos para inventario</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Información del Pedido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Pedido</Text>
          <Text style={styles.sectionSubtitle}>Configuración general del pedido</Text>

          {/* Nivel de Urgencia */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Nivel de Urgencia</Text>
            <View style={styles.prioridadContainer}>
              <View style={[styles.prioridadIndicator, { backgroundColor: getPrioridadColor(prioridad) }]} />
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={prioridad}
                  onValueChange={(value) => setPrioridad(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Baja - Normal" value="Baja" />
                  <Picker.Item label="Media - Normal" value="Media" />
                  <Picker.Item label="Alta - Importante" value="Alta" />
                  <Picker.Item label="Urgente - Crítico" value="Urgente" />
                </Picker>
              </View>
            </View>
          </View>

          {/* Observaciones */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Observaciones</Text>
            <TextInput
              style={styles.observacionesInput}
              placeholder="Observaciones adicionales sobre el pedido..."
              placeholderTextColor="#666"
              value={observaciones}
              onChangeText={setObservaciones}
              maxLength={300}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Productos Solicitados */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Productos Solicitados</Text>
              <Text style={styles.sectionSubtitle}>Agrega los productos que necesitas</Text>
            </View>
            <TouchableOpacity 
              style={styles.agregarButton} 
              onPress={agregarProducto}
            >
              <Ionicons name="add" size={16} color="#FFFFFF" />
              <Text style={styles.agregarButtonText}>Agregar</Text>
            </TouchableOpacity>
          </View>

          {/* Selector de producto */}
          <View style={styles.productSelector}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Producto</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedProducto}
                  onValueChange={(value) => setSelectedProducto(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Seleccionar producto" value={null} />
                  {productos
                  .filter(producto => producto && producto.nombre_producto && producto.nombre_producto.trim() !== '') 
                  .map(producto => (
                    <Picker.Item
                      key={producto.id_producto}
                      label={producto.nombre_producto}
                      value={producto.id_producto}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Cantidad</Text>
              <TextInput
                style={styles.cantidadInput}
                value={cantidad}
                onChangeText={setCantidad}
                keyboardType="numeric"
                placeholder="1"
                maxLength={5}
              />
            </View>
          </View>

          {/* Lista de productos agregados */}
          {productosSolicitados.length > 0 && (
            <View style={styles.productosLista}>
              {productosSolicitados.map(item => (
                <View key={item.id_producto} style={styles.productoItem}>
                  <View style={styles.productoInfo}>
                    <Text style={styles.productoNombre}>{item.producto.nombre_producto}</Text>
                    <View style={styles.cantidadContainer}>
                      <TouchableOpacity
                        style={styles.cantidadButton}
                        onPress={() => modificarCantidad(item.id_producto, (item.cantidad - 1).toString())}
                      >
                        <Ionicons name="remove" size={16} color="#666" />
                      </TouchableOpacity>
                      <Text style={styles.cantidadText}>{item.cantidad}</Text>
                      <TouchableOpacity
                        style={styles.cantidadButton}
                        onPress={() => modificarCantidad(item.id_producto, (item.cantidad + 1).toString())}
                      >
                        <Ionicons name="add" size={16} color="#666" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.eliminarButton}
                    onPress={() => eliminarProducto(item.id_producto)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botón de crear pedido */}
      <View style={styles.bottomButton}>
        <TouchableOpacity
          style={[
            styles.crearButton,
            productosSolicitados.length === 0 && styles.crearButtonDisabled
          ]}
          onPress={crearPedido}
          disabled={saving || productosSolicitados.length === 0}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Ionicons name="cube" size={20} color="#FFFFFF" />
              <Text style={styles.crearButtonText}>
                Crear Pedido de Stock ({getTotalUnidades()} unidades)
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    color: '#666',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    backgroundColor: '#374151',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
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
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
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
  prioridadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prioridadIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  picker: {
    height: 50,
    color: '#374151',
  },
  observacionesInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  agregarButton: {
    backgroundColor: '#22C55E', // Verde
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  agregarButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  productSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  cantidadInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlign: 'center',
    minWidth: 80,
  },
  productosLista: {
    gap: 8,
  },
  productoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  productoInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productoNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  cantidadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 4,
  },
  cantidadButton: {
    padding: 4,
  },
  cantidadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  eliminarButton: {
    padding: 8,
    marginLeft: 8,
  },
  bottomButton: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  crearButton: {
    backgroundColor: '#22C55E', // Verde cuando esté habilitado
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  crearButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  crearButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
