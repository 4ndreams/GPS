// tokenService.ts - Servicio para gestionar tokens con expiración automática

interface TokenData {
  token: string;
  expiresAt: number; // timestamp en milisegundos
  issuedAt: number;  // timestamp cuando se emitió
}

export class TokenService {
  private static readonly TOKEN_KEY = 'auth_token_data';
  private static readonly TOKEN_DURATION = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
  private static readonly REFRESH_THRESHOLD = 2 * 60 * 60 * 1000; // Renovar si quedan menos de 2 horas
  
  private static expirationCheckInterval: ReturnType<typeof setInterval> | null = null;

  /**
   * Guarda el token con información de expiración
   */
  static setToken(token: string): void {
    const now = Date.now();
    const tokenData: TokenData = {
      token,
      issuedAt: now,
      expiresAt: now + this.TOKEN_DURATION
    };

    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokenData));
    this.startExpirationCheck();
  }

  /**
   * Obtiene el token si es válido, null si ha expirado
   */
  static getToken(): string | null {
    try {
      const storedData = localStorage.getItem(this.TOKEN_KEY);
      if (!storedData) {
        return null;
      }

      const tokenData: TokenData = JSON.parse(storedData);
      const now = Date.now();

      // Verificar si el token ha expirado
      if (now >= tokenData.expiresAt) {
        console.log('⚠️ Token expirado, eliminando automáticamente...');
        this.removeToken();
        this.redirectToLogin();
        return null;
      }

      return tokenData.token;
    } catch (error) {
      console.error('Error al obtener token:', error);
      this.removeToken();
      return null;
    }
  }

  /**
   * Verifica si el token existe y es válido
   */
  static isTokenValid(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Verifica si el token necesita ser renovado
   */
  static shouldRefreshToken(): boolean {
    try {
      const storedData = localStorage.getItem(this.TOKEN_KEY);
      if (!storedData) {
        return false;
      }

      const tokenData: TokenData = JSON.parse(storedData);
      const now = Date.now();
      const timeUntilExpiration = tokenData.expiresAt - now;

      return timeUntilExpiration <= this.REFRESH_THRESHOLD && timeUntilExpiration > 0;
    } catch (error) {
      console.error('Error al verificar renovación de token:', error);
      return false;
    }
  }

  /**
   * Obtiene información del token (tiempo restante, etc.)
   */
  static getTokenInfo(): { timeRemaining: number; shouldRefresh: boolean; expiresAt: Date } | null {
    try {
      const storedData = localStorage.getItem(this.TOKEN_KEY);
      if (!storedData) {
        return null;
      }

      const tokenData: TokenData = JSON.parse(storedData);
      const now = Date.now();
      const timeRemaining = tokenData.expiresAt - now;

      return {
        timeRemaining,
        shouldRefresh: this.shouldRefreshToken(),
        expiresAt: new Date(tokenData.expiresAt)
      };
    } catch (error) {
      console.error('Error al obtener información del token:', error);
      return null;
    }
  }

  /**
   * Elimina el token del almacenamiento
   */
  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    // Mantener compatibilidad con el token simple que se usaba antes
    localStorage.removeItem('token');
    this.stopExpirationCheck();
  }

  /**
   * Inicia la verificación periódica de expiración
   */
  private static startExpirationCheck(): void {
    this.stopExpirationCheck(); // Detener verificación previa si existe
    
    this.expirationCheckInterval = setInterval(() => {
      const tokenInfo = this.getTokenInfo();
      
      if (!tokenInfo) {
        this.stopExpirationCheck();
        return;
      }

      // Verificar si el token ha expirado
      if (tokenInfo.timeRemaining <= 0) {
        console.log('⏰ Token expirado, cerrando sesión automáticamente...');
        this.removeToken();
        this.redirectToLogin();
        this.stopExpirationCheck();
        return;
      }

      // Advertir cuando queden 10 minutos
      if (tokenInfo.timeRemaining <= 10 * 60 * 1000 && tokenInfo.timeRemaining > 9 * 60 * 1000) {
        this.showExpirationWarning(Math.floor(tokenInfo.timeRemaining / 60000));
      }
    }, 60000); // Verificar cada minuto
  }

  /**
   * Detiene la verificación periódica de expiración
   */
  private static stopExpirationCheck(): void {
    if (this.expirationCheckInterval) {
      clearInterval(this.expirationCheckInterval);
      this.expirationCheckInterval = null;
    }
  }

  /**
   * Muestra una advertencia de expiración próxima
   */
  private static showExpirationWarning(minutesRemaining: number): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Sesión por expirar', {
        body: `Tu sesión expirará en ${minutesRemaining} minutos. ¿Deseas renovarla?`,
        icon: '/favicon.ico'
      });
    } else {
      // Fallback a alert si las notificaciones no están disponibles
      const extend = confirm(`Tu sesión expirará en ${minutesRemaining} minutos. ¿Deseas renovarla?`);
      if (extend) {
        this.attemptTokenRefresh();
      }
    }
  }

  /**
   * Redirige al login cuando el token expira
   */
  private static redirectToLogin(): void {
    // Disparar evento personalizado para que los componentes puedan reaccionar
    window.dispatchEvent(new CustomEvent('tokenExpired'));
    
    // Redirigir después de un pequeño delay para permitir cleanup
    setTimeout(() => {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?reason=expired';
      }
    }, 100);
  }

  /**
   * Intenta renovar el token automáticamente
   */
  private static async attemptTokenRefresh(): Promise<void> {
    try {
      const currentToken = this.getToken();
      if (!currentToken) {
        return;
      }

      // Llamar al endpoint de renovación del backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/refresh-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.token) {
          this.setToken(data.data.token);
          console.log('✅ Token renovado automáticamente');
          
          // Mostrar notificación de renovación exitosa
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Sesión renovada', {
              body: 'Tu sesión ha sido extendida por 24 horas más.',
              icon: '/favicon.ico'
            });
          }
        }
      } else {
        console.log('❌ No se pudo renovar el token, redirigiendo al login...');
        this.removeToken();
        this.redirectToLogin();
      }
    } catch (error) {
      console.error('Error al renovar token:', error);
      this.removeToken();
      this.redirectToLogin();
    }
  }

  /**
   * Renueva manualmente el token
   */
  static async refreshTokenManually(): Promise<boolean> {
    try {
      await this.attemptTokenRefresh();
      return this.isTokenValid();
    } catch (error) {
      console.error('Error en renovación manual:', error);
      return false;
    }
  }

  /**
   * Obtiene información del token desde el backend
   */
  static async getTokenInfoFromBackend(): Promise<any> {
    try {
      const currentToken = this.getToken();
      if (!currentToken) {
        return null;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/token-info`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.data;
      } else {
        console.warn('No se pudo obtener información del token del backend');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener información del token:', error);
      return null;
    }
  }

  /**
   * Cierra sesión en el backend invalidando el token
   */
  static async logoutFromBackend(): Promise<void> {
    try {
      const currentToken = this.getToken();
      if (!currentToken) {
        return;
      }

      await fetch(`${import.meta.env.VITE_API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Logout realizado en el backend');
    } catch (error) {
      console.error('Error al hacer logout en el backend:', error);
    } finally {
      // Siempre limpiar el token local independientemente del resultado
      this.removeToken();
    }
  }

  /**
   * Inicializa el servicio de tokens
   */
  static initialize(): void {
    // Verificar si hay un token existente y comenzar la verificación
    if (this.isTokenValid()) {
      this.startExpirationCheck();
    }

    // Migrar token anterior si existe
    this.migrateLegacyToken();

    // Solicitar permisos de notificaciones
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  /**
   * Migra el token del sistema anterior al nuevo sistema
   */
  private static migrateLegacyToken(): void {
    const legacyToken = localStorage.getItem('token');
    const newTokenData = localStorage.getItem(this.TOKEN_KEY);

    if (legacyToken && !newTokenData) {
      this.setToken(legacyToken);
      localStorage.removeItem('token'); // Limpiar el token anterior
    }
  }

  /**
   * Obtiene el tiempo restante en formato legible
   */
  static getTimeRemainingFormatted(): string | null {
    const tokenInfo = this.getTokenInfo();
    if (!tokenInfo) {
      return null;
    }

    const timeRemaining = tokenInfo.timeRemaining;
    const hours = Math.floor(timeRemaining / (60 * 60 * 1000));
    const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }
}

// Compatibilidad con el código existente
export const getAuthToken = (): string | null => TokenService.getToken();
export const setAuthToken = (token: string): void => TokenService.setToken(token);
export const removeAuthToken = (): void => TokenService.removeToken();
export const isAuthenticated = (): boolean => TokenService.isTokenValid();
