import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUsuario } from '../../contexts/UsuarioContext';

export default function RevisarMinuta() {
  const { usuario } = useUsuario();

  // Verificación de permisos
  if (usuario.perfil !== 'tienda') {
    return (
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <Image
            source={require('../../assets/logo.png')}
            style={[styles.logo, {marginTop: 15}]}
            resizeMode="contain"
          />
        </View>
        
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
      {/* Barra superior con logo */}
      <View style={styles.headerBar}>
        <Image
          source={require('../../assets/logo.png')}
          style={[styles.logo, {marginTop: 15}]}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Revisar Minutas</Text>
        <Text style={styles.subtitle}>
          Pantalla para vendedora - {usuario.nombre}
        </Text>
        <Text style={styles.description}>
          Aquí podrás revisar las minutas enviadas por fábrica y confirmar cada producto.
        </Text>
        <Text style={styles.comingSoon}>
          🚧 Próximamente disponible 🚧
        </Text>
      </View>
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
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
  
  // Estilos para pantalla de sin permisos
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
