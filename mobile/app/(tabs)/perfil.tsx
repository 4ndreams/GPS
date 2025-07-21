import { View, Text, Image, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import styles from '../../styles/perfilStyles'; 
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Configuración de Google Auth con manejo de errores
  const [, , promptAsync] = Google.useAuthRequest({
    androidClientId: '896102954860-hu7i30kdiughklr1835bcc34ehpg47g5.apps.googleusercontent.com',
    webClientId: '896102954860-8h3bvdiv6141jhctsegtf55nmv8lam0b.apps.googleusercontent.com',
  });

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  };
        

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
        
        {/* Información del usuario actual */}
        {user && (
          <View style={[styles.section, { width: '100%' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Ionicons name="person-circle" size={24} color="#DC2626" style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>Usuario Actual</Text>
            </View>
            <View style={{ marginLeft: 32 }}>
              <Text style={styles.sectionText}>
                <Text style={{ fontWeight: 'bold' }}>Nombre: </Text>
                {user.name || 'Usuario'}
              </Text>
              <Text style={styles.sectionText}>
                <Text style={{ fontWeight: 'bold' }}>Email: </Text>
                {user.email || 'No email'}
              </Text>
            </View>
          </View>
        )}
        
        {/* Sección de Perfil Asignado */}
        <View style={[styles.section, { width: '100%' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Ionicons name="shield-checkmark" size={24} color="#DC2626" style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Perfil Asignado</Text>
          </View>
          <View style={{ marginLeft: 32 }}>
            <Text style={styles.sectionText}>
              {user?.rol ? 
                (user.rol === 'fabrica' ? 'Personal de Fábrica' : 
                 user.rol === 'tienda' ? 'Personal de Tienda' : 
                 user.rol === 'admin' ? 'Administrador' : 'Sin asignar') 
                : 'No hay rol asignado'}
            </Text>
          </View>
        </View>

        {/* Mostrar opciones específicas según el rol del usuario */}
        {user && user.rol && (
          <>
            <View style={styles.perfilButtonsContainer}>
              {user.rol === 'fabrica' && (
                <View style={[styles.perfilButton, styles.perfilButtonActive]}>
                  <Ionicons name="build" size={24} color="#FFFFFF" />
                  <Text style={[styles.perfilButtonText, styles.perfilButtonTextActive]}>
                    Operaciones de Fábrica
                  </Text>
                </View>
              )}

              {user.rol === 'tienda' && (
                <View style={[styles.perfilButton, styles.perfilButtonActive]}>
                  <Ionicons name="storefront" size={24} color="#FFFFFF" />
                  <Text style={[styles.perfilButtonText, styles.perfilButtonTextActive]}>
                    Operaciones de Tienda
                  </Text>
                </View>
              )}

              {user.rol === 'admin' && (
                <View style={[styles.perfilButton, styles.perfilButtonActive]}>
                  <Ionicons name="settings" size={24} color="#FFFFFF" />
                  <Text style={[styles.perfilButtonText, styles.perfilButtonTextActive]}>
                    Administración
                  </Text>
                </View>
              )}
            </View>

            {/* Información adicional sobre las capacidades del rol */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Capacidades del Rol</Text>
              {user.rol === 'fabrica' && (
                <Text style={styles.sectionText}>
                  • Crear y gestionar despachos{'\n'}
                  • Ver lista de productos{'\n'}
                  • Confirmar órdenes de producción
                </Text>
              )}
              {user.rol === 'tienda' && (
                <Text style={styles.sectionText}>
                  • Revisar minutas de entrega{'\n'}
                  • Confirmar recepción de productos{'\n'}
                  • Gestionar inventario de tienda
                </Text>
              )}
              {user.rol === 'admin' && (
                <Text style={styles.sectionText}>
                  • Acceso completo al sistema{'\n'}
                  • Gestión de usuarios{'\n'}
                  • Supervisión de operaciones
                </Text>
              )}
            </View>
          </>
        )}

        {/* Mensaje si no hay rol asignado */}
        {user && !user.rol && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sin Rol Asignado</Text>
            <Text style={styles.sectionText}>
              Contacta con el administrador para que te asigne un rol.
            </Text>
          </View>
        )}

        {/* Separador */}
        <View style={styles.separador}>
          <Text style={styles.separadorText}>Autenticación</Text>
        </View>

        {/* Campos de login - solo mostrar si no está autenticado */}
        {!user && (
          <>
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
          </>
        )}

        {/* Botón de logout - solo mostrar si está autenticado */}
        {user && (
          <TouchableOpacity 
            style={[styles.botonIniciar, { 
              backgroundColor: '#DC2626', 
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.botonTexto}>Cerrar Sesión</Text>
          </TouchableOpacity>
        )}
       </View>
</View>
    );
    }   

