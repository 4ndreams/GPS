import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Index() {
  // Datos de ejemplo para el resumen
  const summaryData = [
    { title: 'Total', value: 0 },
    { title: 'Confirmados', value: 0 },
    { title: 'Pendientes', value: 0 },
    { title: 'Cancelados', value: 0 },
  ];

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
      
      {/* Contenido principal */}
      <View style={styles.innerContainer}>
        <Text style={[styles.title, {marginTop: -100}]}>Control de despachos</Text>
        <Text style={[styles.headerSubtitle, {marginTop: -40}]}>
          (Estado de despachos realizados durante el día)
        </Text>

        {/* Tabla estilizada */}
        <View style={[styles.table, {marginTop: -20}]}>
          {/* Encabezados de tabla */}
          <View style={[styles.row, styles.headerRow]}>
            <Text style={styles.headerCell}>Estado</Text>
            <Text style={styles.headerCell}>Cantidad</Text>
          </View>
          
          {/* Filas de datos */}
          {summaryData.map((item, index) => (
            <View 
              key={index} 
              style={[
                styles.row,
                index % 2 === 0 ? styles.evenRow : styles.oddRow
              ]}
            >
              <Text style={styles.cell}>{item.title}</Text>
              <Text style={[styles.cell, styles.valueCell]}>{item.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.reminderContainer}>
          <Ionicons name="warning-outline" size={20} color="#DC2626" />
          <Text style={styles.reminderText}>
            Todas las minutas deben ser confirmadas en tienda para evitar irregularidades
          </Text>
        </View>

        {/* Ver listas de despachos */}
        <TouchableOpacity
          style={styles.despachosButton}
          onPress={() => console.log("Navegar a listas de despachos")}
        >
          <Text style={styles.despachosButtonText}>Ver listas de despachos</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Tus estilos se mantienen exactamente igual
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
  despachosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#DC2626',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    marginHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    width: '100%',
  },
  despachosButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitleBlack: {
    color: '#000000',
    fontSize: 15,
    fontWeight: 'normal',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 30,
    flexWrap: 'wrap',
  },
  summaryItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 15,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  summaryLabel: {
    color: '#A1A1AA',
    fontSize: 14,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    width: '100%',
  },
  reminderText: {
    color: '#FFFFFF',
    marginLeft: 10,
    flex: 1,
  },
  headerSubtitle: {
    color: '#A1A1AA',
    textAlign: 'center',
    marginBottom: 40,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
  },
  primaryButton: {
    backgroundColor: '#DC2626',
  },
  secondaryButton: {
    backgroundColor: '#1F1F1F',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  seccionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  icon: {
    marginRight: 8,
  },
  table: {
    width: '100%',
    borderWidth: 1,
    backgroundColor: '#DC2626',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  headerRow: {
    backgroundColor: '#DC2626',
  },
  evenRow: {
    backgroundColor: '#1F1F1F',
  },
  oddRow: {
    backgroundColor: '#2A2A2A',
  },
  headerCell: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  cell: {
    flex: 1,
    color: '#FFFFFF',
    textAlign: 'center',
    paddingVertical: 8,
  },
  valueCell: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});