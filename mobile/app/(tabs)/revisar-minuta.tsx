
// Pantalla para revisar minutas pendientes de aprobación
/*
 * FLUJO DE DATOS:
 * useUsuario() → verificar perfil → cargar minutas → mostrar lista →
 * seleccionar minuta → mostrar detalle → confirmar productos → aprobar minuta
 */
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUsuario } from '../../contexts/UsuarioContext';

// Interfaces y tipos de datos
// Paso 1: Interface para productos individuales (puertas)
// Reutilizamos la misma estructura que en crear-minuta 
interface Puerta {
  id: string;                   // Identificador único del producto
  medidas: {                    // Especificaciones técnicas
    alto: number;               // En centímetros
    ancho: number;              // En centímetros  
    espesor: number;            // En centímetros
  };
  material_exterior: string;    // Tipo de material de la superficie
  relleno_interior: string;     // Tipo de relleno interno
  observaciones: string;        // Detalles adicionales del operador
}

// Paso 2: Interface para minutas completas que necesitan revisión

interface MinutaParaRevisar {
  id: string;                    // Identificador único de la minuta
  fecha: string;                 // Timestamp de creación por operador
  operador: string;              // Nombre de quien creó la minuta
  estado: 'pendiente' | 'en_revision' | 'confirmada' | 'rechazada'; // Estado de la minuta
  puertas: Puerta[];            // Array de productos a revisar
  foto: string;                 // URI de imagen de la minuta (futuro)
  confirmaciones: { [puertaId: string]: boolean }; // Mapa de confirmaciones por producto
  totalPuertas: number;   
}

// Componente principal de revisión de minutas

export default function RevisarMinuta() {
  // Paso 3: Obtener contexto de usuario para verificar permisos
  //  Controlar acceso a componente
  const { usuario } = useUsuario();
  // Gestion de acceso: solo perfiles de tienda pueden ver esta pantalla
  // Lista de minutas disponibles para revisar
  const [minutas, setMinutas] = useState<MinutaParaRevisar[]>([]);
  const [minutaSeleccionada, setMinutaSeleccionada] = useState<MinutaParaRevisar | null>(null);
  const [vistaActual, setVistaActual] = useState<'lista' | 'detalle'>('lista');
  
  // Indicador de carga
  const [loading, setLoading] = useState(false);

  // Paso 4: Inicializar la lista de minutas disponibles
  useEffect(() => {
    cargarMinutasPendientes();
  }, []); // Array vacío = solo en mount

  // Simulacion de API para cargar minutas pendientes
  const cargarMinutasPendientes = async () => {
    setLoading(true);
    
    try {
      // SIMULACIÓN: En producción aquí iría:
      // const response = await AsyncStorage.getItem('minutas');
      // const minutasStorage = response ? JSON.parse(response) : [];
      // const minutasPendientes = minutasStorage.filter(m => m.estado === 'pendiente');
      
      // DATOS DE PRUEBA: Minutas realistas para testing
      // Cada una representa un escenario diferente de uso
      const minutasEjemplo: MinutaParaRevisar[] = [
        // MINUTA 1: Caso típico - 3 productos mixtos
        {
          id: '1',
          fecha: new Date().toISOString(), 
          operador: 'Juan Pérez',           // Operador fábrica turno mañana
          estado: 'pendiente',
          totalPuertas: 3,
          foto: '',                         // Futuro: URI de imagen
          confirmaciones: {},               // Objeto vacío = ningún producto confirmado aún
          puertas: [
            // PRODUCTO 1: Puerta enchapada estándar
            {
              id: '1',
              medidas: { alto: 200, ancho: 80, espesor: 4 },
              material_exterior: 'MDF Enchapado',
              relleno_interior: 'Nido de Abeja',
              observaciones: 'Geno Enchape Wengue'
            },
            // PRODUCTO 2: Puerta doble enchapada
            {
              id: '2',
              medidas: { alto: 200, ancho: 160, espesor: 4 }, // Ancho doble
              material_exterior: 'MDF Enchapado',
              relleno_interior: 'Nido de Abeja',
              observaciones: 'Doble Castell Enchape Mara'
            },
            // PRODUCTO 3: Puerta terciada (producto diferente)
            {
              id: '3',
              medidas: { alto: 200, ancho: 80, espesor: 3 },  // Espesor menor
              material_exterior: 'Terciado',
              relleno_interior: 'Relleno de Madera',
              observaciones: 'Terciada Castellana Natural'
            }
          ]
        },
      {
        id: '2',
        fecha: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Minuta de ayer
        operador: 'Carlos López',
        estado: 'pendiente',
        totalPuertas: 2,
        foto: '',
        confirmaciones: {},
        puertas: [
          {
            id: '4',
            medidas: { alto: 200, ancho: 80, espesor: 4 },
            material_exterior: 'MDF Enchapado',
            relleno_interior: 'Nido de Abeja',
            observaciones: 'Milano Vidrio Centrado Enchape Wengue'
          },
          {
            id: '5',
            medidas: { alto: 200, ancho: 80, espesor: 4 },
            material_exterior: 'MDF Enchapado',
            relleno_interior: 'Nido de Abeja',
            observaciones: 'Alcala Enchape Wengue'
          }
        ]
      }
    ];

    // Delay de red para mostrar loading state
    // En producción esto sería el tiempo real de la llamada a API/Storage
    setTimeout(() => {
      setMinutas(minutasEjemplo);
      setLoading(false);
    }, 1000); // 1 segundo para simular carga

  } catch (error) {
    // MANEJO DE ERRORES: En producción aquí manejaríamos errores de red/storage
    console.error('Error cargando minutas:', error);
    setLoading(false);
    Alert.alert('Error', 'No se pudieron cargar las minutas pendientes');
  }
};

  
  // Usuario toca minuta → guardar selección → cambiar vista
  const seleccionarMinuta = (minuta: MinutaParaRevisar) => {
    // Guardar la minuta que se va a revisar en detalle
    setMinutaSeleccionada(minuta);
    
    // Cambiar vista para mostrar componente de detalle
    setVistaActual('detalle');
    
    // La vendedora ve ahora la pantalla de productos individuales
  };

  // Detalle → Lista 
  // Usuario presiona "Volver" → limpiar selección → cambiar vista
  const volverALista = () => {
    // Cambiar vista primero
    setVistaActual('lista');
    
    // Limpiar selección para liberar memoria
    setMinutaSeleccionada(null);
    
    // La vendedora regresa a la lista de minutas pendientes
  };

  // confirmación de producto individual
  const toggleConfirmacionProducto = (puertaId: string) => {
    // No procesar si no hay minuta seleccionada
    if (!minutaSeleccionada) return;

    // Crear nuevo estado de confirmaciones (inmutable)
    const nuevasConfirmaciones = {
      ...minutaSeleccionada.confirmaciones, // Preservar confirmaciones existentes
      [puertaId]: !minutaSeleccionada.confirmaciones[puertaId] // Toggle específico
    };

    // Crear nueva minuta con confirmaciones actualizadas
    const minutaActualizada = {
      ...minutaSeleccionada,
      confirmaciones: nuevasConfirmaciones
    };

    // Actualización doble para consistencia de estado

    // 3a. Actualizar vista de detalle (cambio inmediato en UI)
    setMinutaSeleccionada(minutaActualizada);
    
    // 3b. Actualizar lista principal (persistencia para cuando vuelva a lista)
    setMinutas(prev => 
      prev.map(m => 
        m.id === minutaSeleccionada.id 
          ? minutaActualizada    // Reemplazar minuta modificada
          : m                    // Mantener otras minutas sin cambios
      )
    );
    
  };
  // PROCESO DE APROBACIÓN FINAL 
  // Iniciar proceso de aprobación
  const aprobarMinuta = () => {
    // Verificar que hay minuta seleccionada
    if (!minutaSeleccionada) return;

    // Calcular estadísticas de confirmación
    // Analizar cuántos productos han sido confirmados vs total
    const confirmaciones = minutaSeleccionada.confirmaciones;
    const productosConfirmados = Object.values(confirmaciones).filter(Boolean).length;
    const totalProductos = minutaSeleccionada.puertas.length;
    const porcentajeCompletitud = Math.round((productosConfirmados / totalProductos) * 100);

    // Logica de validación y flujo condicional
    if (productosConfirmados < totalProductos) {
      // Confirmación incompleta
      // Mostrar alerta de advertencia con estadísticas claras
      Alert.alert(
        'Confirmación incompleta',
        `Has confirmado ${productosConfirmados} de ${totalProductos} productos (${porcentajeCompletitud}%). ¿Deseas continuar con la aprobación?`,
        [
          { 
            text: 'Cancelar', 
            style: 'cancel',
            // Usuario decide revisar más productos
          },
          { 
            text: 'Aprobar de todas formas', 
            style: 'destructive',
            onPress: confirmarAprobacion 
          }
        ]
      );
    } else {
      // Confirmación completa
      confirmarAprobacion();
    }
  };

  // Realizar aprobación final
  const confirmarAprobacion = () => {
    //Verificar que hay minuta seleccionada
    if (!minutaSeleccionada) return;

    // Crear nueva minuta con estado aprobado
    // Principio de inmutabilidad: crear nuevo objeto
    const minutaAprobada = {
      ...minutaSeleccionada,
      estado: 'confirmada' as const, // Cambio de estado del workflow
      fechaAprobacion: new Date().toISOString(), // Timestamp de cuándo se aprobó
      aprobadaPor: 'Vendedora' // En el futuro sería el nombre real del usuario
    };

    // Actualizar la lista principal para reflejar el cambio
    setMinutas(prev => 
      prev.map(m => 
        m.id === minutaSeleccionada.id 
          ? minutaAprobada  // Reemplazar con versión aprobada
          : m               // Mantener otras minutas sin cambios
      )
    );

    // Mostrar confirmación de éxito y regresar a lista automáticamente
    Alert.alert(
      'Éxito', 
      'Minuta aprobada correctamente. Se ha notificado a fábrica.', 
      [
        { 
          text: 'OK', 
          onPress: volverALista // Navegación automática tras confirmación
        }
      ]
    );
    
    // Minuta desaparece de la lista de pendientes
  };

  //Función helper para formatear fechas de manera legible
  const formatearFecha = (fecha: string): string => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Control de acceso y permisos
  // Verificación de permisos por perfil de usuario
  // Solo vendedoras pueden acceder a esta funcionalidad
  if (usuario.perfil !== 'tienda') {
    return (
      <View style={styles.container}>
        {/* Header consistente con otras pantallas */}
        <View style={styles.headerBar}>
          <Image
            source={require('../../assets/logo.png')}
            style={[styles.logo, {marginTop: 15}]}
            resizeMode="contain"
          />
        </View>
        
        {/* Pantalla de acceso denegado */}
        <View style={styles.noPermissionContainer}>
          <Ionicons name="ban" size={64} color="#DC2626" />
          <Text style={styles.noPermissionTitle}>Acceso Denegado</Text>
          <Text style={styles.noPermissionText}>
            Esta función solo está disponible para el perfil de Tienda.
          </Text>
          <Text style={styles.noPermissionSubtext}>
            Ve a la pestaña Perfil para cambiar tu perfil.
          </Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/*Header general de la app*/}
      <View style={styles.headerBar}>
        <Image
          source={require('../../assets/logo.png')}
          style={[styles.logo, {marginTop: 15}]}
          resizeMode="contain"
        />
      </View>

      {/* Navegación condicional entre vistas */}
      <ScrollView style={styles.scrollContainer}>
        {vistaActual === 'lista' ? (
          /* Lista de minutas pendientes */
          <>
            {/*Header de la lista */}
            <Text style={styles.title}>Revisar Minutas</Text>
            <Text style={styles.subtitle}>
              Minutas pendientes de confirmación
            </Text>

            {/* Estados condicionales de la lista */}
            {loading ? (
              /* Estado de carga: Mostrar mientras se obtienen datos */
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Cargando minutas...</Text>
              </View>
            ) : minutas.length === 0 ? (
              /* Estado vacío: Cuando no hay minutas pendientes */
              <View style={styles.emptyContainer}>
                <Ionicons name="document-outline" size={64} color="#A1A1AA" />
                <Text style={styles.emptyTitle}>No hay minutas pendientes</Text>
                <Text style={styles.emptyText}>
                  Cuando fábrica envíe minutas aparecerán aquí
                </Text>
              </View>
            ) : (
              /*Lista principal de minutas */
              <View style={styles.minutasContainer}>
                {minutas.map((minuta) => (
                  <TouchableOpacity
                    key={minuta.id}
                    style={styles.minutaCard}
                    onPress={() => seleccionarMinuta(minuta)}
                  >
                    {/* Header de cada card: ID y estado */}
                    <View style={styles.minutaHeader}>
                      <Text style={styles.minutaId}>Minuta #{minuta.id}</Text>
                      <View style={[
                        styles.estadoBadge,
                        minuta.estado === 'confirmada' && styles.estadoConfirmado
                      ]}>
                        <Text style={styles.estadoText}>
                          {minuta.estado === 'pendiente' ? 'Pendiente' : 'Confirmada'}
                        </Text>
                      </View>
                    </View>
                    
                    {/* Información detallada de la minuta */}
                    <View style={styles.minutaInfo}>
                      {/* Fecha de creación */}
                      <View style={styles.minutaRow}>
                        <Ionicons name="calendar" size={16} color="#A1A1AA" />
                        <Text style={styles.minutaText}>
                          {formatearFecha(minuta.fecha)}
                        </Text>
                      </View>
                      
                      {/* Operador que la creó */}
                      <View style={styles.minutaRow}>
                        <Ionicons name="person" size={16} color="#A1A1AA" />
                        <Text style={styles.minutaText}>
                          Operador: {minuta.operador}
                        </Text>
                      </View>
                      
                      {/* Cantidad de productos */}
                      <View style={styles.minutaRow}>
                        <Ionicons name="list" size={16} color="#A1A1AA" />
                        <Text style={styles.minutaText}>
                          {minuta.totalPuertas} puerta{minuta.totalPuertas !== 1 ? 's' : ''}
                        </Text>
                      </View>
                    </View>
                    
                    {/* Indicador visual de navegación */}
                    <View style={styles.minutaActions}>
                      <Ionicons name="chevron-forward" size={20} color="#DC2626" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        ) : (
          minutaSeleccionada && (
            <>
              {/*Header de detalle con navegación de regreso */}
              <View style={styles.detalleHeader}>
                <TouchableOpacity style={styles.backButton} onPress={volverALista}>
                  <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                  <Text style={styles.backButtonText}>Volver</Text>
                </TouchableOpacity>
              </View>

              {/* Información de la minuta seleccionada */}
              <Text style={styles.title}>Minuta #{minutaSeleccionada.id}</Text>
              <Text style={styles.subtitle}>
                Operador: {minutaSeleccionada.operador}
              </Text>
              <Text style={styles.subtitleDate}>
                {formatearFecha(minutaSeleccionada.fecha)}
              </Text>

              {/*Lista de productos para confirmar */}
              <View style={styles.productosContainer}>
                <Text style={styles.sectionTitle}>
                  Productos ({minutaSeleccionada.puertas.length})
                </Text>
                
                {/* Iterar sobre cada producto de la minuta */}
                {minutaSeleccionada.puertas.map((puerta, index) => {
                  // Determinar si este producto ya está confirmado
                  const isConfirmado = minutaSeleccionada.confirmaciones[puerta.id] || false;
                  
                  return (
                    <TouchableOpacity
                      key={puerta.id}
                      style={[
                        styles.productoCard,
                        isConfirmado && styles.productoConfirmado // Estilo visual si está confirmado
                      ]}
                      onPress={() => toggleConfirmacionProducto(puerta.id)}
                    >
                      {/* Header del producto: número y checkbox */}
                      <View style={styles.productoHeader}>
                        <Text style={styles.productoNumero}>
                          Producto #{index + 1}
                        </Text>
                        {/* Checkbox visual que muestra el estado de confirmación */}
                        <View style={[
                          styles.checkbox,
                          isConfirmado && styles.checkboxActivo
                        ]}>
                          {isConfirmado && (
                            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                          )}
                        </View>
                      </View>
                      
                      {/* Información detallada del producto */}
                      <View style={styles.productoInfo}>
                        {/* Medidas principales */}
                        <Text style={styles.productoMedidas}>
                          {puerta.medidas.alto} x {puerta.medidas.ancho} x {puerta.medidas.espesor} cm
                        </Text>
                        {/* Especificaciones técnicas */}
                        <Text style={styles.productoDetalle}>
                          Material: {puerta.material_exterior}
                        </Text>
                        <Text style={styles.productoDetalle}>
                          Relleno: {puerta.relleno_interior}
                        </Text>
                        {/* Observaciones adicionales si existen */}
                        {puerta.observaciones && (
                          <Text style={styles.productoObservaciones}>
                            Obs: {puerta.observaciones}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Resumen y estadisticas de confirmación */}
              <View style={styles.resumenContainer}>
                <Text style={styles.resumenTitle}>Resumen</Text>
                {/* Total de productos */}
                <View style={styles.resumenRow}>
                  <Text style={styles.resumenLabel}>Total productos:</Text>
                  <Text style={styles.resumenValue}>{minutaSeleccionada.puertas.length}</Text>
                </View>
                {/* Productos confirmados con código de color */}
                <View style={styles.resumenRow}>
                  <Text style={styles.resumenLabel}>Confirmados:</Text>
                  <Text style={[
                    styles.resumenValue,
                    // Color verde si todos están confirmados, rojo si faltan
                    Object.values(minutaSeleccionada.confirmaciones).filter(Boolean).length === minutaSeleccionada.puertas.length
                      ? styles.resumenCompleto : styles.resumenPendiente
                  ]}>
                    {Object.values(minutaSeleccionada.confirmaciones).filter(Boolean).length}
                  </Text>
                </View>
              </View>

              {/* Botón de aprobación final */}
              <TouchableOpacity 
                style={styles.aprobarButton}
                onPress={aprobarMinuta}
              >
                <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                <Text style={styles.aprobarButtonText}>Aprobar Minuta</Text>
              </TouchableOpacity>
            </>
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerBar: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    padding: 15,
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 150,
    height: 100,
    marginRight: 10,
    resizeMode: 'contain',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: '#A1A1AA',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitleDate: {
    color: '#A1A1AA',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  
  // Lista de minutas
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    color: '#A1A1AA',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    color: '#A1A1AA',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  minutasContainer: {
    paddingVertical: 10,
  },
  minutaCard: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  minutaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  minutaId: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  estadoBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  estadoConfirmado: {
    backgroundColor: '#34C759',
  },
  estadoText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  minutaInfo: {
    marginBottom: 8,
  },
  minutaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  minutaText: {
    color: '#A1A1AA',
    fontSize: 14,
    marginLeft: 8,
  },
  minutaActions: {
    alignItems: 'flex-end',
  },

  // Detalle de minuta
  detalleHeader: {
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  productosContainer: {
    marginVertical: 20,
  },
  productoCard: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#333333',
  },
  productoConfirmado: {
    borderColor: '#34C759',
    backgroundColor: '#1A2F1A',
  },
  productoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productoNumero: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#DC2626',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActivo: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  productoInfo: {
    marginTop: 8,
  },
  productoMedidas: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productoDetalle: {
    color: '#A1A1AA',
    fontSize: 14,
    marginBottom: 2,
  },
  productoObservaciones: {
    color: '#A1A1AA',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
  },

  // Resumen y aprobación
  resumenContainer: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
  },
  resumenTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  resumenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resumenLabel: {
    color: '#A1A1AA',
    fontSize: 16,
  },
  resumenValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resumenCompleto: {
    color: '#34C759',
  },
  resumenPendiente: {
    color: '#DC2626',
  },
  aprobarButton: {
    backgroundColor: '#34C759',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  aprobarButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  
  // Estilos para pantalla de sin permisos (mantenemos los originales)
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  comingSoon: {
    color: '#DC2626',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noPermissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noPermissionTitle: {
    color: '#DC2626',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  noPermissionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 24,
  },
  noPermissionSubtext: {
    color: '#A1A1AA',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
