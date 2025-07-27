import  { useEffect, useState } from "react";
import axios from "axios";
import "@styles/userTable.css"; 

interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  rol: string;
}

const UsersTable = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener el token desde localStorage
  const getTokenFromStorage = (): { token: string | null; error: string | null } => {
    // Primero intentar obtener el token desde "token"
    let rawToken = localStorage.getItem("token");
    
    if (!rawToken) {
      // Si no está en "token", buscar en "auth_token_data"
      const authTokenData = localStorage.getItem("auth_token_data");
      if (authTokenData) {
        try {
          const parsedData = JSON.parse(authTokenData);
          rawToken = parsedData.token;
          console.log("Token obtenido desde auth_token_data:", rawToken);
          
          // Verificar si el token ha expirado
          if (parsedData.expiresAt && Date.now() > parsedData.expiresAt) {
            console.warn("El token ha expirado");
            localStorage.removeItem("auth_token_data");
            return { token: null, error: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente." };
          }
        } catch (e) {
          console.error("Error al parsear auth_token_data:", e);
          localStorage.removeItem("auth_token_data");
          return { token: null, error: "Error al obtener token de autenticación. Por favor, inicia sesión nuevamente." };
        }
      }
    }
    
    return { token: rawToken, error: null };
  };

  // Función para limpiar y validar el token
  const cleanAndValidateToken = (rawToken: string): string | null => {
    let token = rawToken.trim();
    
    // Remover 'Bearer ' si existe
    if (token.startsWith('Bearer ')) {
      token = token.substring(7);
    }
    
    // Remover comillas si existen
    if ((token.startsWith('"') && token.endsWith('"')) || 
        (token.startsWith("'") && token.endsWith("'"))) {
      token = token.slice(1, -1);
    }
    
    // Validar formato básico
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    // Verificar que cada parte tenga contenido
    if (parts.some(part => part.length === 0)) {
      return null;
    }
    
    return token;
  };

  // Función para inspeccionar el token
  const inspectToken = (token: string) => {
    console.log("=== INSPECCIÓN DEL TOKEN ===");
    console.log("Token completo:", token);
    console.log("Longitud:", token.length);
    console.log("Primeros 50 caracteres:", token.substring(0, 50));
    console.log("Últimos 50 caracteres:", token.substring(token.length - 50));
    
    // Verificar si tiene caracteres especiales problemáticos
    const hasSpecialChars = /[^\w\-._~]/.test(token.replace(/\./g, ''));
    console.log("Tiene caracteres especiales:", hasSpecialChars);
    
    const parts = token.split('.');
    console.log("Número de partes:", parts.length);
    
    if (parts.length === 3) {
      console.log("Longitud parte 1 (header):", parts[0].length);
      console.log("Longitud parte 2 (payload):", parts[1].length);
      console.log("Longitud parte 3 (signature):", parts[2].length);
      
      // Intentar decodificar el header
      try {
        const header = JSON.parse(atob(parts[0]));
        console.log("Header decodificado:", header);
      } catch (e) {
        console.error("Error al decodificar header:", e);
      }
      
      // Intentar decodificar el payload
      try {
        const payload = JSON.parse(atob(parts[1]));
        console.log("Payload decodificado:", payload);
      } catch (e) {
        console.error("Error al decodificar payload:", e);
      }
    }
    console.log("=== FIN INSPECCIÓN ===");
  };

  useEffect(() => {
    // Mostrar todos los elementos del localStorage para debugging
    console.log("=== LOCALSTORAGE COMPLETO ===");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        console.log(`${key}:`, value);
      }
    }
    console.log("=== FIN LOCALSTORAGE ===");
    
    // Obtener token desde localStorage
    const { token: rawToken, error: storageError } = getTokenFromStorage();
    
    console.log("Token raw obtenido:", rawToken);
    
    if (storageError) {
      setError(storageError);
      setLoading(false);
      return;
    }
    
    if (!rawToken) {
      setError("No se encontró token de autenticación. Por favor, inicia sesión.");
      setLoading(false);
      return;
    }

    // Limpiar y validar el token
    const token = cleanAndValidateToken(rawToken);
    
    if (!token) {
      setError("Token de autenticación inválido. Por favor, inicia sesión nuevamente.");
      localStorage.removeItem("token");
      localStorage.removeItem("auth_token_data");
      setLoading(false);
      return;
    }

    // Inspeccionar el token en detalle
    inspectToken(token);

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUsers(res.data.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error al obtener usuarios:", err);
        console.error("Error response:", err.response);
        
        if (err.response?.status === 401) {
          setError("Token inválido o expirado. Por favor, inicia sesión nuevamente.");
          localStorage.removeItem("token");
          localStorage.removeItem("auth_token_data");
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Error al cargar usuarios. Inténtalo de nuevo más tarde.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando usuarios...</p>;
  
  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#fee', 
        border: '1px solid #fcc', 
        borderRadius: '4px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#c33' }}>Error</h3>
        <p style={{ color: '#c33' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Intentar de nuevo
        </button>
        <button 
          onClick={() => window.location.href = '/login'}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Ir al login
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Usuarios registrados</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.nombre}</td>
              <td>{u.apellidos}</td>
              <td>{u.email}</td>
              <td>{u.rol}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
