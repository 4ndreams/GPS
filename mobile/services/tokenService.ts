import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { config } from './config';

interface TokenData {
  token: string;
  expiresAt: number;
  issuedAt: number;
}

export class TokenService {
  private static readonly TOKEN_KEY = 'auth_token_data';
  private static readonly TOKEN_DURATION = config.TOKEN_DURATION;
  private static readonly REFRESH_THRESHOLD = 2 * 60 * 60 * 1000;

  private static expirationCheckInterval: ReturnType<typeof setInterval> | null = null;

  static async setToken(token: string): Promise<void> {
    const now = Date.now();
    const tokenData: TokenData = {
      token,
      issuedAt: now,
      expiresAt: now + this.TOKEN_DURATION,
    };

    await AsyncStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokenData));
    this.startExpirationCheck();
  }

  static async getToken(): Promise<string | null> {
    try {
      const storedData = await AsyncStorage.getItem(this.TOKEN_KEY);
      if (!storedData) return null;

      const tokenData: TokenData = JSON.parse(storedData);
      const now = Date.now();

      if (now >= tokenData.expiresAt) {
        console.log('⚠️ Token expirado');
        await this.removeToken();
        return null;
      }

      return tokenData.token;
    } catch (error) {
      console.error('Error al obtener token:', error);
      await this.removeToken();
      return null;
    }
  }

  static async isTokenValid(): Promise<boolean> {
    return (await this.getToken()) !== null;
  }

  static async shouldRefreshToken(): Promise<boolean> {
    const storedData = await AsyncStorage.getItem(this.TOKEN_KEY);
    if (!storedData) return false;

    const tokenData: TokenData = JSON.parse(storedData);
    const now = Date.now();
    const timeUntilExpiration = tokenData.expiresAt - now;

    return timeUntilExpiration <= this.REFRESH_THRESHOLD && timeUntilExpiration > 0;
  }

  static async getTokenInfo(): Promise<{
    timeRemaining: number;
    shouldRefresh: boolean;
    expiresAt: Date;
  } | null> {
    const storedData = await AsyncStorage.getItem(this.TOKEN_KEY);
    if (!storedData) return null;

    const tokenData: TokenData = JSON.parse(storedData);
    const now = Date.now();
    const timeRemaining = tokenData.expiresAt - now;

    return {
      timeRemaining,
      shouldRefresh: await this.shouldRefreshToken(),
      expiresAt: new Date(tokenData.expiresAt),
    };
  }

  static async removeToken(): Promise<void> {
    await AsyncStorage.removeItem(this.TOKEN_KEY);
  }

  private static startExpirationCheck(): void {
    this.stopExpirationCheck();

    this.expirationCheckInterval = setInterval(async () => {
      const tokenInfo = await this.getTokenInfo();
      if (!tokenInfo) {
        this.stopExpirationCheck();
        return;
      }

      if (tokenInfo.timeRemaining <= 0) {
        console.log('⏰ Token expirado');
        await this.removeToken();
        this.stopExpirationCheck();
        return;
      }

      if (tokenInfo.timeRemaining <= 10 * 60 * 1000 && tokenInfo.timeRemaining > 9 * 60 * 1000) {
        this.showExpirationWarning(Math.floor(tokenInfo.timeRemaining / 60000));
      }
    }, 60000);
  }

  private static stopExpirationCheck(): void {
    if (this.expirationCheckInterval) {
      clearInterval(this.expirationCheckInterval);
      this.expirationCheckInterval = null;
    }
  }

  private static showExpirationWarning(minutesRemaining: number): void {
    Alert.alert(
      'Sesión por expirar',
      `Tu sesión expirará en ${minutesRemaining} minutos. ¿Deseas renovarla?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Renovar',
          onPress: () => this.attemptTokenRefresh(),
        },
      ]
    );
  }

  private static async attemptTokenRefresh(): Promise<void> {
    try {
      const currentToken = await this.getToken();
      if (!currentToken) return;

      const response = await fetch(`${config.API_BASE_URL}/refresh-token`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data?.token) {
          await this.setToken(data.data.token);
          console.log('✅ Token renovado automáticamente');
        }
      } else {
        console.log('❌ No se pudo renovar el token');
        await this.removeToken();
      }
    } catch (error) {
      console.error('Error al renovar token:', error);
      await this.removeToken();
    }
  }

  static async refreshTokenManually(): Promise<boolean> {
    try {
      await this.attemptTokenRefresh();
      return await this.isTokenValid();
    } catch (error) {
      console.error('Error en renovación manual:', error);
      return false;
    }
  }

  static async logoutFromBackend(): Promise<void> {
    try {
      const token = await this.getToken();
      if (!token) return;

      await fetch(`${config.API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('✅ Logout realizado');
    } catch (error) {
      console.error('Error al hacer logout:', error);
    } finally {
      await this.removeToken();
    }
  }

  static async getTimeRemainingFormatted(): Promise<string | null> {
    const info = await this.getTokenInfo();
    if (!info) return null;

    const { timeRemaining } = info;
    const hours = Math.floor(timeRemaining / (60 * 60 * 1000));
    const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));

    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }
}

// Export para compatibilidad
export const getAuthToken = async (): Promise<string | null> => TokenService.getToken();
export const setAuthToken = async (token: string): Promise<void> => TokenService.setToken(token);
export const removeAuthToken = async (): Promise<void> => TokenService.removeToken();
export const isAuthenticated = async (): Promise<boolean> => TokenService.isTokenValid();
