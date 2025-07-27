import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseDashboard } from '../../components/BaseDashboard';
import { BaseOrderCard } from '../../components/BaseOrderCard';
import { getConfigForProfile } from '../../config/dashboardConfig';
import { useOrderActions } from '../../hooks/useOrderActions';
import { useDashboardData } from '../../hooks/useDashboardData';
import { OrdenFabrica } from '../../types/dashboard';
import * as ImagePicker from 'expo-image-picker';
import { TokenService } from '../../services/tokenService';

export default function DashboardFabrica() {
  const config = getConfigForProfile('fabrica');
  const { data, loading, refreshing, onRefresh } = useDashboardData(config);
  const { procesando, cambiarEstado } = useOrderActions(onRefresh);
  
  const [ordenesSeleccionadas, setOrdenesSeleccionadas] = useState<number[]>([]);
  const [transportista, setTransportista] = useState('');
  const [observacionesDespacho, setObservacionesDespacho] = useState('');
  const [fotosDespacho, setFotosDespacho] = useState<string[]>([]);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  

  const toggleOrdenSeleccionada = (id_orden: number) => {
    if (ordenesSeleccionadas.includes(id_orden)) {
      setOrdenesSeleccionadas(prev => prev.filter(id => id !== id_orden));
    } else {
      setOrdenesSeleccionadas(prev => [...prev, id_orden]);
    }
  };

  // Función para tomar foto con cámara
  const tomarFoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Se necesitan permisos de cámara para tomar fotos');
        return;
      }

      setSubiendoFoto(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ Usar la versión que funciona
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        exif: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        // Solo guardar localmente, NO subir aún - se subirá al crear el despacho
        setSelectedFiles(prev => [...prev, asset]);
        setFotosDespacho(prev => [...prev, asset.uri]);
        Alert.alert('Éxito', 'Foto agregada correctamente');
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
      Alert.alert('Error', 'No se pudo agregar la foto. Intenta nuevamente.');
    } finally {
      setSubiendoFoto(false);
    }
  };

  // Elimina imagen de ambos arreglos
  const eliminarFoto = (index: number) => {
    setFotosDespacho(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Función para subir una imagen individual después de procesar una orden
  const subirImagenIndividual = async (uri: string, id_orden: number): Promise<string> => {
    try {
      console.log('=== SUBIENDO IMAGEN INDIVIDUAL ===');
      console.log('URI:', uri);
      console.log('ID Orden:', id_orden);
      
      // Obtener token de autenticación
      const token = await TokenService.getToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const formData = new FormData();
      const nombreArchivo = uri.split('/').pop() || `despacho-${Date.now()}.jpg`;

      // Agregar la imagen al FormData con el nombre que espera tu backend ("file")
      formData.append('file', {
        uri,
        name: nombreArchivo,
        type: 'image/jpeg'
      } as any);

      // Agregar el id_orden que tu backend necesita
      formData.append('id_orden', id_orden.toString());

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/photo`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        }
      );

      console.log('Respuesta:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error del servidor:', errorText);
        throw new Error(`Error al subir imagen: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Imagen subida exitosamente:', data);
      
      // Tu backend devuelve la imagen con la URL de MinIO
      return data.data?.ruta_imagen || data.ruta_imagen || '';
    } catch (error) {
      console.error('Error al subir imagen individual:', error);
      throw error;
    }
  };

  // Sube todas las imágenes después de cambiar estado de órdenes
  const subirTodasLasImagenes = async (ordenesActualizadas: number[]): Promise<string[]> => {
    const urls: string[] = [];
    
    try {
      console.log('📸 Iniciando subida de todas las imágenes...');
      console.log(`🔢 Total de imágenes a subir: ${selectedFiles.length}`);
      console.log(`📦 Órdenes actualizadas: ${ordenesActualizadas}`);
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const asset = selectedFiles[i];
        
        // Para cada imagen, subirla para TODAS las órdenes seleccionadas
        for (const ordenId of ordenesActualizadas) {
          console.log(`📤 Subiendo imagen ${i + 1}/${selectedFiles.length} para orden ID: ${ordenId}`);
          
          try {
            // Subir imagen asociándola directamente con el id_orden
            const urlImagen = await subirImagenIndividual(asset.uri, ordenId);
            
            // Solo agregar la URL una vez por imagen (no por cada orden)
            if (!urls.includes(urlImagen)) {
              urls.push(urlImagen);
            }
            
            console.log(`✅ Imagen ${i + 1} subida exitosamente para orden ${ordenId}: ${urlImagen}`);
          } catch (imageError) {
            console.error(`❌ Error al subir imagen ${i + 1} para orden ${ordenId}:`, imageError);
            // Continuar con las demás órdenes
          }
        }
      }
      
      console.log('🎉 Proceso de subida completado');
      console.log(`📋 URLs generadas: ${urls.length}`);
      
      if (urls.length === 0) {
        throw new Error('No se pudo subir ninguna imagen');
      }
      
      return urls;
    } catch (error) {
      console.error('❌ Error en el proceso de subida de imágenes:', error);
      throw error;
    }
  };


  // Crear despacho: 
  // 1. Primero procesar órdenes (cambiar estado)
  // 2. Luego subir imágenes asociándolas directamente con los ids de orden
  const handleCrearDespacho = async () => {
    // Validaciones
    if (!transportista.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre del transportista');
      return;
    }

    if (ordenesSeleccionadas.length === 0) {
      Alert.alert('Error', 'Selecciona al menos una orden para el despacho');
      return;
    }

    if (selectedFiles.length === 0) {
      Alert.alert('Error', 'Debes agregar al menos una foto del despacho');
      return;
    }

    try {
      setSubiendoFoto(true);
      console.log('🚚 Iniciando creación de despacho...');
      console.log('📦 Órdenes seleccionadas:', ordenesSeleccionadas);
      console.log('📸 Fotos a subir:', selectedFiles.length);

      // PASO 1: Cambiar estado de las órdenes
      const ordenesActualizadas: number[] = [];
      for (const ordenId of ordenesSeleccionadas) {
        await cambiarEstado(ordenId, 'En tránsito', { 
          //transportista: transportista.trim(),
          observaciones: observacionesDespacho.trim() || null,
        });
        ordenesActualizadas.push(ordenId);
      }
      console.log('✅ Órdenes actualizadas exitosamente');

      // PASO 2: Subir imágenes asociándolas directamente con las órdenes procesadas
      const uploadedUrls = await subirTodasLasImagenes(ordenesActualizadas);
      console.log('✅ URLs de imágenes subidas:', uploadedUrls);

      // Limpiar formulario
      setOrdenesSeleccionadas([]);
      setTransportista('');
      setObservacionesDespacho('');
      setFotosDespacho([]);
      setSelectedFiles([]);
      
      Alert.alert(
        'Éxito', 
        `Despacho creado correctamente:\n• ${ordenesActualizadas.length} orden(es) actualizadas\n• ${uploadedUrls.length} foto(s) subida(s) a MinIO`
      );
    } catch (error: any) {
      console.error('❌ Error al crear despacho:', error);
      Alert.alert('Error', `No se pudo crear el despacho: ${error.message || 'Error desconocido'}`);
    } finally {
      setSubiendoFoto(false);
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

            {/* Sección de fotos */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, styles.requiredField]}>
                Fotos del Despacho *
              </Text>
              
              {/* Botón para tomar foto */}
              <TouchableOpacity
                style={styles.fotoButton}
                onPress={tomarFoto}
                disabled={subiendoFoto}
              >
                {subiendoFoto ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Ionicons name="camera" size={20} color="#FFFFFF" />
                )}
                <Text style={styles.fotoButtonText}>
                  {subiendoFoto ? 'Subiendo...' : 'Tomar Foto'}
                </Text>
              </TouchableOpacity>

              {/* Mostrar fotos tomadas */}
              {fotosDespacho.length > 0 && (
                <ScrollView horizontal style={styles.fotosContainer} showsHorizontalScrollIndicator={false}>
                  {fotosDespacho.map((foto, index) => (
                    <View key={index} style={styles.fotoItem}>
                      <Image source={{ uri: foto }} style={styles.fotoPreview} />
                      <TouchableOpacity
                        style={styles.eliminarFotoButton}
                        onPress={() => eliminarFoto(index)}
                      >
                        <Ionicons name="close-circle" size={20} color="#DC2626" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}
              
              {/* Mostrar contador de fotos y mensaje de requerimiento */}
              {fotosDespacho.length > 0 ? (
                <Text style={styles.fotoCounter}>
                  {fotosDespacho.length} foto{fotosDespacho.length !== 1 ? 's' : ''} agregada{fotosDespacho.length !== 1 ? 's' : ''}
                </Text>
              ) : (
                <Text style={styles.fotoRequiredMessage}>
                  Debes tomar al menos una foto para crear el despacho
                </Text>
              )}
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
  requiredField: {
    color: '#DC2626',
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
  fotoButton: {
    backgroundColor: '#0066CC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  fotoButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  fotosContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  fotoItem: {
    position: 'relative',
    marginRight: 12,
  },
  fotoPreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  eliminarFotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  fotoCounter: {
    fontSize: 12,
    color: '#059669',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '600',
  },
  fotoRequiredMessage: {
    fontSize: 12,
    color: '#DC2626',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
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