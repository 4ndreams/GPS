import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import styles from '../../styles/crear-minutaStyles'; 
import { Picker } from '@react-native-picker/picker';

export default function CrearMinutaScreen() {
  const router = useRouter();
  const [codigo, setCodigo] = useState('');
  const [cliente, setCliente] = useState('');
  const [foto, setFoto] = useState<string | null>(null);

  // Tomar foto
  const tomarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) setFoto(result.assets[0].uri);
  };

  // Guardar minuta (simulado)
  const guardarMinuta = () => {
    if (!codigo || !cliente) {
      Alert.alert('Error', 'Código y cliente son obligatorios');
      return;
    }

    const nuevaMinuta = {
      codigo,
      cliente,
      foto: foto || 'Sin foto',
      fecha: new Date().toLocaleString(),
    };

    Alert.alert(
      'Minuta creada',
      `✅ Código: ${nuevaMinuta.codigo}\n📸 Foto: ${nuevaMinuta.foto ? 'Sí' : 'No'}`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Image
          source={require('../../assets/logo.png')}
          style={[styles.logo, {marginTop: 15}]}
          resizeMode="contain"
        />    
      </View >      
      <Text style={styles.title}>Nueva Minuta</Text>

      <TextInput
        placeholder="Cantidad *"
        value={codigo}
        onChangeText={setCodigo}
        style={styles.input}
        placeholderTextColor="#999"
      />

      <Picker
        style={styles.input}>
        <Picker.Item label="Seleccione origen" value="" />
        <Picker.Item label="Fábrica" value="fabrica" />
        <Picker.Item label="Tienda" value="tienda" />
      </Picker>

      <Picker
        style={styles.input}>
        <Picker.Item label="Seleccione destino" value="" />
        <Picker.Item label="Fábrica" value="tienda1" />
        <Picker.Item label="Tienda" value="tienda2" />
      </Picker>

      <TextInput
        placeholder="Cliente *"
        value={cliente}
        onChangeText={setCliente}
        style={styles.input}
        placeholderTextColor="#999"
      />

      <TouchableOpacity onPress={tomarFoto} style={styles.fotoButton}>
        <Ionicons name="camera" size={24} color="#DC2626" />
        <Text style={styles.fotoButtonText}>
          {foto ? 'Foto lista' : 'Tomar foto'}
        </Text>
      </TouchableOpacity>

      {foto && (
        <Image source={{ uri: foto }} style={styles.fotoPreview} />
      )}

      <TouchableOpacity onPress={guardarMinuta} style={styles.botonGuardar}>
        <Text style={styles.botonTexto}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}