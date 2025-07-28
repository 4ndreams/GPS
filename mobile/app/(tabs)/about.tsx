import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/aboutStyles'; 

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      {/* Header con fondo rojo y letras blancas */}
      <View style={styles.header}>
        <Text style={styles.title}>Acerca de la Aplicación</Text>
        <Text style={styles.subtitle}>Guía rápida de uso</Text>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <View style={styles.iconContainer}>
            <Ionicons name="list-outline" size={24} color="#DC2626" />
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Gestión de Órdenes</Text>
            <Text style={styles.sectionText}>
              Visualiza y gestiona todas las órdenes de despacho. Puedes ver detalles, marcar como completadas o cancelar órdenes según sea necesario.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.iconContainer}>
            <Ionicons name="stats-chart-outline" size={24} color="#DC2626" />
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Dashboard</Text>
            <Text style={styles.sectionText}>
              Monitorea el estado de tus despachos con estadísticas en tiempo real. Visualiza órdenes pendientes, en tránsito y recibidas.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.iconContainer}>
            <Ionicons name="camera-outline" size={24} color="#DC2626" />
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Fotos de Órdenes</Text>
            <Text style={styles.sectionText}>
              Captura y visualiza fotos de las órdenes para mantener un registro visual de los productos despachados.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}