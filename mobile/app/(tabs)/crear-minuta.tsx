import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; 

interface PuertaCatalogo {
  id: string;
  nombre: string;
  categoria: 'enchapadas' | 'terciadas';
  subcategoria?: 'wengue' | 'mara'; // Para filtrar enchapadas por color
  imagen: any; // require() devuelve any
  medidas_standard: {
    alto: number;
    ancho: number;
    espesor: number;
  };
  material_exterior: string;
  relleno_interior: string;
}

interface Puerta {
  id: string;
  //codigoProducto: string;
  medidas: {
    alto: number;
    ancho: number;
    espesor: number;
  };
  material_exterior: string;
  relleno_interior: string;
  observaciones: string;
}

export default function CrearMinuta() {

  const [vistaActual, setVistaActual] = useState<'catalogo' | 'personalizado'>('catalogo');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<'enchapadas' | 'terciadas'>('enchapadas');
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState<'todas' | 'wengue' | 'mara'>('todas');

  // Estado principal: lista de puertas agregadas
  const [puertas, setPuertas] = useState<Puerta[]>([]);

  // Estados para foto y finalización
  const [foto, setFoto] = useState<string | null>(null);

  // Estado del formulario actual
  const [puertaActual, setPuertaActual] = useState<Puerta>({
    id: '',
    //codigoProducto: '',
    medidas: { alto: 0, ancho: 0, espesor: 0 },
    material_exterior: 'Seleccionar...',
    relleno_interior: 'Seleccionar...',
    observaciones: ''
  });
  // Estados de control de UI
  const [modoFormulario, setModoFormulario] = useState<'agregar' | 'editar'>('agregar');
  const [errores, setErrores] = useState<string[]>([]);

  //Opciones de materiales
  const material_exterior = [
    'Seleccionar...',
    'Terciado',
    'MDF',
    'MDF Enchapado'
  ];
  const relleno_interior = [
    'Seleccionar...',
    'Nido de Abeja',
    'Relleno de Madera',
    'Relleno de Poliestireno'
  ];

  //Validación de campos
  const validarCampos = (puerta: Puerta): string[] => {
    const errores: string[] = [];
   // if (!puerta.codigoProducto) errores.push('El código del producto es obligatorio');
    if (puerta.medidas.alto <= 0) errores.push('La altura debe ser mayor a 0');
    if (puerta.medidas.ancho <= 0) errores.push('El ancho debe ser mayor a 0');
    if (puerta.medidas.espesor <= 0) errores.push('El espesor debe ser mayor a 0');
    if (puerta.material_exterior === 'Seleccionar...') errores.push('Debe seleccionar un material exterior');
    if (puerta.relleno_interior === 'Seleccionar...') errores.push('Debe seleccionar un relleno interior');
    return errores;
  }

  //Funcion para limpiar el formulario
  const limpiarFormulario = (): void => {
    setPuertaActual({
      id: '',
      //codigoProducto: '',
      medidas: { alto: 0, ancho: 0, espesor: 0 },
      material_exterior: 'Seleccionar...',
      relleno_interior: 'Seleccionar...',
      observaciones: ''
    });
    setModoFormulario('agregar');
  };

  // Agregar puerta
  const agregarPuerta = (): void => {
    // Validar campos antes de agregar
    const erroresValidacion = validarCampos(puertaActual);
    if (erroresValidacion.length > 0) {
      setErrores(erroresValidacion);
      return; //No continuar si hay errores
    }
    // Si no hay errores, agregar la puerta con un ID único
    const nuevaPuerta: Puerta = {
      ...puertaActual,
      id: Date.now().toString() // Generar ID único, basado en timestamp   
    };
    //Agregar puerta a la lista
    setPuertas(prevPuertas => [...prevPuertas, nuevaPuerta]);
    // Limpiar formulario
    limpiarFormulario();
    //Limpiar errores
    setErrores([]);
    // Mostrar mensaje de éxito
    Alert.alert('Éxito', 'Puerta agregada correctamente');
  }

  // Iniciar edición de una puerta existente
  const iniciarEdicion = (puerta: Puerta): void => {
    setPuertaActual(puerta); // Pre-llena el formulario
    setModoFormulario('editar');
    setErrores([]); // Limpia errores previos
  };

  // Guardar cambios de edición
  const guardarEdicion = (): void => {
    // 1. Validar
    const erroresValidacion = validarCampos(puertaActual);
    
    if (erroresValidacion.length > 0) {
      setErrores(erroresValidacion);
      return;
    }
    
    // 2. Actualizar en la lista
    setPuertas(prevPuertas => 
      prevPuertas.map(puerta => 
        puerta.id === puertaActual.id ? puertaActual : puerta
      )
    );
    
    // 3. Volver a modo agregar
    limpiarFormulario();
    setErrores([]);
  };

  // Eliminar puerta con confirmación
  const eliminarPuerta = (id: string): void => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar esta puerta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setPuertas(prevPuertas => 
              prevPuertas.filter(puerta => puerta.id !== id)
            );
          }
        }
      ]
    );
  };

  // Catálogo de puertas predefinidas
  const catalogoPuertas: PuertaCatalogo[] = [
    // Puertas Enchapadas
    {
      id: 'geno-wengue',
      nombre: 'Geno Enchape Wengue',
      categoria: 'enchapadas',
      subcategoria: 'wengue',
      imagen: require('../../images/PuertaGenoEnchapeWengue.jpeg'),
      medidas_standard: { alto: 200, ancho: 80, espesor: 4 },
      material_exterior: 'MDF Enchapado',
      relleno_interior: 'Nido de Abeja'
    },
    {
      id: 'doble-castell-mara',
      nombre: 'Doble Castell Enchape Mara',
      categoria: 'enchapadas',
      subcategoria: 'mara',
      imagen: require('../../images/PuertaDobleCastellEnchapeMara.jpeg'),
      medidas_standard: { alto: 200, ancho: 160, espesor: 4 },
      material_exterior: 'MDF Enchapado',
      relleno_interior: 'Nido de Abeja'
    },
    {
      id: 'alcala-wengue',
      nombre: 'Alcala Enchape Wengue',
      categoria: 'enchapadas',
      subcategoria: 'wengue',
      imagen: require('../../images/PuertaAlcalaEnchapeWengue.jpeg'),
      medidas_standard: { alto: 200, ancho: 80, espesor: 4 },
      material_exterior: 'MDF Enchapado',
      relleno_interior: 'Nido de Abeja'
    },
    {
      id: '3-palos-ranurada-wengue',
      nombre: '3 Palos Ranurada Enchape Wengue',
      categoria: 'enchapadas',
      subcategoria: 'wengue',
      imagen: require('../../images/Puerta3PalosRanuradaEnchapeWengue.jpeg'),
      medidas_standard: { alto: 200, ancho: 80, espesor: 4 },
      material_exterior: 'MDF Enchapado',
      relleno_interior: 'Nido de Abeja'
    },
    {
      id: 'milano-vidrio-wengue',
      nombre: 'Milano Vidrio Centrado Enchape Wengue',
      categoria: 'enchapadas',
      subcategoria: 'wengue',
      imagen: require('../../images/PuertaMilanoVidrioCentradoEnchapeWengue.jpeg'),
      medidas_standard: { alto: 200, ancho: 80, espesor: 4 },
      material_exterior: 'MDF Enchapado',
      relleno_interior: 'Nido de Abeja'
    },
    {
      id: 'milano-vidrio-mara',
      nombre: 'Milano Vidrio Centrado Enchape Mara',
      categoria: 'enchapadas',
      subcategoria: 'mara',
      imagen: require('../../images/PuertaMilanoVidrioCentradoEnchapeMara.jpeg'),
      medidas_standard: { alto: 200, ancho: 80, espesor: 4 },
      material_exterior: 'MDF Enchapado',
      relleno_interior: 'Nido de Abeja'
    },
    {
      id: 'milano-roma-mara',
      nombre: 'Milano Roma Enchape Mara',
      categoria: 'enchapadas',
      subcategoria: 'mara',
      imagen: require('../../images/PuertaMilanoRomaEnchapeMara.jpeg'),
      medidas_standard: { alto: 200, ancho: 80, espesor: 4 },
      material_exterior: 'MDF Enchapado',
      relleno_interior: 'Nido de Abeja'
    },
    {
      id: 'alcala-cinco-vidrios-mara',
      nombre: 'Juego Alcala Cinco Vidrios Enchape Mara',
      categoria: 'enchapadas',
      subcategoria: 'mara',
      imagen: require('../../images/JuegoDePuertasAlcalaCincoVidriosEnchapeMara.jpeg'),
      medidas_standard: { alto: 200, ancho: 160, espesor: 4 },
      material_exterior: 'MDF Enchapado',
      relleno_interior: 'Nido de Abeja'
    },
    {
      id: 'lisa-mirilla-mara',
      nombre: 'Lisa Con Mirilla Enchape Mara',
      categoria: 'enchapadas',
      subcategoria: 'mara',
      imagen: require('../../images/PuertaEnchapadaModeloRoma.jpeg'), // Imagen similar disponible
      medidas_standard: { alto: 200, ancho: 80, espesor: 4 },
      material_exterior: 'MDF Enchapado',
      relleno_interior: 'Nido de Abeja'
    },
    {
      id: '3-palos-lisa-wengue',
      nombre: '3 Palos Lisa Enchape Wengue',
      categoria: 'enchapadas',
      subcategoria: 'wengue',
      imagen: require('../../images/Puerta3PalosLisaEnchapeWengue.jpeg'),
      medidas_standard: { alto: 200, ancho: 80, espesor: 4 },
      material_exterior: 'MDF Enchapado',
      relleno_interior: 'Nido de Abeja'
    },
    {
      id: 'tres-palos-lisa-vidrio-mara',
      nombre: 'Tres Palos Lisa Vidrio Centrado Enchape Mara',
      categoria: 'enchapadas',
      subcategoria: 'mara',
      imagen: require('../../images/Puerta3PalosLisaVidrioCentradoEnchapeMara.jpeg'),
      medidas_standard: { alto: 200, ancho: 80, espesor: 4 },
      material_exterior: 'MDF Enchapado',
      relleno_interior: 'Nido de Abeja'
    },
    {
      id: '3-palos-ranurada-mara',
      nombre: '3 Palos Ranurada Enchape Mara',
      categoria: 'enchapadas',
      subcategoria: 'mara',
      imagen: require('../../images/Puerta3PalosRanuradaEnchapeMara.jpeg'),
      medidas_standard: { alto: 200, ancho: 80, espesor: 4 },
      material_exterior: 'MDF Enchapado',
      relleno_interior: 'Nido de Abeja'
    },
    {
      id: '3-palos-alcala-mara',
      nombre: '3 Palos Alcala Enchape Mara',
      categoria: 'enchapadas',
      subcategoria: 'mara',
      imagen: require('../../images/Puerta3PalosAlcalaEnchapeMara.jpeg'),
      medidas_standard: { alto: 200, ancho: 80, espesor: 4 },
      material_exterior: 'MDF Enchapado',
      relleno_interior: 'Nido de Abeja'
    },
    {
      id: 'tres-palos-cinco-vidrios',
      nombre: 'Tres Palos Cinco Vidrios',
      categoria: 'enchapadas',
      subcategoria: 'wengue',
      imagen: require('../../images/3Palos5Vidrios.jpeg'),
      medidas_standard: { alto: 200, ancho: 80, espesor: 4 },
      material_exterior: 'MDF Enchapado',
      relleno_interior: 'Nido de Abeja'
    },
    {
      id: 'closet-mara',
      nombre: 'Closet Enchape Mara',
      categoria: 'enchapadas',
      subcategoria: 'mara',
      imagen: require('../../images/PuertasClosetEnchapeMara.jpeg'),
      medidas_standard: { alto: 200, ancho: 60, espesor: 4 },
      material_exterior: 'MDF Enchapado',
      relleno_interior: 'Nido de Abeja'
    },
    {
      id: '3-palos-lisa-mara',
      nombre: '3 Palos Lisa Enchape Mara',
      categoria: 'enchapadas',
      subcategoria: 'mara',
      imagen: require('../../images/Puertas3PalosLisaEnchapeMara.jpeg'),
      medidas_standard: { alto: 200, ancho: 80, espesor: 4 },
      material_exterior: 'MDF Enchapado',
      relleno_interior: 'Nido de Abeja'
    },
    {
      id: 'vero',
      nombre: 'Enchapada Modelo Vero',
      categoria: 'enchapadas',
      subcategoria: 'wengue',
      imagen: require('../../images/PuertaEnchapadaModeloVero.jpeg'),
      medidas_standard: { alto: 200, ancho: 80, espesor: 4 },
      material_exterior: 'MDF Enchapado',
      relleno_interior: 'Nido de Abeja'
    },
    {
      id: 'roma',
      nombre: 'Enchapada Modelo Roma',
      categoria: 'enchapadas',
      subcategoria: 'mara',
      imagen: require('../../images/PuertaEnchapadaModeloRoma.jpeg'),
      medidas_standard: { alto: 200, ancho: 80, espesor: 4 },
      material_exterior: 'MDF Enchapado',
      relleno_interior: 'Nido de Abeja'
    },
    {
      id: 'medio-cuerpo',
      nombre: 'Enchapada Medio Cuerpo',
      categoria: 'enchapadas',
      subcategoria: 'wengue',
      imagen: require('../../images/PuertaEnchapadaMedioCuerpo.jpeg'),
      medidas_standard: { alto: 200, ancho: 80, espesor: 4 },
      material_exterior: 'MDF Enchapado',
      relleno_interior: 'Nido de Abeja'
    },
    {
      id: 'mara-castella',
      nombre: 'Enchapada Mara Castella',
      categoria: 'enchapadas',
      subcategoria: 'mara',
      imagen: require('../../images/PuertaEnchapadaMaraCastella.jpeg'),
      medidas_standard: { alto: 200, ancho: 80, espesor: 4 },
      material_exterior: 'MDF Enchapado',
      relleno_interior: 'Nido de Abeja'
    },
    {
      id: 'cedro-lisa',
      nombre: 'Enchapada Cedro Lisa',
      categoria: 'enchapadas',
      subcategoria: 'wengue',
      imagen: require('../../images/PuertaEnchapadaCedroLisa.jpeg'),
      medidas_standard: { alto: 200, ancho: 80, espesor: 4 },
      material_exterior: 'MDF Enchapado',
      relleno_interior: 'Nido de Abeja'
    },
    // Puertas Terciadas
    {
      id: 'terciado-lisa',
      nombre: 'Terciado Corriente Lisa',
      categoria: 'terciadas',
      imagen: require('../../images/PuertaTerciadoCorrienteLisa.jpeg'),
      medidas_standard: { alto: 200, ancho: 80, espesor: 3 },
      material_exterior: 'Terciado',
      relleno_interior: 'Relleno de Madera'
    },
    {
      id: 'terciado-medio-cuerpo',
      nombre: 'Terciado Corriente 1/2 Cuerpo',
      categoria: 'terciadas',
      imagen: require('../../images/PuertaTerciadoCorrienteMedioCuerpo.jpeg'),
      medidas_standard: { alto: 200, ancho: 80, espesor: 3 },
      material_exterior: 'Terciado',
      relleno_interior: 'Relleno de Madera'
    },
    {
      id: 'terciado-mirilla-colegio',
      nombre: 'Terciado Corriente Con Mirilla De Colegio',
      categoria: 'terciadas',
      imagen: require('../../images/PuertaTerciadoCorrienteConMirillaDeColegio.jpeg'),
      medidas_standard: { alto: 200, ancho: 80, espesor: 3 },
      material_exterior: 'Terciado',
      relleno_interior: 'Relleno de Madera'
    },
    {
      id: 'terciado-6-luces',
      nombre: 'Terciado Corriente 6 Luces',
      categoria: 'terciadas',
      imagen: require('../../images/PuertaTerciadoCorriente6Luces.jpeg'),
      medidas_standard: { alto: 200, ancho: 80, espesor: 3 },
      material_exterior: 'Terciado',
      relleno_interior: 'Relleno de Madera'
    }
  ];

  // Filtrar puertas según categoría y subcategoría seleccionada
  const puertasFiltradas = catalogoPuertas.filter(puerta => {
    if (puerta.categoria !== categoriaSeleccionada) return false;
    
    // Si es categoría enchapadas y hay un filtro de subcategoría específico
    if (categoriaSeleccionada === 'enchapadas' && subcategoriaSeleccionada !== 'todas') {
      return puerta.subcategoria === subcategoriaSeleccionada;
    }
    
    return true;
  });

  // Función para agregar puerta desde catálogo
  const agregarPuertaCatalogo = (puertaCatalogo: PuertaCatalogo): void => {
    // Pre-llenar formulario con datos del catálogo
    setPuertaActual({
      id: '',
      medidas: puertaCatalogo.medidas_standard,
      material_exterior: puertaCatalogo.material_exterior,
      relleno_interior: puertaCatalogo.relleno_interior,
      observaciones: puertaCatalogo.nombre
    });
    // Cambiar a vista personalizado para editar medidas
    setVistaActual('personalizado');
    setModoFormulario('agregar');
    setErrores([]);
  };

  // Función para ir a pedido personalizado
  const irAPedidoPersonalizado = (): void => {
    limpiarFormulario();
    setVistaActual('personalizado');
  };

  // Función para volver al catálogo
  const volverAlCatalogo = (): void => {
    setVistaActual('catalogo');
    limpiarFormulario();
  };

  // Funciones para manejo de foto
  const tomarFoto = async (): Promise<void> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Se necesita permiso para acceder a la cámara');
      return;
    }

    Alert.alert(
      'Seleccionar Imagen',
      'Elige una opción',
      [
        { text: 'Cámara', onPress: abrirCamara },
        { text: 'Galería', onPress: abrirGaleria },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const abrirCamara = async (): Promise<void> => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const abrirGaleria = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  // Validación y envío de minuta
  const validarMinutaCompleta = (): boolean => {
    if (puertas.length === 0) {
      Alert.alert('Error', 'Debe agregar al menos una puerta');
      return false;
    }
    
    if (!foto) {
      Alert.alert('Error', 'Debe agregar una foto');
      return false;
    }
    
    return true;
  };

  const subirMinuta = async (): Promise<void> => {
    if (!validarMinutaCompleta()) return;
    
    // Preparar datos de la minuta
    const minutaData = {
      puertas,
      foto,
      fecha: new Date().toISOString(),
      totalPuertas: puertas.length
    };
    
    try {
      // Aquí iría la lógica de envío al servidor
      console.log('Enviando minuta:', minutaData);
      
      Alert.alert(
        'Minuta Enviada',
        `✅ Puertas: ${puertas.length}\n📸 Foto: Incluida\n📅 Fecha: ${new Date().toLocaleDateString()}`,
        [
          { 
            text: 'OK', 
            onPress: () => {
              // Limpiar todo y volver al estado inicial
              setPuertas([]);
              setFoto(null);
              setVistaActual('catalogo');
            }
          }
        ]
      );
    } catch (err) {
      console.error('Error al enviar minuta:', err);
      Alert.alert('Error', 'No se pudo enviar la minuta. Intente nuevamente.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Barra superior con logo */}
      <View style={styles.headerBar}>
        <Image
          source={require('../../assets/logo.png')}
          style={[styles.logo, {marginTop: 15}]}
          resizeMode="contain"
        />
      </View>
      
      <ScrollView style={styles.scrollContainer}>
      {vistaActual === 'catalogo' ? (
        // Vista del Catálogo
        <>
          <Text style={styles.title}>Catálogo</Text>
          
          {/* Filtros de categorías */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, categoriaSeleccionada === 'enchapadas' && styles.tabActive]}
              onPress={() => {
                setCategoriaSeleccionada('enchapadas');
                setSubcategoriaSeleccionada('todas'); // Reset subcategoría al cambiar categoría
              }}
            >
              <Text style={[styles.tabText, categoriaSeleccionada === 'enchapadas' && styles.tabTextActive]}>
                 Enchapadas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, categoriaSeleccionada === 'terciadas' && styles.tabActive]}
              onPress={() => setCategoriaSeleccionada('terciadas')}
            >
              <Text style={[styles.tabText, categoriaSeleccionada === 'terciadas' && styles.tabTextActive]}>
                 Terciadas
              </Text>
            </TouchableOpacity>
          </View>

          {/* Filtro de subcategoría para puertas enchapadas */}
          {categoriaSeleccionada === 'enchapadas' && (
            <View style={styles.subTabContainer}>
              <TouchableOpacity
                style={[styles.subTab, subcategoriaSeleccionada === 'todas' && styles.subTabActive]}
                onPress={() => setSubcategoriaSeleccionada('todas')}
              >
                <Text style={[styles.subTabText, subcategoriaSeleccionada === 'todas' && styles.subTabTextActive]}>
                  Todas
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.subTab, subcategoriaSeleccionada === 'wengue' && styles.subTabActive]}
                onPress={() => setSubcategoriaSeleccionada('wengue')}
              >
                <Text style={[styles.subTabText, subcategoriaSeleccionada === 'wengue' && styles.subTabTextActive]}>
                   Wengue
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.subTab, subcategoriaSeleccionada === 'mara' && styles.subTabActive]}
                onPress={() => setSubcategoriaSeleccionada('mara')}
              >
                <Text style={[styles.subTabText, subcategoriaSeleccionada === 'mara' && styles.subTabTextActive]}>
                   Mara
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Grid de puertas */}
          <View style={styles.catalogoContainer}>
            {puertasFiltradas.map((puerta) => (
              <TouchableOpacity
                key={puerta.id}
                style={styles.puertaCatalogoCard}
                onPress={() => agregarPuertaCatalogo(puerta)}
              >
                <View style={styles.imagenContainer}>
                  <Image 
                    source={puerta.imagen}
                    style={styles.puertaCatalogoImagen}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.puertaCatalogoNombre}>{puerta.nombre}</Text>
                <Text style={styles.puertaCatalogoMedidas}>
                  {puerta.medidas_standard.alto} x {puerta.medidas_standard.ancho} x {puerta.medidas_standard.espesor} cm
                </Text>
              </TouchableOpacity>
            ))}
            
            {/* Botón Pedido Personalizado */}
            <TouchableOpacity
              style={styles.pedidoPersonalizadoCard}
              onPress={irAPedidoPersonalizado}
            >
              <Ionicons name="add-circle-outline" size={40} color="#FFFFFF" />
              <Text style={styles.pedidoPersonalizadoText}>Pedido Personalizado</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        // Vista del Formulario Personalizado
        <>
          <View style={styles.headerPersonalizado}>
            <TouchableOpacity style={styles.backButton} onPress={volverAlCatalogo}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              <Text style={styles.backButtonText}>Volver al Catálogo</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>
            {modoFormulario === 'agregar' ? 'Agregar Nueva Puerta' : 'Editar Puerta'}
          </Text>

          {/* Mostrar errores si los hay */}
          {errores.length > 0 && (
            <View style={styles.errorContainer}>
              {errores.map((error, index) => (
                <Text key={index} style={styles.errorText}>• {error}</Text>
              ))}
            </View>
          )}

          {/* Formulario */}
          <View style={styles.formContainer}>
            {/* Medidas */}
            <View style={styles.medidasContainer}>
              <Text style={styles.sectionTitle}>Medidas</Text>
              
              <View style={styles.row}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Alto (cm)</Text>
                  <TextInput
                    style={styles.input}
                    value={puertaActual.medidas.alto === 0 ? '' : puertaActual.medidas.alto.toString()}
                    onChangeText={(text) => 
                      setPuertaActual(prev => ({
                        ...prev,
                        medidas: { ...prev.medidas, alto: parseFloat(text) || 0 }
                      }))
                    }
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Ancho (cm)</Text>
                  <TextInput
                    style={styles.input}
                    value={puertaActual.medidas.ancho === 0 ? '' : puertaActual.medidas.ancho.toString()}
                    onChangeText={(text) => 
                      setPuertaActual(prev => ({
                        ...prev,
                        medidas: { ...prev.medidas, ancho: parseFloat(text) || 0 }
                      }))
                    }
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Espesor (cm)</Text>
                <TextInput
                  style={styles.input}
                  value={puertaActual.medidas.espesor === 0 ? '' : puertaActual.medidas.espesor.toString()}
                  onChangeText={(text) => 
                    setPuertaActual(prev => ({
                      ...prev,
                      medidas: { ...prev.medidas, espesor: parseFloat(text) || 0 }
                    }))
                  }
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
            </View>

            {/* Material Exterior */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Material Exterior</Text>
              <Picker
                selectedValue={puertaActual.material_exterior}
                style={styles.picker}
                onValueChange={(itemValue) =>
                  setPuertaActual(prev => ({ ...prev, material_exterior: itemValue }))
                }
              >
                {material_exterior.map((material, index) => (
                  <Picker.Item key={index} label={material} value={material} />
                ))}
              </Picker>
            </View>

            {/* Relleno Interior */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Relleno Interior</Text>
              <Picker
                selectedValue={puertaActual.relleno_interior}
                style={styles.picker}
                onValueChange={(itemValue) =>
                  setPuertaActual(prev => ({ ...prev, relleno_interior: itemValue }))
                }
              >
                {relleno_interior.map((relleno, index) => (
                  <Picker.Item key={index} label={relleno} value={relleno} />
                ))}
              </Picker>
            </View>

            {/* Observaciones */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Observaciones (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={puertaActual.observaciones}
                onChangeText={(text) =>
                  setPuertaActual(prev => ({ ...prev, observaciones: text }))
                }
                placeholder="Ingrese observaciones adicionales..."
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Botones de acción */}
            <View style={styles.buttonContainer}>
              {modoFormulario === 'agregar' ? (
                <TouchableOpacity style={styles.addButton} onPress={agregarPuerta}>
                  <Ionicons name="add" size={20} color="white" />
                  <Text style={styles.buttonText}>Agregar Puerta</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.editButtonContainer}>
                  <TouchableOpacity style={styles.saveButton} onPress={guardarEdicion}>
                    <Ionicons name="save" size={20} color="white" />
                    <Text style={styles.buttonText}>Guardar Cambios</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={limpiarFormulario}>
                    <Ionicons name="close" size={20} color="white" />
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </>
      )}

      {/* Lista de puertas agregadas - siempre visible */}
      {puertas.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Puertas Agregadas ({puertas.length})</Text>
          
          {puertas.map((puerta) => (
            <View key={puerta.id} style={styles.puertaCard}>
              <View style={styles.puertaInfo}>
                <Text style={styles.puertaTitle}>
                  {puerta.medidas.alto} x {puerta.medidas.ancho} x {puerta.medidas.espesor} cm
                </Text>
                <Text style={styles.puertaDetail}>
                  Material: {puerta.material_exterior}
                </Text>
                <Text style={styles.puertaDetail}>
                  Relleno: {puerta.relleno_interior}
                </Text>
                {puerta.observaciones && (
                  <Text style={styles.puertaObservaciones}>
                    Obs: {puerta.observaciones}
                  </Text>
                )}
              </View>
              
              <View style={styles.puertaActions}>
                <TouchableOpacity 
                  style={styles.editIcon} 
                  onPress={() => {
                    iniciarEdicion(puerta);
                    setVistaActual('personalizado');
                  }}
                >
                  <Ionicons name="pencil" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteIcon} 
                  onPress={() => eliminarPuerta(puerta.id)}
                >
                  <Ionicons name="trash" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Sección de Finalización - Solo cuando hay puertas */}
      {puertas.length > 0 && (
        <View style={styles.finalizacionContainer}>
          <Text style={styles.finalizacionTitle}>Finalizar Minuta</Text>
          
          {/* Botón para tomar foto */}
          <TouchableOpacity onPress={tomarFoto} style={styles.fotoButton}>
            <Ionicons 
              name={foto ? "checkmark-circle" : "camera"} 
              size={24} 
              color={foto ? "#34C759" : "#FFFFFF"} 
            />
            <Text style={[styles.fotoButtonText, foto && styles.fotoButtonTextSuccess]}>
              {foto ? 'Foto Agregada ✓' : 'Agregar Foto *'}
            </Text>
          </TouchableOpacity>

          {/* Preview de la foto */}
          {foto && (
            <View style={styles.fotoPreviewContainer}>
              <Image source={{ uri: foto }} style={styles.fotoPreview} />
              <TouchableOpacity 
                style={styles.cambiarFotoButton} 
                onPress={tomarFoto}
              >
                <Ionicons name="camera" size={16} color="#FFFFFF" />
                <Text style={styles.cambiarFotoText}>Cambiar Foto</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Resumen final */}
          <View style={styles.resumenFinal}>
            <View style={styles.resumenItem}>
              <Ionicons name="list" size={20} color="#FFFFFF" />
              <Text style={styles.resumenText}>
                {puertas.length} puerta{puertas.length !== 1 ? 's' : ''} agregada{puertas.length !== 1 ? 's' : ''}
              </Text>
            </View>
            <View style={styles.resumenItem}>
              <Ionicons name="camera" size={20} color="#FFFFFF" />
              <Text style={styles.resumenText}>
                Foto: {foto ? 'Agregada' : 'Pendiente'}
              </Text>
            </View>
          </View>

          {/* Botón de envío */}
          <TouchableOpacity 
            style={[
              styles.subirMinutaButton,
              !foto && styles.buttonDisabled
            ]}
            disabled={!foto}
            onPress={subirMinuta}
          >
            <Ionicons name="cloud-upload" size={24} color="#FFFFFF" />
            <Text style={styles.subirMinutaText}>Subir Minuta</Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#DC2626',
    borderColor: '#FF3B30',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  formContainer: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  medidasContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#1F1F1F',
    color: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    backgroundColor: '#1F1F1F',
    color: '#FFFFFF',
  },
  buttonContainer: {
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  editButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#34C759',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    flex: 0.48,
  },
  cancelButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    flex: 0.48,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  listContainer: {
    marginBottom: 20,
  },
  puertaCard: {
    backgroundColor: '#1F1F1F',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  puertaInfo: {
    flex: 1,
  },
  puertaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  puertaDetail: {
    fontSize: 14,
    color: '#A1A1AA',
    marginBottom: 2,
  },
  puertaObservaciones: {
    fontSize: 14,
    color: '#A1A1AA',
    fontStyle: 'italic',
  },
  puertaActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editIcon: {
    padding: 8,
    marginRight: 8,
  },
  deleteIcon: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1F1F1F',
    borderRadius: 8,
    marginBottom: 20,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: '#DC2626',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A1A1AA',
  },
  tabTextActive: {
    color: 'white',
  },
  subTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1F1F1F',
    borderRadius: 6,
    marginBottom: 16,
    padding: 3,
  },
  subTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 4,
  },
  subTabActive: {
    backgroundColor: '#DC2626',
  },
  subTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A1A1AA',
  },
  subTabTextActive: {
    color: 'white',
  },
  catalogoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  puertaCatalogoCard: {
    width: '48%',
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  imagenContainer: {
    height: 120,
    backgroundColor: '#333333',
    borderRadius: 8,
    marginBottom: 8,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  puertaCatalogoImagen: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  imagePlaceholder: {
    height: 120,
    backgroundColor: '#333333',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  imagePlaceholderText: {
    fontSize: 12,
    color: '#A1A1AA',
    marginTop: 4,
  },
  puertaCatalogoNombre: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  puertaCatalogoMedidas: {
    fontSize: 12,
    color: '#A1A1AA',
    textAlign: 'center',
  },
  pedidoPersonalizadoCard: {
    width: '48%',
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#DC2626',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 160,
  },
  pedidoPersonalizadoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
  },
  headerPersonalizado: {
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
  puertaCatalogoImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  puertaCatalogoInfo: {
    flex: 1,
  },
  puertaCatalogoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  puertaCatalogoDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  agregarCatalogoButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personalizadoContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // Estilos para la sección de finalización
  finalizacionContainer: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  finalizacionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  fotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F1F1F',
    borderWidth: 2,
    borderColor: '#DC2626',
    borderStyle: 'dashed',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  fotoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  fotoButtonTextSuccess: {
    color: '#34C759',
  },
  fotoPreviewContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  fotoPreview: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  cambiarFotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    padding: 8,
    borderRadius: 6,
  },
  cambiarFotoText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 5,
  },
  resumenFinal: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  resumenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resumenText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 10,
  },
  subirMinutaButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
  },
  subirMinutaText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  buttonDisabled: {
    backgroundColor: '#444',
    opacity: 0.5,
  },
});