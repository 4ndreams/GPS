import { StyleSheet } from 'react-native';

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
  header: {
    marginBottom: 30,
    alignItems: 'center',
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
});

export default styles;