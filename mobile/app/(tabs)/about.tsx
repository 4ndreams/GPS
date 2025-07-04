import { View, Text, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/aboutStyles'; 

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerBar}>
        <Image
          source={require('../../assets/logo.png')}
          style={[styles.logo, {marginTop: 15}]}
          resizeMode="contain"
        />    
      </View >       
      <View style={styles.header}>
        <Text style={styles.title}>Cómo usar tu perfil</Text>
        <Text style={styles.subtitle}>Guía rápida de la aplicación</Text>
      </View>

      <View style={styles.section}>
        <Ionicons name="person-circle-outline" size={32} color="#DC2626" style={styles.icon} />
        <View>
          <Text style={styles.sectionTitle}>Perfil de Usuario</Text>
          <Text style={styles.sectionText}>
            - Verifica tus datos personales
            - Cambia tu contraseña regularmente
            - Selecciona tu rol (Fábrica/Tienda)
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Ionicons name="document-text-outline" size={32} color="#DC2626" style={styles.icon} />
        <View>
          <Text style={styles.sectionTitle}>Crear Minutas</Text>
          <Text style={styles.sectionText}>
            1. Ingresa los datos del despacho
            2. Adjunta fotos de referencia
            3. Confirma la información
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Ionicons name="checkmark-done-outline" size={32} color="#DC2626" style={styles.icon} />
        <View>
          <Text style={styles.sectionTitle}>Confirmar Despachos</Text>
          <Text style={styles.sectionText}>
            - Revisa los despachos pendientes
            - Verifica que coincidan con lo recibido
            - Marca como confirmado
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Versión 1.0.0</Text>
      </View>
    </ScrollView>
  );
}