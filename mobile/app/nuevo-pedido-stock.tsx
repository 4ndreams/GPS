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
    <ScrollView style={styles.container}>
      {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Nuevo Pedido de Stock</Text>
            </View>


      {/* Información del Pedido */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información del Pedido</Text>
        
        {/* Nivel de Urgencia */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nivel de Urgencia:</Text>
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
          <Text style={styles.formLabel}>Observaciones:</Text>
          <TextInput
            style={styles.observacionesInput}
            placeholder="Observaciones adicionales sobre el pedido..."
            placeholderTextColor="#6B7280"
            value={observaciones}
            onChangeText={setObservaciones}
            maxLength={300}
            multiline
            numberOfLines={3}
          />
        </View>
      </View>

      {/* Agregar Productos */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Agregar Productos</Text>
          <TouchableOpacity 
            style={styles.agregarButton} 
            onPress={agregarProducto}
            disabled={!selectedProducto || parseInt(cantidad) <= 0}
          >
            <Ionicons name="add" size={16} color="#FFFFFF" />
            <Text style={styles.agregarButtonText}>Agregar</Text>
          </TouchableOpacity>
        </View>

        {/* Selector de producto */}
        <View style={styles.productSelector}>
          <View style={styles.selectorGroup}>
            <Text style={styles.formLabel}>Producto:</Text>
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

          <View style={styles.selectorGroup}>
            <Text style={styles.formLabel}>Cantidad:</Text>
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
      </View>

      {/* Productos Solicitados */}
      {productosSolicitados.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Productos Solicitados ({getTotalUnidades()} unidades)</Text>
          
          <View style={styles.productosLista}>
            {productosSolicitados.map(item => (
              <View key={item.id_producto} style={styles.productoItem}>
                <View style={styles.productoInfo}>
                  <Text style={styles.productoNombre}>{item.producto.nombre_producto}</Text>
                  <View style={styles.cantidadControles}>
                    <TouchableOpacity
                      style={styles.cantidadButton}
                      onPress={() => modificarCantidad(item.id_producto, (item.cantidad - 1).toString())}
                    >
                      <Ionicons name="remove" size={16} color="#6B7280" />
                    </TouchableOpacity>
                    <Text style={styles.cantidadText}>{item.cantidad}</Text>
                    <TouchableOpacity
                      style={styles.cantidadButton}
                      onPress={() => modificarCantidad(item.id_producto, (item.cantidad + 1).toString())}
                    >
                      <Ionicons name="add" size={16} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.eliminarButton}
                  onPress={() => eliminarProducto(item.id_producto)}
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Botón de crear pedido */}
      <View style={styles.buttonContainer}>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    flex: 1,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 8,
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
    padding: 16,
    fontSize: 14,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  agregarButton: {
    backgroundColor: '#10B981',
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
    gap: 16,
    marginBottom: 16,
  },
  selectorGroup: {
    flex: 1,
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
  },
  productosLista: {
    gap: 12,
  },
  productoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  productoInfo: {
    flex: 1,
  },
  productoNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  cantidadControles: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 4,
    alignSelf: 'flex-start',
  },
  cantidadButton: {
    padding: 8,
    borderRadius: 6,
  },
  cantidadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  eliminarButton: {
    padding: 8,
    marginLeft: 12,
  },
  buttonContainer: {
    margin: 16,
    marginBottom: 32,
  },
  crearButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  crearButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  crearButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
