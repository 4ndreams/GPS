import { View, Text, Image,StyleSheet, ScrollView, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';

export default function ProfileScreen() {

   
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: '896102954860-hu7i30kdiughklr1835bcc34ehpg47g5.apps.googleusercontent.com',
        webClientId: '896102954860-8h3bvdiv6141jhctsegtf55nmv8lam0b.apps.googleusercontent.com',
        });
        

  return (
    
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Image
          source={require('../../assets/logo.png')}
          style={[styles.logo, {marginTop: 15}]}
          resizeMode="contain"
        />    
      </View >
        <View style={styles.innerContainer}>
        <Text style={[styles.title, {marginTop: -100}]}>Perfil de Usuario</Text>
        <Text style={styles.subtitle}>Gestiona tu información personal</Text>
        <TextInput 
          placeholder="example@gmail.com"
          style={styles.Textinput}
          placeholderTextColor="#999"
          />
        <TextInput 
          placeholder="Contraseña"
          style={styles.Textinput}
          placeholderTextColor="#999"
          secureTextEntry={true}
          />
        <Text style={styles.texto}>
          ¿Tienes problemas para iniciar sesión?
        </Text>

        <TouchableOpacity 
          style={styles.botonIniciar}
          >
            <Text style={styles.botonTexto}>Iniciar sesión</Text>
        </TouchableOpacity>
    
      <Text style={styles.texto}>
        ¿No tienes cuenta? <Text style={{ color: 'blue' }}>Regístrate</Text>
      </Text>     

      <Pressable
        onPress={() => {
          promptAsync().catch((e) => {
            console.error('Error al iniciar sesión: ', e);
        })}}
        >   
      <View style={styles.section}>
        <Ionicons name="person-circle-outline" size={32} color="#DC2626" style={styles.icon} />
        <View>
            
          <Text style={styles.sectionTitle}>Iniciar Sesión</Text>
          <Text style={styles.sectionText}>
            Login con Google
 
            </Text>
            
        </View>
        
      </View>  
      </Pressable>
       </View>
</View>
    );
    }   

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

});