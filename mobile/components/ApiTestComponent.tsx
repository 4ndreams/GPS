// Test de API con autenticación
import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import api from '../services/api';
import { TokenService } from '../services/tokenService';

export const ApiTestComponent = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const testApiCall = async () => {
    try {
      setLoading(true);
      console.log('🔍 Verificando token antes de la petición...');
      
      const token = await TokenService.getToken();
      if (!token) {
        Alert.alert('Error', 'No hay token de autenticación. Inicia sesión primero.');
        return;
      }
      
      console.log('✅ Token disponible:', `${token.substring(0, 20)}...`);
      
      // Hacer petición a endpoint que requiere autenticación
      console.log('📤 Haciendo petición a /orden...');
      const result = await api.get('/orden');
      
      console.log('✅ Respuesta exitosa:', result.data);
      setResponse(result.data);
      Alert.alert('Éxito', 'Petición realizada correctamente con token Bearer');
      
    } catch (error: any) {
      console.error('❌ Error en petición:', error);
      
      if (error.response?.status === 401) {
        Alert.alert('Error de Autenticación', 'Token inválido o expirado. Inicia sesión nuevamente.');
      } else {
        Alert.alert('Error', `Error en la petición: ${error.message}`);
      }
      
      setResponse({ error: error.message, status: error.response?.status });
    } finally {
      setLoading(false);
    }
  };

  const checkTokenStatus = async () => {
    try {
      const token = await TokenService.getToken();
      const isValid = await TokenService.isTokenValid();
      
      Alert.alert('Estado del Token', `
Token presente: ${token ? 'Sí' : 'No'}
Token válido: ${isValid ? 'Sí' : 'No'}
Token (primeros 20 chars): ${token ? token.substring(0, 20) + '...' : 'N/A'}
      `);
    } catch (error: any) {
      console.error('Error al verificar token:', error);
      Alert.alert('Error', 'Error al verificar token');
    }
  };

  return (
    <View style={{ padding: 20, backgroundColor: '#f5f5f5', margin: 10, borderRadius: 8 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
        Test de API con Autenticación
      </Text>
      
      <Button 
        title="Verificar Estado del Token" 
        onPress={checkTokenStatus}
        color="#2196F3"
      />
      
      <View style={{ marginVertical: 10 }} />
      
      <Button 
        title={loading ? "Probando..." : "Probar Petición con Token"}
        onPress={testApiCall}
        disabled={loading}
        color="#4CAF50"
      />
      
      {response && (
        <View style={{ marginTop: 15, padding: 10, backgroundColor: '#fff', borderRadius: 5 }}>
          <Text style={{ fontWeight: 'bold' }}>Respuesta:</Text>
          <Text style={{ fontSize: 12, marginTop: 5 }}>
            {JSON.stringify(response, null, 2)}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ApiTestComponent;
