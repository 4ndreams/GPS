import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Estilos originales mantenidos para compatibilidad
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContainer: {
    flex: 1,
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
  // Estilos móviles optimizados para la tabla
  mobileTable: {
    width: '100%',
    borderWidth: 1,
    backgroundColor: '#DC2626',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    maxHeight: 400, // Limitar altura para móviles
  },
  mobileRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mobileHeaderRow: {
    backgroundColor: '#DC2626',
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
  },
  mobileEvenRow: {
    backgroundColor: '#1F1F1F',
  },
  mobileOddRow: {
    backgroundColor: '#2A2A2A',
  },
  mobileHeaderCell: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  mobileCellContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mobileCellIcon: {
    marginRight: 8,
  },
  mobileCellText: {
    color: '#FFFFFF',
    fontSize: 13,
    flex: 1,
  },
  mobileCellValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    minWidth: 40,
  },
  mobileValueCell: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  // Estilos originales de tabla (mantenidos para compatibilidad)
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
  // Nuevos estilos para home consistente con dashboard-ventas
  homeContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  homeHeader: {
    backgroundColor: '#DC2626',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#B91C1C',
  },
  homeLogo: {
    width: 120,
    height: 60,
    alignSelf: 'center',
    marginBottom: 16,
  },
  homeHeaderContent: {
    alignItems: 'center',
  },
  homeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  homeSubtitle: {
    fontSize: 14,
    color: '#FECACA',
    textAlign: 'center',
  },
  homeScrollContainer: {
    flex: 1,
  },
  homeContentContainer: {
    padding: 20,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  actionsContainer: {
    marginBottom: 24,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 12,
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default styles;