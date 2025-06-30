import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

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
        placeholder="Código *"
        value={codigo}
        onChangeText={setCodigo}
        style={styles.input}
        placeholderTextColor="#999"
      />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',

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
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1F1F1F',
    color: '#FFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  fotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1F1F1F',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  fotoButtonText: {
    color: '#DC2626',
    fontSize: 16,
  },
  fotoPreview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 20,
  },
  botonGuardar: {
    backgroundColor: '#DC2626',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});