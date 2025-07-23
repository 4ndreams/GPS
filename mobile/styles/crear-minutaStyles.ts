import { StyleSheet } from 'react-native';

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

export default styles;