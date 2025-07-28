import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#DC2626',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#B91C1C',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#FECACA',
    fontSize: 14,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    color: '#374151',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionText: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '500',
  },
  footerSubtext: {
    color: '#9CA3AF',
    fontSize: 10,
    marginTop: 4,
  },
});

export default styles;