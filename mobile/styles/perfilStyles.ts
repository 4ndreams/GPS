import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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
  header: {
    marginBottom: 30,
    alignItems: 'center',
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
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#A1A1AA',
    fontSize: 16,
  },
  texto: {
    color: '#A1A1AA',
    fontSize: 14,
    marginBottom: 10,
  },
  section: {
    flexDirection: 'row',
    backgroundColor: '#1F1F1F',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionText: {
    color: '#A1A1AA',
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#6B7280',
    fontSize: 12,
  },
  Textinput: {
    backgroundColor: '#1F1F1F',
    color: '#FFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  botonIniciar: {
    backgroundColor: '#DC2626',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
    botonTexto: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
    borderRadius: 8,
  },
  
  // Estilos para selector de perfiles
  perfilButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
    gap: 15,
  },
  perfilButton: {
    flex: 1,
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DC2626',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  perfilButtonActive: {
    backgroundColor: '#DC2626',
    borderColor: '#FFFFFF',
  },
  perfilButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  perfilButtonTextActive: {
    color: '#FFFFFF',
  },
  limpiarPerfilButton: {
    backgroundColor: '#444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  limpiarPerfilText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  separador: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  separadorText: {
    color: '#A1A1AA',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    position: 'relative',
  },

});

