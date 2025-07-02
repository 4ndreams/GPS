import { View, Text, Image, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import styles from '../../styles/perfilStyles'; 

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

