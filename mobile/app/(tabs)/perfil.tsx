import { View, Text, Pressable, TextInput, TouchableOpacity, ScrollView } from 'react-native';
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
      {/* Header con fondo rojo y letras blancas */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil de Usuario</Text>
        <Text style={styles.headerSubtitle}>Gestiona tu información personal</Text>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        {/* Información del usuario actual */}
        {user && (
          <View style={styles.section}>
            <View style={styles.iconContainer}>
              <Ionicons name="person-circle-outline" size={24} color="#DC2626" />
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Usuario Actual</Text>
              <Text style={styles.sectionText}>
                <Text style={{ fontWeight: 'bold' }}>Nombre: </Text>
                {user.nombre || 'Usuario'}
              </Text>
              <Text style={styles.sectionText}>
                <Text style={{ fontWeight: 'bold' }}>Email: </Text>
                {user.email || 'No email'}
              </Text>
            </View>
          </View>
        )}
        
        {/* Sección de Perfil Asignado */}
        <View style={styles.section}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#DC2626" />
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Perfil Asignado</Text>
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
                  <Ionicons name="build-outline" size={24} color="#FFFFFF" />
                  <Text style={[styles.perfilButtonText, styles.perfilButtonTextActive]}>
                    Operaciones de Fábrica
                  </Text>
                </View>
              )}

              {user.rol === 'tienda' && (
                <View style={[styles.perfilButton, styles.perfilButtonActive]}>
                  <Ionicons name="storefront-outline" size={24} color="#FFFFFF" />
                  <Text style={[styles.perfilButtonText, styles.perfilButtonTextActive]}>
                    Operaciones de Tienda
                  </Text>
                </View>
              )}

              {user.rol === 'admin' && (
                <View style={[styles.perfilButton, styles.perfilButtonActive]}>
                  <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
                  <Text style={[styles.perfilButtonText, styles.perfilButtonTextActive]}>
                    Administración
                  </Text>
                </View>
              )}
            </View>

            {/* Información adicional sobre las capacidades del rol */}
            <View style={styles.section}>
              <View style={styles.iconContainer}>
                <Ionicons name="information-circle-outline" size={24} color="#DC2626" />
              </View>
              <View style={styles.sectionContent}>
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
            </View>
          </>
        )}

        {/* Mensaje si no hay rol asignado */}
        {user && !user.rol && (
          <View style={styles.section}>
            <View style={styles.iconContainer}>
              <Ionicons name="alert-circle-outline" size={24} color="#DC2626" />
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Sin Rol Asignado</Text>
              <Text style={styles.sectionText}>
                Contacta con el administrador para que te asigne un rol.
              </Text>
            </View>
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
              style={styles.textInput}
              placeholderTextColor="#999"
            />
            <TextInput 
              placeholder="Contraseña"
              style={styles.textInput}
              placeholderTextColor="#999"
              secureTextEntry={true}
            />
            <Text style={styles.helpText}>
              ¿Tienes problemas para iniciar sesión?
            </Text>

            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Iniciar sesión</Text>
            </TouchableOpacity>
        
            <Text style={styles.helpText}>
              ¿No tienes cuenta? <Text style={{ color: '#DC2626' }}>Regístrate</Text>
            </Text>     

            <Pressable onPress={handleGoogleLogin}>
              <View style={styles.section}>
                <View style={styles.iconContainer}>
                  <Ionicons name="logo-google" size={24} color="#DC2626" />
                </View>
                <View style={styles.sectionContent}>
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
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}   

